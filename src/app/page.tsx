'use client';

import { useState, useEffect } from 'react';
import ServiceStats from '@/components/services/ServiceStats';
import ServiceToolbar from '@/components/services/ServiceToolbar';
import ServiceTable from '@/components/services/ServiceTable';
import ServiceGrid from '@/components/services/ServiceGrid';
import ServicePagination from '@/components/services/ServicePagination';
import DashboardServicePreview from '@/components/services/DashboardServicePreview';
import { Package, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, lowStock: 0 });
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive' | 'lowStock'>('all');
  const limit = 10;
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [statsLoaded, setStatsLoaded] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/services/stats');
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch (e) {
    } finally {
      setStatsLoaded(true);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await fetch('/api/services?stockStatus=Low Stock&limit=5');
      const json = await res.json();
      if (json.success) setLowStockProducts(json.data.services);
    } catch (e) {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/services?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`;
      if (activeFilter === 'active') url += '&status=Active';
      if (activeFilter === 'inactive') url += '&status=Inactive';
      if (activeFilter === 'lowStock') url += '&stockStatus=Low Stock';
      
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data.services);
        setTotalPages(json.data.totalPages);
        setTotalItems(json.data.total);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchLowStock();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, activeFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p: any) => p.id));
    }
  };

  const handleBulkUpdateStatus = async (status: string) => {
    if (!confirm(`Are you sure you want to mark ${selectedIds.length} services as ${status}?`)) return;
    
    setLoading(true);
    try {
      await Promise.all(selectedIds.map(id => 
        fetch(`/api/services/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        })
      ));
      setSelectedIds([]);
      fetchProducts();
      fetchStats();
    } catch (e) {
      console.error("Bulk update failed", e);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Optimistic UI update
    setProducts(prev => {
      const updated = prev.map((p: any) => p.id === id ? { ...p, status: newStatus } : p);
      if (activeFilter === 'active' && newStatus !== 'Active') return updated.filter(p => p.id !== id);
      if (activeFilter === 'inactive' && newStatus !== 'Inactive') return updated.filter(p => p.id !== id);
      return updated;
    });
    
    try {
      await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchStats();
      fetchProducts();
    } catch (e) {
      console.error("Update failed", e);
      fetchProducts(); // Revert on failure
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    setLoading(true);
    try {
      await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      });
      fetchProducts();
      fetchStats();
    } catch (e) {
      console.error("Delete failed", e);
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} services? This action cannot be undone.`)) return;

    setLoading(true);
    try {
      await Promise.all(selectedIds.map(id => 
        fetch(`/api/services/${id}`, { method: 'DELETE' })
      ));
      setSelectedIds([]);
      fetchProducts();
      fetchStats();
    } catch (e) {
      console.error("Bulk delete failed", e);
      setLoading(false);
    }
  };

  if (statsLoaded && !loading && stats.total === 0) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center justify-center text-center max-w-md w-full relative">
          <div className="w-32 h-32 bg-[#F0F4FF] rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-primary/40"></div>
            <div className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-primary/30"></div>
            <div className="absolute top-10 left-4 w-2.5 h-2.5 rounded-full bg-primary/20"></div>
            <div className="absolute bottom-8 right-6 w-1 h-1 rounded-full bg-primary/50"></div>
            <Package className="w-14 h-14 text-primary stroke-[1.5]" />
          </div>
          <h2 className="text-[22px] font-bold text-navy mb-3">No services yet!</h2>
          <p className="text-text-muted text-[13px] leading-relaxed mb-8">
            You haven't added any services to your store.<br />
            Start by adding your first service.
          </p>
          <Link 
            href="/services/new" 
            className="bg-[#1a56db] text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex gap-6 relative">
      <div className={`flex-1 min-w-0 transition-all duration-300 ${selectedService ? 'xl:pr-6' : ''}`}>
        <ServiceStats 
          stats={stats} 
          activeFilter={activeFilter}
          onFilterChange={(f) => {
            setActiveFilter(f);
            setCurrentPage(1);
          }}
        />
        <ServiceToolbar 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          isSelectionMode={isSelectionMode}
          onSelectionModeToggle={() => {
            setIsSelectionMode(!isSelectionMode);
            if (isSelectionMode) setSelectedIds([]); // Clear selection when exiting mode
          }}
        />
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : viewMode === 'list' ? (
          <ServiceTable 
            services={products} 
            onEdit={(service) => console.log('Edit', service)}
            onDelete={handleDelete}
            onPreview={(service) => setSelectedService(service)}
            isSelectionMode={isSelectionMode}
            selectedServiceIds={selectedIds}
            onToggleSelect={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
            onSelectAll={(checked) => setSelectedIds(checked ? products.map(p => p.id) : [])}
          />
        ) : (
          <ServiceGrid 
            services={products}
            onEdit={(service) => console.log('Edit', service)}
            onDelete={handleDelete}
            onPreview={(service) => setSelectedService(service)}
            isSelectionMode={isSelectionMode}
            selectedServiceIds={selectedIds}
            onToggleSelect={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
          />
        )}
        
        {!loading && (
          <ServicePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={limit}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {selectedService && (
        <DashboardServicePreview 
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onEdit={(service) => {
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}
