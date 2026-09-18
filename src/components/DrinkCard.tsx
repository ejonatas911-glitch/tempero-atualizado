import React from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import { Drink } from '../types';
import { PRIMARY_PHONE_RAW } from '../data';

interface DrinkCardProps {
  key?: string | number;
  drink: Drink;
  onSelect: (drink: Drink) => void;
  cartCount: number;
}

export default function DrinkCard({ drink, onSelect, cartCount }: DrinkCardProps) {
  // Find the lowest price option
  const prices = Object.values(drink.prices);
  const startingPrice = Math.min(...prices);

  return (
    <div
      id={`drink-card-${drink.id}`}
      onClick={() => onSelect(drink)}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#F4A300]/25 glass-panel shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:border-[#F4A300]/65 cursor-pointer"
    >
      {/* Photo element */}
      <div className="relative h-36 w-full bg-black/40 overflow-hidden">
        <img
          src={drink.image}
          alt={drink.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 to-transparent" />

        {/* Floating Category Tag */}
        <span className="absolute left-2.5 top-2.5 rounded-md bg-[#F4A300] px-2 py-0.5 text-[9px] font-black text-[#111111] uppercase tracking-wider backdrop-blur-xs font-sans">
          {drink.type === 'juice' ? 'Polpa Natural' : 'Refrigerante'}
        </span>

        {/* Quantity in Cart Indicator */}
        {cartCount > 0 && (
          <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-linear-to-r from-[#FF7A00] to-[#E85D04] px-2.5 py-0.5 text-[10px] font-black text-white shadow-md shadow-brand-orange/20 animate-pulse">
            <CheckCircle className="h-3 w-3 stroke-[3.5] text-[#F4A300]" />
            <span>{cartCount}x</span>
          </div>
        )}
      </div>

      {/* Info elements */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1 mb-2.5">
          <h3 className="font-serif italic text-sm font-black text-white group-hover:text-[#F4A300] transition-colors leading-tight">
            {drink.name}
          </h3>
          <p className="text-[10px] text-[#FFF3E0]/75 mt-0.5">
            {drink.type === 'juice' ? 'Fruta batida bem gelada' : 'Opções de tamanho variados'}
          </p>
        </div>

        {/* Price Tag & Button Checkout trigger */}
        <div className="flex flex-col gap-2 w-full pt-2 border-t border-[#F4A300]/20">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] text-[#FFF3E0]/70 leading-none uppercase font-bold">A partir</span>
              <span className="font-mono text-xs font-black text-[#F4A300] mt-0.5">
                R$ {startingPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              id={`btn-add-drink-${drink.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(drink);
              }}
              className="flex h-7 items-center gap-1 rounded-full btn-premium px-3 text-[10px] font-black font-sans uppercase tracking-wider cursor-pointer"
            >
              <Plus className="h-3 w-3 stroke-[3]" />
              Escolher
            </button>
          </div>

          <a
            id={`btn-drink-wa-direct-${drink.id}`}
            href={`https://api.whatsapp.com/send?phone=${PRIMARY_PHONE_RAW}&text=${encodeURIComponent(
              `Olá! Gostaria de pedir a bebida: *${drink.name}* do Tempero Nordestino.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex h-8 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-black uppercase tracking-wider font-sans transition-all duration-300 shadow-md shadow-emerald-950/40 cursor-pointer border border-emerald-500/10"
          >
            <svg className="h-3 w-3 fill-current text-white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Pedir no WhatsApp
        </a>
      </div>
    </div>
  </div>
);
}
