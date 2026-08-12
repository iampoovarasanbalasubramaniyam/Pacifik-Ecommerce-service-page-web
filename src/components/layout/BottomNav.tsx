'use client';

import { LayoutGrid, ShoppingBag, FileText, Folder, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '#', icon: LayoutGrid },
    { name: 'Products', href: '/', icon: ShoppingBag },
    { name: 'Orders', href: '#', icon: FileText },
    { name: 'Categories', href: '#', icon: Folder },
    { name: 'More', href: '#', icon: MoreHorizontal },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-gray z-50 px-4 py-2 flex justify-between items-center pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.name === 'Products' && pathname === '/');
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex flex-col items-center justify-center w-16 h-12 gap-1 transition-colors ${isActive ? 'text-primary' : 'text-text-muted hover:text-navy'}`}
          >
            <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : 'text-text-muted'}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
