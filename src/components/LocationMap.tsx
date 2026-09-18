import React from 'react';
import { MapPin, Navigation, ExternalLink, Clock, Phone, Map } from 'lucide-react';

export default function LocationMap() {
  const restaurantAddress = "Rua do Posto BR Mania, Centro, nº 06, Arari - MA";
  const mapsSearchQuery = "Rua do Posto BR Mania, Centro, Arari - MA, Brazil";
  
  // Create a clean Google Maps directions link for the user
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsSearchQuery)}`;
  
  // Custom encoded static Maps query for the premium iframe display
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(restaurantAddress)}&t=&z=17&ie=UTF8&iwloc=&output=embed`;

  return (
    <div 
      id="restaurant-location-widget" 
      className="rounded-3xl border border-[#F4A300]/30 bg-[#111111]/95 text-white p-6 sm:p-8 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative glass-panel"
    >
      {/* Aesthetic glowing ambient lights background */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#F4A300]/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-brand-orange/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Left Column: Coordinates details, location information & highlighted button */}
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F4A300] text-[#111111] shadow-[0_0_15px_rgba(244,163,0,0.4)]">
                <MapPin className="h-5.5 w-5.5 stroke-[2.5]" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase text-[#F4A300] tracking-widest block font-sans">
                  📍 Venha nos Visitar
                </span>
                <h3 className="font-serif italic text-2xl font-black text-white leading-tight">
                  Nossa Localização Física
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#FFF3E0]/85 leading-relaxed font-sans max-w-xl">
              Estamos localizados no coração de <span className="font-extrabold text-white">Arari - Maranhão</span>! Venha saborear o legítimo tempero nordestino direto da nossa cozinha ou faça sua retirada com rapidez e segurança.
            </p>

            {/* Structured Info items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1 hover:border-[#F4A300]/30 transition duration-350">
                <span className="text-[9.5px] uppercase font-black text-[#F4A300] tracking-wider block font-sans">Endereço Oficial</span>
                <p className="text-xs font-bold text-white leading-snug font-sans">
                  Rua do Posto BR Mania, Centro, nº 06, Arari - MA
                </p>
                <span className="text-[10px] text-[#FFF3E0]/60 block pt-0.5">Próximo ao Posto BR Mania</span>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1 hover:border-[#F4A300]/30 transition duration-350">
                <span className="text-[9.5px] uppercase font-black text-[#F4A300] tracking-wider block font-sans">Horário Comercial</span>
                <p className="text-xs font-bold text-white leading-snug font-sans">
                  Aberto todos os dias
                </p>
                <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-400 font-extrabold mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Das 11:00 às 18:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Destaque / Highlighted Premium Button */}
          <div className="pt-4 border-t border-white/10">
            <a
              id="btn-open-restaurant-maps"
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex w-full sm:w-auto overflow-hidden rounded-full bg-linear-to-r from-[#FF7A00] via-[#E85D04] to-[#F4A300] border border-[#F4A300]/40 text-black font-black px-8 py-4.5 text-xs uppercase tracking-widest transition-all hover:scale-103 hover:shadow-[0_0_30px_rgba(244,163,0,0.4)] duration-300 items-center justify-center gap-3.5 cursor-pointer group active:scale-98"
            >
              {/* Highlight flash animation */}
              <span className="absolute inset-x-0 top-0 h-[100px] w-full bg-gradient-to-b from-white/20 to-transparent skew-y-12 -translate-y-10 group-hover:translate-y-5 transition-transform duration-700" />
              
              <Navigation className="h-5 w-5 fill-current text-[#111111] animate-pulse" />
              <span className="text-[#111111] font-black select-none tracking-widest">
                Traçar Rota / Abrir no GPS 📍
              </span>
              <ExternalLink className="h-4 w-4 text-[#111111] opacity-75 shrink-0" />
            </a>
            
            <p className="text-[10px] text-[#FFF3E0]/60 mt-3 font-sans">
              * Abre diretamente o Google Maps, Waze ou Apple Maps em seu celular para guiar até o Tempero Nordestino.
            </p>
          </div>
        </div>

        {/* Right Column: Visual responsive embedded maps iframe */}
        <div className="w-full lg:w-[440px] shrink-0">
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#F4A300]/30 bg-black/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)] h-64 sm:h-80 flex flex-col justify-center items-center">
            
            <iframe
              id="restaurant-maps-iframe"
              title="Endereço Físico do Tempero Nordestino"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full grayscale-[5%] contrast-[105%]"
            />

            {/* Floating marker summary card */}
            <div className="absolute top-3 left-3 right-3 z-10 bg-[#111111]/90 backdrop-blur-md border border-[#F4A300]/20 rounded-xl p-3 flex items-center justify-between shadow-lg pointer-events-none">
              <div className="flex items-center gap-2">
                <img 
                  src="https://lh3.googleusercontent.com/d/1PX6SJHm-eUJUnPElnmHBcK1EOz6vZ7ND" 
                  alt="Logo Mini" 
                  className="h-7 w-7 rounded-full object-cover border border-[#F4A300]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-[11px] font-black text-white leading-none">Tempero Nordestino</h4>
                  <span className="text-[9px] font-semibold text-[#F4A300] block mt-0.5">Arari - Maranhão</span>
                </div>
              </div>
              
              <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[8.5px] font-black text-emerald-400 capitalize tracking-wider font-sans">
                📍 Ponto Físico
              </div>
            </div>

            {/* Coordinate readout */}
            <div className="absolute bottom-3 right-3 z-10 rounded-lg bg-black/80 border border-white/10 px-2.5 py-1 text-[8.5px] font-mono tracking-wider font-bold text-[#F4A300] pointer-events-none shadow-md">
              REF: CENTRO • Nº 06
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
