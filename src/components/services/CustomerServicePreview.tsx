import { X, Star, ShoppingCart, Heart, ChevronRight, ChevronLeft } from 'lucide-react';

interface ProductPreviewProps {
  product: any;
  onClose: () => void;
  className?: string;
}

export default function ProductPreview({ product, onClose, className }: ProductPreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: product.currency || 'INR' }).format(amount || 0);
  };

  const images = product.coverImage ? [product.coverImage, ...(product.images || [])] : [];

  return (
    <div className={className || "w-80 flex-shrink-0 h-[calc(100vh-140px)] sticky top-28 hidden lg:block bg-gray-50 relative overflow-hidden flex flex-col"}>
      {/* Mobile App Scrollable Content */}
      <div className="flex-1 bg-white relative overflow-y-auto no-scrollbar flex flex-col">
        
        {/* Header / Images */}
        <div className="relative w-full aspect-square bg-gray-100 flex-shrink-0">
          {images.length > 0 ? (
             <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
              No Image
            </div>
          )}
          
          {/* Top Navbar */}
          <div className="absolute top-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/30 to-transparent">
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-navy shadow-sm transition hover:bg-white">
              <X className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-navy shadow-sm transition hover:bg-white hover:text-red-500">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          
          {/* Mock Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 w-full flex justify-center gap-1.5">
              {images.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-4 bg-navy' : 'w-1.5 bg-white/70'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <span className="text-xs font-bold text-[#004EEB] uppercase tracking-wider mb-1 block">
                {product.brand?.name || 'GENERIC BRAND'}
              </span>
              <h1 className="text-xl font-bold text-navy leading-tight mb-2">{product.name || 'Untitled Product'}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-baseline gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-black text-navy">{formatCurrency(product.salePrice)}</span>
                  <span className="text-sm font-medium text-text-muted line-through">{formatCurrency(product.price)}</span>
                </>
              ) : (
                <span className="text-2xl font-black text-navy">{formatCurrency(product.price)}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1 ml-auto">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-navy">4.8</span>
              <span className="text-xs text-text-muted">(124)</span>
            </div>
          </div>
          
          <hr className="border-gray-100 my-5" />

          {/* Variations as Chips */}
          {product.variations && product.variations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-navy mb-3">Options</h3>
              <div className="flex flex-wrap gap-2">
                {product.variations.map((v: any, i: number) => (
                  <button key={i} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${i === 0 ? 'border-[#004EEB] bg-blue-50 text-[#004EEB]' : 'border-gray-200 text-text-muted hover:border-gray-300'}`}>
                    {v.name}: {v.options}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
             <h3 className="text-sm font-bold text-navy mb-3">Description</h3>
             <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
               {product.description || 'This product does not have a description yet. Add one in the form to see it here.'}
             </p>
          </div>
          
          {/* Highlights / Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mb-6">
               <h3 className="text-sm font-bold text-navy mb-3">Highlights</h3>
               <div className="flex flex-wrap gap-2">
                 {product.tags.map((t: any, i: number) => (
                   <span key={i} className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-semibold text-navy">
                     {t.tag?.name || t.name || t}
                   </span>
                 ))}
               </div>
            </div>
          )}
        </div>

      </div>
      
      {/* Bottom Fixed Bar (Customer Action) */}
      <div className="w-full bg-white border-t border-gray-100 p-4 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10 relative">
        <button className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-[#004EEB] hover:bg-blue-100 transition">
          <ShoppingCart className="w-6 h-6" />
        </button>
        <button className="flex-1 h-14 rounded-2xl bg-navy text-white font-bold text-lg hover:bg-slate-800 transition shadow-lg shadow-navy/20">
          Buy Now
        </button>
      </div>
    </div>
  );
}
