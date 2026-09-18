import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Minus, Check, ArrowLeft } from 'lucide-react';
import { Dish, CartItem } from '../types';
import { DEFAULT_ACCOMPANIMENTS } from '../data';

interface DishCustomizationModalProps {
  dish: Dish;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export default function DishCustomizationModal({
  dish,
  onClose,
  onAddToCart,
}: DishCustomizationModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [removedAccompaniments, setRemovedAccompaniments] = useState<string[]>([]);
  const [observations, setObservations] = useState('');

  const toggleAccompaniment = (item: string) => {
    if (removedAccompaniments.includes(item)) {
      setRemovedAccompaniments(removedAccompaniments.filter(a => a !== item));
    } else {
      setRemovedAccompaniments([...removedAccompaniments, item]);
    }
  };

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAdd = () => {
    const cartItem: CartItem = {
      id: `${dish.id}-${removedAccompaniments.sort().join(',')}-${observations.trim().substring(0, 30)}`,
      itemId: dish.id,
      name: dish.name,
      type: 'dish',
      price: dish.price,
      quantity,
      removedAccompaniments,
      observations: observations.trim() || undefined,
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div id="dish-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        id="dish-modal-content"
         className="relative flex flex-col w-full max-w-lg overflow-hidden rounded-2xl bg-[#111111]/95 border border-[#F4A300]/30 shadow-2xl glass-panel text-white"
      >
        {/* Back Button (Arrow) */}
        <button
          id="btn-back-dish-modal"
          onClick={onClose}
          className="absolute left-3 top-3 z-10 flex h-8 px-3 items-center justify-center gap-1.5 rounded-full bg-black/60 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-md transition-all hover:bg-[#FF7A00] hover:text-white border border-white/10 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Voltar</span>
        </button>

        {/* Close Button */}
        <button
          id="btn-close-dish-modal"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-[#FF7A00] border border-white/10 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Dish Image */}
        <div className="relative h-48 md:h-56 w-full bg-[#111111]">
          <img
            src={dish.image}
            alt={dish.name}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <h3 className="text-xl md:text-2xl font-serif italic font-black text-white leading-tight drop-shadow-md">{dish.name}</h3>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-h-[50vh] md:max-h-[55vh] scrollbar-thin">
          {/* Description */}
          <div className="space-y-4">
            <p className="text-xs md:text-sm text-[#FFF3E0] leading-relaxed font-sans">{dish.description}</p>
            <div className="pt-3 flex items-center justify-between border-t border-[#F4A300]/20">
              <span className="text-[10px] text-[#FFF3E0]/70 uppercase tracking-widest font-black">Preço Unitário</span>
              <span className="text-lg font-black text-[#F4A300] font-mono">R$ {dish.price.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Accompaniments Block */}
          <div className="rounded-xl bg-[#111111]/60 border border-[#F4A300]/15 p-4.5 space-y-3.5">
            <div className="space-y-1">
              <h4 className="text-xs font-black font-sans tracking-wider text-[#F4A300] uppercase flex items-center gap-1.5 leading-none">
                ★ Acompanhamentos Inclusos
              </h4>
              <p className="text-[10px] text-[#FFF3E0]/80">
                Todo prato acompanha os itens abaixo de forma tradicional. Desmarque livremente se desejar retirar da marmita:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {DEFAULT_ACCOMPANIMENTS.map((item) => {
                const isSelected = !removedAccompaniments.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAccompaniment(item)}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[#F4A300] bg-[#FF7A00]/10 text-white font-black'
                        : 'border-white/10 bg-transparent text-white/40 line-through'
                    }`}
                  >
                    <div className={`flex h-4.5 w-4.5 items-center justify-center rounded-md border transition-colors ${
                      isSelected ? 'bg-gradient-to-r from-[#FF7A00] to-[#E85D04] border-[#F4A300] text-white' : 'border-white/20 bg-black/40'
                    }`}>
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Observations */}
          <div className="space-y-2">
            <label htmlFor="dish-obs" className="text-[10px] font-black font-sans tracking-widest text-[#F4A300] uppercase block">
              Observações Personalizadas (Ex: sem cebola, ponto da carne...)
            </label>
            <textarea
              id="dish-obs"
              rows={2}
              maxLength={150}
              placeholder="Ex: sem cebola fresca na salada, carne bem passada, purê extra, etc."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full rounded-xl border border-[#F4A300]/20 bg-black/45 p-3 text-xs text-white placeholder-white/40 focus:border-[#F4A300] focus:outline-none focus:ring-1 focus:ring-[#F4A300] font-sans"
            />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="border-t border-[#F4A300]/25 bg-[#111111] p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          {/* Back Action button */}
          <button
            id="btn-back-dish-footer"
            onClick={onClose}
            className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-4 text-xs font-bold text-[#FFF3E0] transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-[#F4A300] stroke-[2.5]" />
            <span>Voltar</span>
          </button>

          {/* Quantity selector */}
          <div className="flex items-center rounded-full border border-white/15 p-1 bg-black/45">
            <button
              id="btn-decrement-qty"
              type="button"
              onClick={handleDecrement}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 active:scale-95 cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-black font-mono text-[#F4A300]">{quantity}</span>
            <button
              id="btn-increment-qty"
              type="button"
              onClick={handleIncrement}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 active:scale-95 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            id="btn-confirm-add-dish"
            onClick={handleAdd}
            className="flex-1 flex h-11 items-center justify-center gap-2 rounded-full btn-premium-gold font-extrabold text-[#111111] uppercase tracking-wider text-xs shadow-md cursor-pointer font-sans"
          >
            Adicionar • R$ {(dish.price * quantity).toFixed(2).replace('.', ',')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
