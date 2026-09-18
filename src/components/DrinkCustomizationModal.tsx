import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Drink, CartItem } from '../types';

interface DrinkCustomizationModalProps {
  drink: Drink;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export default function DrinkCustomizationModal({
  drink,
  onClose,
  onAddToCart,
}: DrinkCustomizationModalProps) {
  // Grab the first available size as default selection
  const sizeNames = Object.keys(drink.prices);
  const [selectedSize, setSelectedSize] = useState(sizeNames[0]);
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');

  // Update selected size if the drink changes
  useEffect(() => {
    setSelectedSize(Object.keys(drink.prices)[0]);
  }, [drink]);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const selectedUnitPrice = drink.prices[selectedSize] || 0;

  const handleAdd = () => {
    const cartItem: CartItem = {
      id: `${drink.id}-${selectedSize}-${observations.trim().substring(0, 30)}`,
      itemId: drink.id,
      name: `${drink.name} (${selectedSize})`,
      type: 'drink',
      price: selectedUnitPrice,
      quantity,
      selectedSize,
      observations: observations.trim() || undefined,
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div id="drink-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        id="drink-modal-content"
        className="relative flex flex-col w-full max-w-lg overflow-hidden rounded-2xl bg-[#111111]/95 border border-[#F4A300]/30 shadow-2xl glass-panel text-white"
      >
        {/* Back Button (Arrow) */}
        <button
          id="btn-back-drink-modal"
          onClick={onClose}
          className="absolute left-3 top-3 z-10 flex h-8 px-3 items-center justify-center gap-1.5 rounded-full bg-black/60 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-md transition-all hover:bg-[#FF7A00] hover:text-white border border-white/10 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Voltar</span>
        </button>

        {/* Close Button */}
        <button
          id="btn-close-drink-modal"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-[#FF7A00] border border-white/10 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Drink Image */}
        <div className="relative h-44 md:h-48 w-full bg-[#111111]">
          <img
            src={drink.image}
            alt={drink.name}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <h3 className="text-xl md:text-2xl font-serif italic font-black text-white leading-tight drop-shadow-md">{drink.name}</h3>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-h-[50vh] md:max-h-[55vh] scrollbar-thin">
          {/* Header Description */}
          <div>
            <p className="text-xs md:text-sm text-[#FFF3E0] leading-relaxed">
              {drink.type === 'juice' ? 'Suco natural feito na hora, geladinho e refrescante.' : 'Bebida super gelada para acompanhar seu prato no capricho.'}
            </p>
          </div>

          {/* Size Choice Box */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black font-sans tracking-widest text-[#F4A300] uppercase">
              Escolha o formato / tamanho:
            </h4>

            <div className="grid grid-cols-1 gap-2 bg-[#111111]/40 p-1 rounded-xl">
              {sizeNames.map((size) => {
                const isSelected = size === selectedSize;
                const price = drink.prices[size];
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`flex items-center justify-between rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[#F4A300] bg-[#FF7A00]/10 text-white font-black'
                        : 'border-white/10 bg-black/20 hover:border-[#F4A300]/30 text-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? 'border-[#F4A300] bg-gradient-to-r from-[#FF7A00] to-[#E85D04]' : 'border-white/20 bg-black/45'
                      }`}>
                        {isSelected && <div className="h-2 w-2 rounded-full bg-[#F4A300]" />}
                      </div>
                      <span className="text-xs font-sans font-medium">{size}</span>
                    </div>
                    <span className="text-xs font-black font-mono text-[#F4A300]">R$ {price.toFixed(2).replace('.', ',')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Observations */}
          <div className="space-y-2">
            <label htmlFor="drink-obs" className="text-[10px] font-black font-sans tracking-widest text-[#F4A300] uppercase block">
              Instruções e Observações (Gelo, Açúcar...)
            </label>
            <textarea
              id="drink-obs"
              rows={2}
              maxLength={150}
              placeholder="Ex: mandar copo descartável e gelo, sem açúcar, adoçante à parte..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full rounded-xl border border-[#F4A300]/20 bg-black/45 p-3 text-xs text-white placeholder-white/40 focus:border-[#F4A300] focus:outline-none focus:ring-1 focus:ring-[#F4A300]"
            />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="border-t border-[#F4A300]/25 bg-[#111111] p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          {/* Back Action button */}
          <button
            id="btn-back-drink-footer"
            onClick={onClose}
            className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-4 text-xs font-bold text-[#FFF3E0] transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-[#F4A300] stroke-[2.5]" />
            <span>Voltar</span>
          </button>

          {/* Quantity selector */}
          <div className="flex items-center rounded-full border border-white/15 p-1 bg-black/45">
            <button
              id="btn-decrement-drink-qty"
              type="button"
              onClick={handleDecrement}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 active:scale-95 cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-black font-mono text-[#F4A300]">{quantity}</span>
            <button
              id="btn-increment-drink-qty"
              type="button"
              onClick={handleIncrement}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 active:scale-95 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            id="btn-confirm-add-drink"
            onClick={handleAdd}
            className="flex-1 flex h-11 items-center justify-center gap-2 rounded-full btn-premium-gold font-extrabold text-[#111111] uppercase tracking-wider text-xs shadow-md cursor-pointer font-sans"
          >
            Adicionar • R$ {(selectedUnitPrice * quantity).toFixed(2).replace('.', ',')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
