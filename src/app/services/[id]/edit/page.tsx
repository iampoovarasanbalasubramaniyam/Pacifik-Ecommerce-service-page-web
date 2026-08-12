'use client';

import { useEffect, useState, use } from 'react';
import ServiceForm from '@/components/services/ServiceForm';
import { useRouter } from 'next/navigation';

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${unwrappedParams.id}`);
      const json = await res.json();
      if (json.success) setService(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [unwrappedParams.id]);

  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/services/${unwrappedParams.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'Failed to update service');
    }

    router.push('/');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/services/${unwrappedParams.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        router.push('/');
      } else {
        alert(json.error?.message || 'Failed to delete service');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return <div className="text-center p-8 text-red-600 font-bold">Service not found</div>;
  }

  return (
    <div className="pb-6">
      <ServiceForm initialData={service} onSubmit={handleSubmit} onDelete={handleDelete} />
    </div>
  );
}
