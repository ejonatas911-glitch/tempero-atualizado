import React from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import { Dish } from '../types';
import { PRIMARY_PHONE_RAW } from '../data';

interface DishCardProps {
  key?: string | number;
  dish: Dish;
  onSelect: (dish: Dish) => void;
  cartCount: number;
}

export default function DishCard({ dish, onSelect, cartCount }: DishCardProps) {
  return (
    <div
      id={`dish-card-${dish.id}`}
      onClick={() => onSelect(dish)}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#F4A300]/25 glass-panel shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#F4A300]/60 cursor-pointer"
    >
      {/* Dish Photo */}
      <div className="relative h-48 w-full bg-black/40 overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent" />
        
        {/* Quantity in Cart indicator */}
        {cartCount > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-linear-to-r from-[#FF7A00] to-[#E85D04] px-3 py-1 text-[10.5px] font-black text-white shadow-md shadow-brand-orange/20 animate-pulse">
            <CheckCircle className="h-3 w-3 stroke-[3.5] text-[#F4A300]" />
            <span>{cartCount}x</span>
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex-1 space-y-2 mb-4">
          <h3 className="font-serif italic text-base font-black text-white group-hover:text-[#F4A300] transition-colors leading-tight">
            {dish.name}
          </h3>
          <p className="line-clamp-2 text-xs text-[#FFF3E0]/85 leading-relaxed font-sans">
            {dish.description}
          </p>
        </div>

        {/* Accompaniments Quick-Tag (Included by default) */}
        <div className="mb-4">
          <span className="text-[10px] font-black text-[#F4A300] bg-[#F4A300]/10 border border-[#F4A300]/20 px-3 py-1 rounded inline-block font-sans uppercase tracking-wider">
            ★ Acomp. Arroz, Feijão e +4 Itens
          </span>
        </div>

        {/* Price & Add CTA Footer */}
        <div className="flex flex-col gap-2.5 w-full pt-3.5 border-t border-[#F4A300]/20">
          <div className="flex items-center justify-between w-full">
            <span className="font-mono text-base font-black text-[#F4A300]">
              R$ {dish.price.toFixed(2).replace('.', ',')}
            </span>
            
            <button
              id={`btn-add-${dish.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(dish);
              }}
              className="flex h-8.5 items-center gap-1.5 rounded-full btn-premium px-4 text-[11px] font-black font-sans uppercase tracking-wider cursor-pointer"
            >
              <Plus className="h-3 w-3 stroke-[3]" />
              Adicionar
            </button>
          </div>

          <a
            id={`btn-wa-direct-${dish.id}`}
            href={`https://api.whatsapp.com/send?phone=${PRIMARY_PHONE_RAW}&text=${encodeURIComponent(
              `Olá! Gostaria de pedir o prato tradicional: *${dish.name}* (Valor: R$ ${dish.price.toFixed(2).replace('.', ',')}) com os acompanhamentos padrão do Tempero Nordestino.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider font-sans transition-all duration-300 shadow-lg shadow-emerald-950/45 cursor-pointer border border-emerald-500/20"
          >
            <svg className="h-3.5 w-3.5 fill-current text-white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Pedir no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
