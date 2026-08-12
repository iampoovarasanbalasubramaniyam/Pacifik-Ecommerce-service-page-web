import { Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-between items-center py-3 px-4 md:px-8 bg-white border-b border-gray-200 relative z-30">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 border border-border-gray rounded-lg text-navy">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-navy tracking-tight">Services</h1>
          <p className="hidden md:block text-text-muted text-sm mt-1">Manage and organize your store services</p>
          <p className="md:hidden text-text-muted text-[10px] mt-0.5">Manage and organize your store services</p>
        </div>
      </div>
    </header>
  );
}
