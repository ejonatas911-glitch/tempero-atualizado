import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShoppingCart,
  Flame,
  Beef,
  Fish,
  Drumstick,
  Clock,
  MapPin,
  UtensilsCrossed,
  Sparkles,
  Phone,
  HelpCircle,
  ArrowLeft,
  QrCode,
  Banknote,
  CreditCard
} from 'lucide-react';

import { DISHES, DRINKS, PRIMARY_PHONE_RAW, PRIMARY_PHONE_FORMATTED, SECONDARY_PHONE_RAW, SECONDARY_PHONE_FORMATTED } from './data';
import { Dish, Drink, CartItem } from './types';
import DishCard from './components/DishCard';
import DrinkCard from './components/DrinkCard';
import DishCustomizationModal from './components/DishCustomizationModal';
import DrinkCustomizationModal from './components/DrinkCustomizationModal';
import CartDrawer from './components/CartDrawer';
import LocationMap from './components/LocationMap';
import MonteMarmitaModal from './components/MonteMarmitaModal';

export default function App() {
  // Navigation & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart State (Initialized from localStorage if available)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      localStorage.removeItem('tempero-nordestino-cart'); // Clear any old cart items
      const savedCart = localStorage.getItem('tempero-nordestino-cart-v3');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Persist cart
  useEffect(() => {
    localStorage.setItem('tempero-nordestino-cart-v3', JSON.stringify(cart));
  }, [cart]);

  // Modals Visibility
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMonteMarmitaOpen, setIsMonteMarmitaOpen] = useState<boolean>(false);

  // Quick categories
  const categories = [
    { id: 'all', label: 'Ver Tudo', icon: UtensilsCrossed },
    { id: 'carnes', label: 'Carnes', icon: Beef },
    { id: 'peixes', label: 'Peixes', icon: Fish },
    { id: 'frango', label: 'Frango', icon: Drumstick },
    { id: 'sucos', label: 'Sucos Naturais', icon: Sparkles },
    { id: 'refrigerantes', label: 'Refrigerantes', icon: Flame },
  ];

  // Map of counts inside the cart for visual badge indicators
  const cartCounts = useMemo(() => {
    const counts: { [itemId: string]: number } = {};
    cart.forEach(item => {
      counts[item.itemId] = (counts[item.itemId] || 0) + item.quantity;
    });
    return counts;
  }, [cart]);

  // Cart calculation metrics
  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  // Filter Logic: Dishes and Drinks
  const filteredDishes = useMemo(() => {
    return DISHES.filter(dish => {
      const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (selectedCategory === 'all') return matchesSearch;
      if (selectedCategory === 'sucos' || selectedCategory === 'refrigerantes') return false;
      return dish.category === selectedCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const filteredDrinks = useMemo(() => {
    return DRINKS.filter(drink => {
      const matchesSearch = drink.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (selectedCategory === 'all') return matchesSearch;
      if (selectedCategory === 'sucos') return drink.type === 'juice' && matchesSearch;
      if (selectedCategory === 'refrigerantes') return drink.type === 'soda' && matchesSearch;
      return false; // Grouped by standard categories
    });
  }, [selectedCategory, searchQuery]);

  // Cart callbacks
  const handleAddToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(item => item.id === newItem.id);
      if (existingIndex > -1) {
        const copy = [...prevCart];
        copy[existingIndex].quantity += newItem.quantity;
        return copy;
      }
      return [...prevCart, newItem];
    });
  };

  const handleUpdateQuantity = (id: string, amount: number) => {
    setCart((prevCart) => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSelectDishById = (dish: Dish) => {
    setSelectedDish(dish);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF8C00] via-[#FF6A00] to-[#E85D04] text-white selection:bg-[#F4A300]/40 pb-24 md:pb-12 font-sans relative overflow-x-hidden">
      
      {/* Decorative ambient background lighting highlights */}
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-[#F4A300]/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[450px] h-[450px] rounded-full bg-black/40 blur-[130px] pointer-events-none" />

      {/* TOP NOTIFICATION BAR */}
      <div className="bg-[#111111]/95 text-[#FFF3E0] border-b border-[#F4A300]/25 px-4 py-2.5 text-center text-[10px] sm:text-[11px] font-black tracking-widest uppercase font-sans flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 shadow-xl relative z-40 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-[#F4A300]" />
          <span>Rua do Posto BR Mania, Centro, nº 06, Arari - MA</span>
        </div>
        <span className="hidden sm:inline text-[#F4A300]/40">•</span>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <a 
            href={`https://wa.me/${PRIMARY_PHONE_RAW}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#F4A300] text-[#111111] px-3.5 py-1 rounded-full text-[10px] font-black hover:bg-white hover:text-black transition-all duration-300 shadow-md"
          >
            <Phone className="h-3 w-3 stroke-[2.5]" />
            <span>WhatsApp: {PRIMARY_PHONE_FORMATTED}</span>
          </a>
          <a 
            href={`https://wa.me/${SECONDARY_PHONE_RAW}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#111111] text-[#FFF3E0] border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold hover:border-[#F4A300] hover:text-[#F4A300] transition-all duration-300"
          >
            <span>Tel 2: {SECONDARY_PHONE_FORMATTED}</span>
          </a>
        </div>
      </div>

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 w-full border-b border-[#F4A300]/20 bg-[#111111]/90 backdrop-blur-md shadow-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          
          {/* Logo brand wrapper */}
          <div className="flex items-center gap-3">
            <div className="relative group flex h-14 w-14 shrink-0 items-center justify-center rounded-full overflow-hidden transition-all duration-300 hover:scale-105 border border-[#F4A300]/45 shadow-lg bg-black/40">
              <img 
                src="https://lh3.googleusercontent.com/d/1PX6SJHm-eUJUnPElnmHBcK1EOz6vZ7ND" 
                alt="Logo Tempero Nordestino" 
                className="h-full w-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif italic text-base font-black text-white leading-none">Tempero Nordestino</span>
              <span className="text-[9.5px] font-black text-[#F4A300] uppercase tracking-wider mt-0.5">Arari - Maranhão</span>
            </div>
          </div>

          {/* Business Timings overview for Trust */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-[#FFF3E0]/90">
            <div className="flex items-center gap-1.5 border-r border-[#F4A300]/25 pr-6">
              <Clock className="h-4 w-4 text-[#F4A300]" />
              <span>Aberto das <span className="font-black text-white">11:00 às 18:00</span></span>
            </div>
            <div className="flex items-center gap-1.5 border-r border-[#F4A300]/25 pr-6">
              <Clock className="h-4 w-4 text-[#F4A300]" />
              <span>Entrega rápida: <span className="font-black text-white">10 a 20 min</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#F4A300]" />
              <span className="text-[#FFF3E0]/80">Próximo ao <span className="font-black text-white">Posto BR Mania</span></span>
            </div>
          </div>

          {/* Desktop Right Hand Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMonteMarmitaOpen(true)}
              className="hidden md:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F4A300] px-4 py-2 text-xs font-black text-black uppercase tracking-wider shadow hover:scale-105 transition cursor-pointer"
            >
              <span>🍱 Monte sua Marmita</span>
            </button>

            <a
              href={`https://wa.me/${PRIMARY_PHONE_RAW}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-[#F4A300]/25 bg-[#111111]/60 px-4 py-2 text-xs font-black text-[#FFF3E0] hover:text-[#F4A300] hover:border-[#F4A300]/60 transition-all duration-305"
            >
              <Phone className="h-3.5 w-3.5 text-[#F4A300]" />
              <span className="hidden sm:inline">{PRIMARY_PHONE_FORMATTED}</span>
            </a>

            <button
              id="header-bag-trigger"
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-[#FF7A00] to-[#E85D04] border border-[#F4A300]/30 text-white shadow-xl hover:brightness-110 cursor-pointer transition-all active:scale-95"
            >
              <ShoppingCart className="h-4.5 w-4.5 stroke-[2.5]" />
              {totalItemsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#111111] font-mono text-[9px] font-black text-[#F4A300] ring-2 ring-[#F4A300]/65 animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 space-y-8 relative z-30">
        
        {/* BANNER DE EXCLUSIVIDADE EM DESTAQUE TOPO TOP */}
        <div className="relative z-40 rounded-3xl bg-gradient-to-r from-[#111111] via-[#1E1405] to-[#111111] border-2 border-[#F4A300] p-4 sm:p-5 shadow-[0_10px_40px_rgba(244,163,0,0.25)] text-center flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-[#F4A300] text-[#111111] text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-md shrink-0">
            ⭐ APP OFICIAL EXCLUSIVO ⭐
          </span>
          <p className="text-xs sm:text-sm font-black text-white tracking-wide font-sans">
            Plataforma 100% exclusiva do <span className="text-[#F4A300] underline decoration-[#F4A300]/60 font-extrabold">Restaurante Tempero Nordestino</span> • Arari - MA. Pedidos direto na nossa cozinha!
          </p>
        </div>

        {/* TOPO TOP: BOTAO DE PEDIR MARMITA EM DESTAQUE ABSOLUTO */}
        <div id="topo-top-marmita-cta" className="relative z-40 pt-1 pb-2">
          <div className="relative rounded-3xl bg-[#111111]/95 border-2 border-[#F4A300] p-6 sm:p-8 shadow-[0_15px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 group">
            {/* Ambient golden glows */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#F4A300]/20 rounded-full blur-[70px] pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#FF7A00]/20 rounded-full blur-[70px] pointer-events-none" />

            <div className="flex items-center gap-4 sm:gap-5 relative z-10 text-center sm:text-left">
              <div className="space-y-1.5">
                <h2 className="font-serif italic text-2xl sm:text-3xl font-black text-white leading-tight">
                  Monte sua Marmita Opção por Opção 🍱
                </h2>
                <p className="text-xs sm:text-sm text-[#FFF3E0]/80 font-sans max-w-xl">
                  Escolha arroz, feijão, macarrão, farofa maranhense, salada fresca, purê e seu tipo de carne preferido, tudo passo a passo e bem organizadinho!
                </p>
              </div>
            </div>

            <button
              id="btn-big-hero-monte-marmita"
              onClick={() => setIsMonteMarmitaOpen(true)}
              className="relative z-10 w-full sm:w-auto shrink-0 overflow-hidden rounded-full bg-gradient-to-r from-[#FF7A00] via-[#E85D04] to-[#F4A300] text-[#111111] font-black px-8 py-5 text-sm uppercase tracking-widest shadow-[0_0_35px_rgba(244,163,0,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Monte Agora</span>
              <span className="text-lg">&rarr;</span>
            </button>
          </div>
        </div>

        {/* BIG CIRCULAR BRAND LOGO SHOWCASE HERO */}
        <div id="brand-supreme-highlight" className="relative text-center flex flex-col items-center justify-center space-y-5 py-4">
          
          <div className="relative w-full max-w-4xl mx-auto flex justify-center px-4">
            {/* Elegant, boundary-free glow behind the circular logo as requested */}
            <div className="absolute inset-0 bg-[#F4A300]/10 rounded-full blur-[80px] w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] mx-auto pointer-events-none" />
            
            {/* Big pure circular logo with soft, golden outer outline and glow shadow */}
            <div className="relative rounded-full overflow-hidden transition-all duration-550 hover:scale-[1.03] w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] flex items-center justify-center border-4 border-[#F4A300]/60 shadow-[0_0_50px_rgba(244,163,0,0.25)]">
              <img 
                src="https://lh3.googleusercontent.com/d/1PX6SJHm-eUJUnPElnmHBcK1EOz6vZ7ND" 
                alt="Logo Tempero Nordestino Oficial" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Mobile responsive metadata tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10.5px] font-black relative z-10 font-sans tracking-wide">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111]/85 text-white border border-[#F4A300]/30 px-3.5 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Aberto das 11h às 18h
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111]/85 text-white border border-[#F4A300]/30 px-3.5 py-1.5">
              <Clock className="h-3.5 w-3.5 text-[#F4A300]" />
              Entrega em Arari: 10 a 20 min
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111]/85 text-white border border-[#F4A300]/30 px-3.5 py-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#F4A300]" />
              Rua do Posto BR Mania, 06 - Centro
            </span>
          </div>

          {/* Acceptable Payments Section */}
          <div className="flex flex-col items-center justify-center pt-5 border-t border-white/10 relative z-10 space-y-3 w-full max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#FFF3E0] uppercase font-sans">
              ★ Formas de Pagamento no Delivery ★
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-[#111111]/80 border border-[#F4A300]/30 rounded-full px-4 py-1.5 shadow-md">
                <QrCode className="h-4 w-4 text-[#F4A300] stroke-[2.5]" />
                <span className="text-[11px] font-black text-white">Pix Celular</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#111111]/80 border border-[#F4A300]/30 rounded-full px-4 py-1.5 shadow-md">
                <Banknote className="h-4 w-4 text-emerald-500 stroke-[2.5]" />
                <span className="text-[11px] font-black text-white">Dinheiro (Com Troco)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#111111]/80 border border-[#F4A300]/30 rounded-full px-4 py-1.5 shadow-md">
                <CreditCard className="h-4 w-4 text-brand-orange stroke-[2.5]" />
                <span className="text-[11px] font-black text-white">Cartões Débito/Crédito</span>
              </div>
            </div>
          </div>

        </div>

        {/* SEARCH BOX & SECTOR FILTERS */}
        <div className="space-y-6">
          
          {/* Real Search bar */}
          <div className="relative w-full max-w-2xl mx-auto">
            <Search className="absolute left-4.5 top-4 h-4.5 w-4.5 text-[#F4A300]" />
            <input
              id="menu-search-input"
              type="text"
              placeholder="Pesquisar prato tradicional maranhense: bife, feijoada..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#F4A300]/30 bg-[#111111]/90 py-4 pl-12 pr-20 text-xs text-white placeholder-white/45 shadow-2xl focus:ring-1 focus:ring-[#F4A300] focus:border-[#F4A300] focus:outline-none transition-all font-sans"
            />
            {searchQuery && (
              <button
                id="btn-clear-search"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3 text-[10px] text-[#111111] hover:bg-white bg-[#F4A300] px-3 py-1.5 rounded-lg font-black uppercase tracking-wider transition-all duration-200"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Quick categories navigation tabs */}
          <div id="quick-categories-scroller" className="flex items-center gap-2.5 overflow-x-auto pb-3.5 pt-1.5 scrollbar-none justify-start md:justify-center px-1 -mx-4 md:mx-0">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-tab-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4.5 py-3 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer select-none border min-h-[44px] ${
                    isSelected
                      ? 'bg-[#111111] text-[#F4A300] border-[#F4A300] shadow-xl scale-102 font-black'
                      : 'bg-[#111111]/45 text-white/80 border-white/10 hover:border-[#F4A300]/40 hover:text-white hover:bg-[#111111]/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-300 ${isSelected ? 'text-[#F4A300] scale-110' : 'text-white/60'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* EXTRA ACCOMPANIMENT BOARD PLATINUM HIGHLIGHT */}
        <div id="accompaniments-info-banner" className="rounded-2xl border border-[#F4A300]/25 bg-[#111111]/95 text-white p-6 relative overflow-hidden shadow-2xl glass-panel">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
            <div className="space-y-2">
              <h3 className="font-serif italic text-2xl font-black text-[#F4A300]">
                Acompanhamentos Padrão Inclusos 🍛
              </h3>
              <p className="text-xs text-[#FFF3E0]/90 leading-relaxed max-w-3xl">
                Nossos pratos executivos acompanham sempre a combinação perfeita do nosso tempero maranhense: 
                <span className="font-extrabold text-[#F4A300] bg-[#F4A300]/10 px-1 rounded mx-0.5"> Arroz soltinho </span>, 
                <span className="font-extrabold text-[#F4A300] bg-[#F4A300]/10 px-1 rounded mx-0.5"> Feijão com caldo gordo </span>, 
                <span className="font-extrabold text-[#F4A300] bg-[#F4A300]/10 px-1 rounded mx-0.5"> Macarrão </span>, 
                <span className="font-extrabold text-[#F4A300] bg-[#F4A300]/10 px-1 rounded mx-0.5"> Farofa maranhense crocante </span>, 
                <span className="font-extrabold text-[#F4A300] bg-[#F4A300]/10 px-1 rounded mx-0.5"> Salada fresca </span> e 
                <span className="font-extrabold text-[#F4A300] bg-[#F4A300]/10 px-1 rounded mx-0.5"> Purê de batata cremoso </span>. 
                Desmarque os acompanhamentos indesejados ao clicar em adicionar!
              </p>
            </div>
            <div className="flex gap-2.5 shrink-0 pt-2 sm:pt-0">
              <span className="bg-[#F4A300]/10 border border-[#F4A300]/20 text-[#F4A300] px-3.5 py-1 rounded-full text-[9.5px] uppercase font-black tracking-wider">Tradição Regional</span>
              <span className="bg-white/5 border border-white/10 text-white/80 px-3.5 py-1 rounded-full text-[9.5px] uppercase font-black tracking-wider">Arari - MA</span>
            </div>
          </div>
          {/* Decorative design background elements */}
          <div className="absolute right-0 bottom-0 w-36 h-36 bg-[#F4A300] rounded-full blur-[90px] opacity-10 pointer-events-none" />
        </div>

        {/* GPS LOCATION MAP AND FILL COMPONENT */}
        <LocationMap />

        {/* COMPONENT SECTION: FILTERED PRODUCTS LISTINGS */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div className="flex items-center gap-3">
              {(selectedCategory !== 'all' || searchQuery) && (
                <button
                  id="btn-back-to-all"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#111111]/80 text-[#F4A300] border border-[#F4A300]/30 hover:bg-[#F4A300] hover:text-[#111111] transition-all duration-300 cursor-pointer shadow-md shrink-0"
                  title="Voltar para Ver Tudo"
                >
                  <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
                </button>
              )}
              <h2 className="font-serif italic text-2xl font-black text-white tracking-wide">
                Cardápio do Dia {selectedCategory !== 'all' && ` • ${categories.find(c => c.id === selectedCategory)?.label}`}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {(selectedCategory !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-xs font-black text-[#F4A300] hover:underline uppercase tracking-wider"
                >
                  Limpar Filtros e Ver Tudo
                </button>
              )}
              {(filteredDishes.length > 0 || filteredDrinks.length > 0) && (
                <span className="text-xs font-mono font-black text-[#FFF3E0] border-l border-white/20 pl-2">
                  {filteredDishes.length + filteredDrinks.length} opções disponíveis
                </span>
              )}
            </div>
          </div>

          {/* Empty search results fallback */}
          {filteredDishes.length === 0 && filteredDrinks.length === 0 && (
            <div id="search-not-found" className="rounded-2xl border border-[#F4A300]/25 bg-[#111111]/90 p-12 text-center max-w-md mx-auto space-y-5 shadow-2xl glass-panel text-white">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F4A300]/10 text-[#F4A300]">
                <HelpCircle className="h-7 w-7 stroke-[2]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif italic text-base font-black text-white">Opção não localizada</h3>
                <p className="text-xs text-[#FFF3E0]/75 leading-relaxed font-sans">
                  Não encontramos itens correspondentes à busca neste momento. Tente trocar os filtros ou procure nas categorias.
                </p>
              </div>
              <button
                id="btn-reset-filters"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="rounded-full btn-premium font-black uppercase tracking-wider px-6 py-3 text-xs shadow-sm cursor-pointer font-sans"
              >
                Limpar filtros e buscar pratos
              </button>
            </div>
          )}

          {/* Main Course Dishes Section */}
          {filteredDishes.length > 0 && (
            <div className="space-y-4">
              {selectedCategory === 'all' && (
                <h3 className="text-[10px] font-black font-sans tracking-widest text-[#FFF3E0] uppercase border-b border-white/15 pb-1.5 mb-4">Marmitas & Pratos Tradicionais</h3>
              )}
              <div id="dishes-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onSelect={handleSelectDishById}
                    cartCount={cartCounts[dish.id] || 0}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Beverages Section */}
          {filteredDrinks.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="text-[10px] font-black font-sans tracking-widest text-[#FFF3E0] uppercase border-b border-white/15 pb-1.5 mb-4">Sucos da Fruta & Refrigerantes Gelados</h3>
              <div id="drinks-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredDrinks.map((drink) => (
                  <DrinkCard
                    key={drink.id}
                    drink={drink}
                    onSelect={(d) => setSelectedDrink(d)}
                    cartCount={cartCounts[drink.id] || 0}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* FOOTER GENERAL DESIGN ASSISTANCE */}
      <footer className="border-t border-[#F4A300]/20 bg-[#111111] py-12 px-4 text-center text-xs text-white space-y-4 font-sans relative z-30">
        <p className="font-serif italic text-[#F4A300] text-lg font-black tracking-wide">Culinária Regional Tempero Nordestino</p>
        <p className="max-w-md mx-auto text-[#FFF3E0]/80 text-[11px] leading-relaxed font-sans">
          Nossos pratos maranhenses são preparados seguindo receitas de gerações com os autênticos temperos do sertão de Arari. Atendimento rápido e entrega eficaz direto em Arari - MA!
        </p>
        <div className="flex items-center justify-center gap-3 text-white/40 text-[9px] uppercase font-bold tracking-widest pt-2">
          <span>• Ingredientes Premium</span>
          <span>• Tradição do Norte</span>
          <span>• Rapidez na Cozinha •</span>
        </div>
        <p className="text-[9px] text-[#FFF3E0]/30 font-sans pt-1">© {new Date().getFullYear()} Tempero Nordestino. Desenvolvido com capricho.</p>
      </footer>

      {/* FLOATING MOBILE ACTION BAG STICKY BAR */}
      <AnimatePresence>
        {totalItemsCount > 0 && (
          <motion.div
            initial={{ translateY: 100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            id="mobile-bottom-bag-bar"
            className="fixed bottom-0 inset-x-0 z-40 bg-[#111111] border-t border-[#F4A300]/25 p-4.5 shadow-2xl flex items-center justify-between gap-4 md:hidden backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5 text-white">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-white text-[#F4A300]" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-r from-[#FF7A00] to-[#E85D04] font-mono text-[9px] font-black text-white border border-[#F4A300]/30 shadow animate-pulse">
                  {totalItemsCount}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9.5px] text-[#FFF3E0]/60 tracking-wider uppercase font-black leading-none font-sans">Total Carrinho</span>
                <span className="text-sm font-black font-mono mt-1 text-[#F4A300]">
                  R$ {totalCartPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <button
              id="btn-mobile-checkout-floating"
              onClick={() => setIsCartOpen(true)}
              className="rounded-full btn-premium font-black px-6 py-3 text-xs tracking-wider uppercase transition shadow-lg cursor-pointer font-sans border border-[#F4A300]/20"
            >
              Ver Carrinho &rarr;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DISH CONFIGURATION AND MODIFIER POPUP */}
      <AnimatePresence>
        {selectedDish && (
          <DishCustomizationModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* DRINK SIZING SELECTOR POPUP */}
      <AnimatePresence>
        {selectedDrink && (
          <DrinkCustomizationModal
            drink={selectedDrink}
            onClose={() => setSelectedDrink(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* CART DRAWER SLIDEOVER CHECKOUT ENGINE */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        )}
      </AnimatePresence>

      {/* MONTE SUA MARMITA TOPO TOP BUILDER MODAL */}
      <AnimatePresence>
        {isMonteMarmitaOpen && (
          <MonteMarmitaModal
            isOpen={isMonteMarmitaOpen}
            onClose={() => setIsMonteMarmitaOpen(false)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
