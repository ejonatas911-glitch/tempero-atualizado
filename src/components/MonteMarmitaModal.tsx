import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  UtensilsCrossed,
  Beef,
  Fish,
  Drumstick,
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Flame,
  Check,
  ChevronRight,
  ChevronLeft,
  RotateCcw
} from 'lucide-react';
import { Dish, CartItem, MarmitaSelections } from '../types';
import { DISHES } from '../data';

interface MonteMarmitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

type StepKey = 'carne' | 'arroz' | 'feijao' | 'macarrao' | 'farofa' | 'salada' | 'pure' | 'finalizar';

interface StepConfig {
  key: StepKey;
  label: string;
  shortLabel: string;
  icon: string;
  badge: string;
}

const STEPS: StepConfig[] = [
  { key: 'carne', label: '1. Tipos de Carne', shortLabel: 'Carne', icon: '🥩', badge: 'Principal' },
  { key: 'arroz', label: '2. Arroz', shortLabel: 'Arroz', icon: '🍚', badge: 'Acompanhamento' },
  { key: 'feijao', label: '3. Feijão', shortLabel: 'Feijão', icon: '🍲', badge: 'Acompanhamento' },
  { key: 'macarrao', label: '4. Macarrão', shortLabel: 'Macarrão', icon: '🍝', badge: 'Acompanhamento' },
  { key: 'farofa', label: '5. Farofa', shortLabel: 'Farofa', icon: '🌾', badge: 'Acompanhamento' },
  { key: 'salada', label: '6. Salada', shortLabel: 'Salada', icon: '🥗', badge: 'Acompanhamento' },
  { key: 'pure', label: '7. Purê', shortLabel: 'Purê', icon: '🥔', badge: 'Acompanhamento' },
  { key: 'finalizar', label: '8. Tamanho & Pedido', shortLabel: 'Finalizar', icon: '🍱', badge: 'Conclusão' }
];

interface OptionItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  isDefault?: boolean;
}

const ARROZ_OPTIONS: OptionItem[] = [
  { id: 'Arroz Branco Soltinho', title: 'Arroz Branco Soltinho', description: 'Arroz branco tradicional cozido no capricho, soltinho e fresquinho.', badge: 'Mais Pedido', isDefault: true },
  { id: 'Arroz ao Alho Dourado', title: 'Arroz ao Alho Dourado', description: 'Salteado com lâminas de alho crocante dourado e cheiro-verde.' },
  { id: 'Sem Arroz', title: 'Não quero Arroz', description: 'Dispensar a porção de arroz desta marmita.', badge: 'Sem este item' }
];

const FEIJAO_OPTIONS: OptionItem[] = [
  { id: 'Feijão Caseiro com Caldo', title: 'Feijão Carioca com Caldo Gordo', description: 'Feijão carioca temperado com louro, alho e caldo bem encorpado.', badge: 'Mais Pedido', isDefault: true },
  { id: 'Feijão Preto Temperado', title: 'Feijão Preto Temperado', description: 'Feijão preto encorpado temperado na tradição da casa.' },
  { id: 'Sem Feijão', title: 'Não quero Feijão', description: 'Dispensar a porção de feijão desta marmita.', badge: 'Sem este item' }
];

const MACARRAO_OPTIONS: OptionItem[] = [
  { id: 'Macarrão Espaguete na Manteiga', title: 'Macarrão Espaguete na Manteiga', description: 'Massa espaguete soltinha salteada na manteiga especial.', badge: 'Mais Pedido', isDefault: true },
  { id: 'Macarrão ao Alho e Óleo', title: 'Macarrão ao Alho e Óleo', description: 'Espaguete com lâminas de alho douradas no azeite e ervas.' },
  { id: 'Sem Macarrão', title: 'Não quero Macarrão', description: 'Dispensar o macarrão nesta marmita.', badge: 'Sem este item' }
];

const FAROFA_OPTIONS: OptionItem[] = [
  { id: 'Farofa Maranhense Crocante', title: 'Farofa Maranhense Crocante', description: 'Farinha d\'água torrada crocante especial com temperos do sertão.', badge: 'Mais Pedido', isDefault: true },
  { id: 'Farofa na Manteiga de Garrafa', title: 'Farofa na Manteiga de Garrafa', description: 'Sabor autêntico sertanejo com manteiga de garrafa regional.', badge: 'Tradicional' },
  { id: 'Sem Farofa', title: 'Não quero Farofa', description: 'Dispensar a farofa nesta marmita.', badge: 'Sem este item' }
];

const SALADA_OPTIONS: OptionItem[] = [
  { id: 'Salada Fresca (Alface e Tomate)', title: 'Salada Fresca de Folhas e Tomate', description: 'Alface americana crocante, rodelas de tomate fresco e cebola.', badge: 'Mais Pedido', isDefault: true },
  { id: 'Vinagrete Especial da Casa', title: 'Vinagrete Especial da Casa', description: 'Tomatinho picado, cebola roxa, pimentão e cheiro-verde temperados.' },
  { id: 'Salada de Maionese de Batata', title: 'Salada de Maionese de Batata', description: 'Cremosa com batata, cenoura cozida e maionese suave.' },
  { id: 'Sem Salada', title: 'Não quero Salada', description: 'Dispensar a salada nesta marmita.', badge: 'Sem este item' }
];

const PURE_OPTIONS: OptionItem[] = [
  { id: 'Purê de Batata Cremoso', title: 'Purê de Batata Cremoso com Manteiga', description: 'Batata selecionada amassadinha com leite e manteiga de primeira.', badge: 'Mais Pedido', isDefault: true },
  { id: 'Sem Purê', title: 'Não quero Purê', description: 'Dispensar a porção de purê nesta marmita.', badge: 'Sem este item' }
];

export default function MonteMarmitaModal({ isOpen, onClose, onAddToCart }: MonteMarmitaModalProps) {
  // Available proteins
  const proteinDishes = DISHES;

  // Selections state
  const [currentStep, setCurrentStep] = useState<StepKey>('carne');
  const [selectedProtein, setSelectedProtein] = useState<Dish>(proteinDishes[0] || DISHES[0]);
  const [selectedArroz, setSelectedArroz] = useState<string>(ARROZ_OPTIONS[0].id);
  const [selectedFeijao, setSelectedFeijao] = useState<string>(FEIJAO_OPTIONS[0].id);
  const [selectedMacarrao, setSelectedMacarrao] = useState<string>(MACARRAO_OPTIONS[0].id);
  const [selectedFarofa, setSelectedFarofa] = useState<string>(FAROFA_OPTIONS[0].id);
  const [selectedSalada, setSelectedSalada] = useState<string>(SALADA_OPTIONS[0].id);
  const [selectedPure, setSelectedPure] = useState<string>(PURE_OPTIONS[0].id);

  const [selectedSize, setSelectedSize] = useState<'normal' | 'grande' | 'mini'>('normal');
  const [quantity, setQuantity] = useState<number>(1);
  const [observations, setObservations] = useState<string>('');

  if (!isOpen) return null;

  // Price calculations
  const sizeAdjustment = selectedSize === 'grande' ? 5.00 : selectedSize === 'mini' ? -3.00 : 0;
  const unitPrice = (selectedProtein?.price || 19.99) + sizeAdjustment;
  const totalPrice = unitPrice * quantity;

  // Reset to default traditional settings
  const handleResetToStandard = () => {
    setSelectedArroz(ARROZ_OPTIONS[0].id);
    setSelectedFeijao(FEIJAO_OPTIONS[0].id);
    setSelectedMacarrao(MACARRAO_OPTIONS[0].id);
    setSelectedFarofa(FAROFA_OPTIONS[0].id);
    setSelectedSalada(SALADA_OPTIONS[0].id);
    setSelectedPure(PURE_OPTIONS[0].id);
  };

  const currentStepIndex = STEPS.findIndex(s => s.key === currentStep);

  const goToNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1].key);
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].key);
    }
  };

  const handleFinishAndAdd = () => {
    const sizeLabel = selectedSize === 'grande' ? ' (Grande - Caprichada)' : selectedSize === 'mini' ? ' (Mini Econômica)' : ' (Tradicional)';

    const removed: string[] = [];
    if (selectedArroz === 'Sem Arroz') removed.push('Arroz');
    if (selectedFeijao === 'Sem Feijão') removed.push('Feijão');
    if (selectedMacarrao === 'Sem Macarrão') removed.push('Macarrão');
    if (selectedFarofa === 'Sem Farofa') removed.push('Farofa');
    if (selectedSalada === 'Sem Salada') removed.push('Salada');
    if (selectedPure === 'Sem Purê') removed.push('Purê');

    const marmitaSelections: MarmitaSelections = {
      carne: selectedProtein.name,
      arroz: selectedArroz,
      feijao: selectedFeijao,
      macarrao: selectedMacarrao,
      farofa: selectedFarofa,
      salada: selectedSalada,
      pure: selectedPure,
      tamanho: selectedSize === 'grande' ? 'Grande (Caprichada)' : selectedSize === 'mini' ? 'Mini (Econômica)' : 'Tradicional'
    };

    const customItem: CartItem = {
      id: `marmita-custom-${selectedProtein.id}-${selectedSize}-${Date.now()}`,
      itemId: selectedProtein.id,
      name: `🍱 Marmita Montada: ${selectedProtein.name}${sizeLabel}`,
      type: 'dish',
      price: unitPrice,
      quantity,
      removedAccompaniments: removed.length > 0 ? removed : undefined,
      marmitaSelections,
      observations: observations.trim() || undefined
    };

    onAddToCart(customItem);
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'carnes') return Beef;
    if (category === 'peixes') return Fish;
    return Drumstick;
  };

  const getSelectedLabelForStep = (stepKey: StepKey): string => {
    switch (stepKey) {
      case 'carne': return selectedProtein?.name || 'Selecione';
      case 'arroz': return selectedArroz;
      case 'feijao': return selectedFeijao;
      case 'macarrao': return selectedMacarrao;
      case 'farofa': return selectedFarofa;
      case 'salada': return selectedSalada;
      case 'pure': return selectedPure;
      case 'finalizar': return selectedSize === 'grande' ? 'Grande' : selectedSize === 'mini' ? 'Mini' : 'Tradicional';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-md overflow-y-auto animate-fade-in">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        className="relative w-full max-w-4xl rounded-3xl bg-[#140F0B] border-2 border-[#F4A300]/80 shadow-[0_0_60px_rgba(244,163,0,0.35)] text-white overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#FF7A00] via-[#E85D04] to-[#F4A300] p-4 sm:p-5 text-[#111111] flex items-center justify-between relative shadow-lg shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#111111] text-[#F4A300] flex items-center justify-center shadow-md border border-white/10 shrink-0">
              <UtensilsCrossed className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-black text-[#111111]/90 block font-sans">
                Monte Opção por Opção no Capricho
              </span>
              <h2 className="font-serif italic text-xl sm:text-2xl font-black text-white drop-shadow-sm leading-tight">
                Monte sua Marmita Caseira 🍱
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToStandard}
              className="hidden sm:flex items-center gap-1 bg-[#111111]/30 hover:bg-[#111111] text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition cursor-pointer border border-white/20"
              title="Voltar para todos os acompanhamentos padrão"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Padrão Completo</span>
            </button>

            <button
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-[#111111]/25 hover:bg-[#111111] text-white flex items-center justify-center transition cursor-pointer"
              title="Fechar"
            >
              <X className="h-5 w-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* ORGANIZED HORIZONTAL STEPPER PILLS */}
        <div className="border-b border-[#F4A300]/20 bg-[#1A120B] px-3 py-2.5 shrink-0 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {STEPS.map((step, idx) => {
              const isCurrent = step.key === currentStep;
              const isPast = idx < currentStepIndex;
              const selectedValue = getSelectedLabelForStep(step.key);

              return (
                <button
                  key={step.key}
                  onClick={() => setCurrentStep(step.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-[#F4A300] text-black border-[#F4A300] shadow-[0_0_15px_rgba(244,163,0,0.4)] scale-102'
                      : isPast
                      ? 'bg-[#251A10] text-white/90 border-[#F4A300]/30 hover:border-[#F4A300]/60'
                      : 'bg-black/30 text-white/50 border-white/10 hover:text-white/80'
                  }`}
                >
                  <span className="text-sm">{step.icon}</span>
                  <span className="uppercase tracking-wider text-[10px]">{step.shortLabel}</span>
                  {selectedValue && !isCurrent && (
                    <span className="hidden md:inline text-[9px] text-[#F4A300] font-normal truncate max-w-[90px]">
                      • {selectedValue.replace('Não quero ', 'Sem ').slice(0, 14)}
                    </span>
                  )}
                  {isPast && !isCurrent && (
                    <Check className="h-3 w-3 text-emerald-400 stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* LIVE REAL-TIME MARMITA TRAY (Resumo Visual de Todos os Itens Escolhidos) */}
        <div className="bg-[#1C150E] px-4 py-2 border-b border-white/10 flex items-center justify-between gap-3 text-xs overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-1.5 text-[#F4A300] font-black uppercase text-[10px] tracking-wider shrink-0 font-sans">
            <span>Sua Marmita:</span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap text-[10.5px]">
            <span className="bg-[#2B1D11] border border-[#F4A300]/40 px-2 py-0.5 rounded-md text-white font-bold whitespace-nowrap">
              🥩 {selectedProtein.name.replace(' com Batata', '').replace(' Completa', '')}
            </span>
            <span className={`px-2 py-0.5 rounded-md font-bold whitespace-nowrap ${selectedArroz === 'Sem Arroz' ? 'bg-red-950/40 text-red-300 border border-red-500/30' : 'bg-black/40 text-white/90 border border-white/10'}`}>
              🍚 {selectedArroz}
            </span>
            <span className={`px-2 py-0.5 rounded-md font-bold whitespace-nowrap ${selectedFeijao === 'Sem Feijão' ? 'bg-red-950/40 text-red-300 border border-red-500/30' : 'bg-black/40 text-white/90 border border-white/10'}`}>
              🍲 {selectedFeijao}
            </span>
            <span className={`px-2 py-0.5 rounded-md font-bold whitespace-nowrap ${selectedMacarrao === 'Sem Macarrão' ? 'bg-red-950/40 text-red-300 border border-red-500/30' : 'bg-black/40 text-white/90 border border-white/10'}`}>
              🍝 {selectedMacarrao}
            </span>
            <span className={`px-2 py-0.5 rounded-md font-bold whitespace-nowrap ${selectedFarofa === 'Sem Farofa' ? 'bg-red-950/40 text-red-300 border border-red-500/30' : 'bg-black/40 text-white/90 border border-white/10'}`}>
              🌾 {selectedFarofa}
            </span>
            <span className={`px-2 py-0.5 rounded-md font-bold whitespace-nowrap ${selectedSalada === 'Sem Salada' ? 'bg-red-950/40 text-red-300 border border-red-500/30' : 'bg-black/40 text-white/90 border border-white/10'}`}>
              🥗 {selectedSalada}
            </span>
            <span className={`px-2 py-0.5 rounded-md font-bold whitespace-nowrap ${selectedPure === 'Sem Purê' ? 'bg-red-950/40 text-red-300 border border-red-500/30' : 'bg-black/40 text-white/90 border border-white/10'}`}>
              🥔 {selectedPure}
            </span>
          </div>

          <div className="shrink-0 font-mono font-black text-[#F4A300] text-sm hidden sm:block">
            R$ {unitPrice.toFixed(2).replace('.', ',')}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* ==================================================== */}
          {/* PASSO 1: CARNE / PROTEÍNA PRINCIPAL */}
          {/* ==================================================== */}
          {currentStep === 'carne' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase text-[#F4A300] tracking-wider flex items-center gap-2 font-sans">
                    <span>🥩</span> Passo 1: Escolha a Carne / Prato Principal
                  </h3>
                  <p className="text-xs text-white/70 font-sans mt-0.5">
                    Selecione qual das nossas carnes ou peixes caseiros você deseja como centro da sua marmita:
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase bg-[#F4A300]/20 text-[#F4A300] border border-[#F4A300]/30 px-3 py-1 rounded-full hidden sm:block">
                  11 Opções Disponíveis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {proteinDishes.map((dish) => {
                  const isSelected = selectedProtein.id === dish.id;
                  const Icon = getCategoryIcon(dish.category);
                  return (
                    <div
                      key={dish.id}
                      onClick={() => setSelectedProtein(dish)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden group ${
                        isSelected
                          ? 'border-[#F4A300] bg-[#2B1D11] shadow-[0_0_20px_rgba(244,163,0,0.25)] ring-1 ring-[#F4A300]'
                          : 'border-white/10 bg-[#1A140F] hover:border-white/30 hover:bg-[#201813]'
                      }`}
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="h-18 w-18 rounded-xl object-cover shrink-0 border border-white/10 shadow"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Icon className="h-3.5 w-3.5 text-[#F4A300] shrink-0" />
                          <h4 className="font-bold text-xs sm:text-sm text-white truncate">{dish.name}</h4>
                        </div>
                        <p className="text-[10px] text-white/70 line-clamp-2 mt-0.5 leading-relaxed font-sans">{dish.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono font-black text-xs text-[#F4A300]">
                            R$ {dish.price.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-[9.5px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                            Disponível Hoje
                          </span>
                        </div>
                      </div>
                      
                      <div className="shrink-0 pl-1">
                        {isSelected ? (
                          <CheckCircle2 className="h-6 w-6 text-[#F4A300] fill-[#F4A300]/20" />
                        ) : (
                          <Circle className="h-6 w-6 text-white/20 group-hover:text-white/40 transition-colors" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={goToNextStep}
                  className="rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F4A300] text-black font-black px-8 py-3.5 text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-2 shadow-lg shadow-[#F4A300]/20"
                >
                  <span>Avançar para o Arroz</span>
                  <ChevronRight className="h-4 w-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* PASSO 2: ARROZ */}
          {/* ==================================================== */}
          {currentStep === 'arroz' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-sm sm:text-base font-black uppercase text-[#F4A300] tracking-wider flex items-center gap-2 font-sans">
                  <span>🍚</span> Passo 2: Como você quer o Arroz?
                </h3>
                <p className="text-xs text-white/70 font-sans mt-0.5">
                  Escolha o tipo de arroz ou opte por não incluir:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {ARROZ_OPTIONS.map((opt) => {
                  const isSelected = selectedArroz === opt.id;
                  const isNone = opt.id.startsWith('Sem');
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedArroz(opt.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none relative ${
                        isSelected
                          ? isNone
                            ? 'border-red-500/80 bg-red-950/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                            : 'border-[#F4A300] bg-[#2B1D11] shadow-[0_0_20px_rgba(244,163,0,0.25)]'
                          : 'border-white/10 bg-[#1A140F] hover:border-white/25 hover:bg-[#201813]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xl">🍚</span>
                          {opt.badge && (
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isNone ? 'bg-red-500/20 text-red-300' : 'bg-[#F4A300]/20 text-[#F4A300]'}`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                        <p className="text-xs text-white/65 font-sans leading-relaxed">{opt.description}</p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-3">
                        <span className="text-[10px] text-white/50 uppercase font-black tracking-wider">
                          {isNone ? 'Item Retirado' : 'Incluso no Preço'}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className={`h-5 w-5 ${isNone ? 'text-red-400' : 'text-[#F4A300]'}`} />
                        ) : (
                          <Circle className="h-5 w-5 text-white/20" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  onClick={goToPrevStep}
                  className="rounded-full border border-white/20 text-white px-6 py-3 text-xs uppercase font-black hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </button>
                <button
                  onClick={goToNextStep}
                  className="rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F4A300] text-black font-black px-8 py-3.5 text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <span>Avançar para o Feijão</span>
                  <ChevronRight className="h-4 w-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* PASSO 3: FEIJÃO */}
          {/* ==================================================== */}
          {currentStep === 'feijao' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-sm sm:text-base font-black uppercase text-[#F4A300] tracking-wider flex items-center gap-2 font-sans">
                  <span>🍲</span> Passo 3: Como você quer o Feijão?
                </h3>
                <p className="text-xs text-white/70 font-sans mt-0.5">
                  Selecione a opção de feijão que você prefere na marmita:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {FEIJAO_OPTIONS.map((opt) => {
                  const isSelected = selectedFeijao === opt.id;
                  const isNone = opt.id.startsWith('Sem');
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedFeijao(opt.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none relative ${
                        isSelected
                          ? isNone
                            ? 'border-red-500/80 bg-red-950/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                            : 'border-[#F4A300] bg-[#2B1D11] shadow-[0_0_20px_rgba(244,163,0,0.25)]'
                          : 'border-white/10 bg-[#1A140F] hover:border-white/25 hover:bg-[#201813]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xl">🍲</span>
                          {opt.badge && (
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isNone ? 'bg-red-500/20 text-red-300' : 'bg-[#F4A300]/20 text-[#F4A300]'}`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                        <p className="text-xs text-white/65 font-sans leading-relaxed">{opt.description}</p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-3">
                        <span className="text-[10px] text-white/50 uppercase font-black tracking-wider">
                          {isNone ? 'Item Retirado' : 'Incluso no Preço'}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className={`h-5 w-5 ${isNone ? 'text-red-400' : 'text-[#F4A300]'}`} />
                        ) : (
                          <Circle className="h-5 w-5 text-white/20" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  onClick={goToPrevStep}
                  className="rounded-full border border-white/20 text-white px-6 py-3 text-xs uppercase font-black hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </button>
                <button
                  onClick={goToNextStep}
                  className="rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F4A300] text-black font-black px-8 py-3.5 text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <span>Avançar para o Macarrão</span>
                  <ChevronRight className="h-4 w-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* PASSO 4: MACARRÃO */}
          {/* ==================================================== */}
          {currentStep === 'macarrao' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-sm sm:text-base font-black uppercase text-[#F4A300] tracking-wider flex items-center gap-2 font-sans">
                  <span>🍝</span> Passo 4: Como você quer o Macarrão?
                </h3>
                <p className="text-xs text-white/70 font-sans mt-0.5">
                  Escolha o preparo do macarrão espaguete caseiro:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {MACARRAO_OPTIONS.map((opt) => {
                  const isSelected = selectedMacarrao === opt.id;
                  const isNone = opt.id.startsWith('Sem');
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedMacarrao(opt.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none relative ${
                        isSelected
                          ? isNone
                            ? 'border-red-500/80 bg-red-950/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                            : 'border-[#F4A300] bg-[#2B1D11] shadow-[0_0_20px_rgba(244,163,0,0.25)]'
                          : 'border-white/10 bg-[#1A140F] hover:border-white/25 hover:bg-[#201813]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xl">🍝</span>
                          {opt.badge && (
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isNone ? 'bg-red-500/20 text-red-300' : 'bg-[#F4A300]/20 text-[#F4A300]'}`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                        <p className="text-xs text-white/65 font-sans leading-relaxed">{opt.description}</p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-3">
                        <span className="text-[10px] text-white/50 uppercase font-black tracking-wider">
                          {isNone ? 'Item Retirado' : 'Incluso no Preço'}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className={`h-5 w-5 ${isNone ? 'text-red-400' : 'text-[#F4A300]'}`} />
                        ) : (
                          <Circle className="h-5 w-5 text-white/20" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  onClick={goToPrevStep}
                  className="rounded-full border border-white/20 text-white px-6 py-3 text-xs uppercase font-black hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </button>
                <button
                  onClick={goToNextStep}
                  className="rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F4A300] text-black font-black px-8 py-3.5 text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <span>Avançar para a Farofa</span>
                  <ChevronRight className="h-4 w-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* PASSO 5: FAROFA */}
          {/* ==================================================== */}
          {currentStep === 'farofa' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-sm sm:text-base font-black uppercase text-[#F4A300] tracking-wider flex items-center gap-2 font-sans">
                  <span>🌾</span> Passo 5: Como você quer a Farofa?
                </h3>
                <p className="text-xs text-white/70 font-sans mt-0.5">
                  Nossa tradicional farofa d'água crocante do Maranhão:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {FAROFA_OPTIONS.map((opt) => {
                  const isSelected = selectedFarofa === opt.id;
                  const isNone = opt.id.startsWith('Sem');
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedFarofa(opt.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none relative ${
                        isSelected
                          ? isNone
                            ? 'border-red-500/80 bg-red-950/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                            : 'border-[#F4A300] bg-[#2B1D11] shadow-[0_0_20px_rgba(244,163,0,0.25)]'
                          : 'border-white/10 bg-[#1A140F] hover:border-white/25 hover:bg-[#201813]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xl">🌾</span>
                          {opt.badge && (
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isNone ? 'bg-red-500/20 text-red-300' : 'bg-[#F4A300]/20 text-[#F4A300]'}`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                        <p className="text-xs text-white/65 font-sans leading-relaxed">{opt.description}</p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-3">
                        <span className="text-[10px] text-white/50 uppercase font-black tracking-wider">
                          {isNone ? 'Item Retirado' : 'Incluso no Preço'}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className={`h-5 w-5 ${isNone ? 'text-red-400' : 'text-[#F4A300]'}`} />
                        ) : (
                          <Circle className="h-5 w-5 text-white/20" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  onClick={goToPrevStep}
                  className="rounded-full border border-white/20 text-white px-6 py-3 text-xs uppercase font-black hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </button>
                <button
                  onClick={goToNextStep}
                  className="rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F4A300] text-black font-black px-8 py-3.5 text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <span>Avançar para a Salada</span>
                  <ChevronRight className="h-4 w-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* PASSO 6: SALADA */}
          {/* ==================================================== */}
          {currentStep === 'salada' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-sm sm:text-base font-black uppercase text-[#F4A300] tracking-wider flex items-center gap-2 font-sans">
                  <span>🥗</span> Passo 6: Como você quer a Salada?
                </h3>
                <p className="text-xs text-white/70 font-sans mt-0.5">
                  Saladas frescas preparadas diariamente:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {SALADA_OPTIONS.map((opt) => {
                  const isSelected = selectedSalada === opt.id;
                  const isNone = opt.id.startsWith('Sem');
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedSalada(opt.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none relative ${
                        isSelected
                          ? isNone
                            ? 'border-red-500/80 bg-red-950/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                            : 'border-[#F4A300] bg-[#2B1D11] shadow-[0_0_20px_rgba(244,163,0,0.25)]'
                          : 'border-white/10 bg-[#1A140F] hover:border-white/25 hover:bg-[#201813]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xl">🥗</span>
                          {opt.badge && (
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isNone ? 'bg-red-500/20 text-red-300' : 'bg-[#F4A300]/20 text-[#F4A300]'}`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                        <p className="text-xs text-white/65 font-sans leading-relaxed">{opt.description}</p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-3">
                        <span className="text-[10px] text-white/50 uppercase font-black tracking-wider">
                          {isNone ? 'Item Retirado' : 'Incluso no Preço'}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className={`h-5 w-5 ${isNone ? 'text-red-400' : 'text-[#F4A300]'}`} />
                        ) : (
                          <Circle className="h-5 w-5 text-white/20" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  onClick={goToPrevStep}
                  className="rounded-full border border-white/20 text-white px-6 py-3 text-xs uppercase font-black hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </button>
                <button
                  onClick={goToNextStep}
                  className="rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F4A300] text-black font-black px-8 py-3.5 text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <span>Avançar para o Purê</span>
                  <ChevronRight className="h-4 w-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* PASSO 7: PURÊ */}
          {/* ==================================================== */}
          {currentStep === 'pure' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-sm sm:text-base font-black uppercase text-[#F4A300] tracking-wider flex items-center gap-2 font-sans">
                  <span>🥔</span> Passo 7: Como você quer o Purê?
                </h3>
                <p className="text-xs text-white/70 font-sans mt-0.5">
                  Nosso purê de batata cremoso feito com carinho:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl">
                {PURE_OPTIONS.map((opt) => {
                  const isSelected = selectedPure === opt.id;
                  const isNone = opt.id.startsWith('Sem');
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedPure(opt.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none relative ${
                        isSelected
                          ? isNone
                            ? 'border-red-500/80 bg-red-950/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                            : 'border-[#F4A300] bg-[#2B1D11] shadow-[0_0_20px_rgba(244,163,0,0.25)]'
                          : 'border-white/10 bg-[#1A140F] hover:border-white/25 hover:bg-[#201813]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xl">🥔</span>
                          {opt.badge && (
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isNone ? 'bg-red-500/20 text-red-300' : 'bg-[#F4A300]/20 text-[#F4A300]'}`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                        <p className="text-xs text-white/65 font-sans leading-relaxed">{opt.description}</p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-3">
                        <span className="text-[10px] text-white/50 uppercase font-black tracking-wider">
                          {isNone ? 'Item Retirado' : 'Incluso no Preço'}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className={`h-5 w-5 ${isNone ? 'text-red-400' : 'text-[#F4A300]'}`} />
                        ) : (
                          <Circle className="h-5 w-5 text-white/20" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  onClick={goToPrevStep}
                  className="rounded-full border border-white/20 text-white px-6 py-3 text-xs uppercase font-black hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </button>
                <button
                  onClick={goToNextStep}
                  className="rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F4A300] text-black font-black px-8 py-3.5 text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <span>Avançar para o Tamanho & Finalizar</span>
                  <ChevronRight className="h-4 w-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* PASSO 8: TAMANHO, OBSERVAÇÕES & ADICIONAR */}
          {/* ==================================================== */}
          {currentStep === 'finalizar' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Size Selector */}
              <div className="space-y-3">
                <h3 className="text-sm sm:text-base font-black uppercase text-[#F4A300] tracking-wider font-sans flex items-center gap-2">
                  <span>📐</span> Passo 8: Escolha o Tamanho da Marmita
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setSelectedSize('mini')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center space-y-1.5 ${
                      selectedSize === 'mini' ? 'border-[#F4A300] bg-[#2B1D11] shadow-lg ring-1 ring-[#F4A300]' : 'border-white/10 bg-[#1A140F] hover:border-white/25'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Econômica</span>
                    <h4 className="font-black text-sm text-white pt-1">Mini Marmita</h4>
                    <p className="text-[10.5px] text-white/65">Ideal para apetite menor</p>
                    <span className="font-mono font-black text-xs text-[#F4A300] block pt-1">R$ 16,99 (- R$ 3,00)</span>
                  </div>

                  <div
                    onClick={() => setSelectedSize('normal')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center space-y-1.5 relative ${
                      selectedSize === 'normal' ? 'border-[#F4A300] bg-[#2B1D11] shadow-[0_0_25px_rgba(244,163,0,0.3)] scale-102 ring-1 ring-[#F4A300]' : 'border-white/10 bg-[#1A140F] hover:border-white/25'
                    }`}
                  >
                    <span className="absolute -top-2.5 inset-x-0 mx-auto w-fit text-[9px] font-black uppercase bg-[#F4A300] text-black px-2.5 py-0.5 rounded-full shadow">⭐ Mais Pedida</span>
                    <h4 className="font-black text-sm text-white pt-1.5">Marmita Tradicional</h4>
                    <p className="text-[10.5px] text-white/65">Porção executiva bem servida</p>
                    <span className="font-mono font-black text-xs text-[#F4A300] block pt-1">R$ 19,99 (Padrão)</span>
                  </div>

                  <div
                    onClick={() => setSelectedSize('grande')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center space-y-1.5 ${
                      selectedSize === 'grande' ? 'border-[#F4A300] bg-[#2B1D11] shadow-lg ring-1 ring-[#F4A300]' : 'border-white/10 bg-[#1A140F] hover:border-white/25'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Para Grande Fome</span>
                    <h4 className="font-black text-sm text-white pt-1">Marmita Grande</h4>
                    <p className="text-[10.5px] text-white/65">Mais carne e acompanhamentos</p>
                    <span className="font-mono font-black text-xs text-[#F4A300] block pt-1">R$ 24,99 (+ R$ 5,00)</span>
                  </div>
                </div>
              </div>

              {/* Custom Observations */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#F4A300] tracking-wider block font-sans">
                  ✍️ Alguma observação especial para a cozinha?
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ex: Mandar farofa separada em potinho; carne bem passada; caprichar no feijão..."
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder-white/40 focus:border-[#F4A300] focus:ring-1 focus:ring-[#F4A300] focus:outline-none font-sans"
                />
              </div>

              {/* Final Summary Card Before Adding */}
              <div className="rounded-2xl border border-[#F4A300]/40 bg-[#1E160F] p-4.5 space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-[#F4A300] flex items-center gap-1.5 font-sans">
                    <span>📋</span> Resumo da sua Marmita Montada
                  </span>
                  <span className="text-[10.5px] uppercase font-bold text-white/70">
                    {selectedSize === 'grande' ? 'Grande' : selectedSize === 'mini' ? 'Mini' : 'Tradicional'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="text-[#F4A300] font-bold">🥩 Carne:</span>
                    <span className="font-medium truncate">{selectedProtein.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#F4A300] font-bold">🍚 Arroz:</span>
                    <span className="font-medium truncate">{selectedArroz}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#F4A300] font-bold">🍲 Feijão:</span>
                    <span className="font-medium truncate">{selectedFeijao}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#F4A300] font-bold">🍝 Macarrão:</span>
                    <span className="font-medium truncate">{selectedMacarrao}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#F4A300] font-bold">🌾 Farofa:</span>
                    <span className="font-medium truncate">{selectedFarofa}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#F4A300] font-bold">🥗 Salada:</span>
                    <span className="font-medium truncate">{selectedSalada}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <span className="text-[#F4A300] font-bold">🥔 Purê:</span>
                    <span className="font-medium truncate">{selectedPure}</span>
                  </div>
                </div>

                {observations && (
                  <div className="pt-2 border-t border-white/10 text-[11px] text-[#FFF3E0]/80 italic">
                    Obs: "{observations}"
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <button
                  onClick={goToPrevStep}
                  className="rounded-full border border-white/20 text-white px-6 py-3 text-xs uppercase font-black hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </button>

                <div className="text-right">
                  <span className="text-[10px] text-white/60 block uppercase">Preço por marmita</span>
                  <span className="font-mono font-black text-xl text-[#F4A300]">
                    R$ {unitPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer Action Bar */}
        <div className="border-t border-[#F4A300]/25 bg-[#17100B] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-2xl">
          
          {/* Quantity selector */}
          <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
            <span className="text-xs uppercase font-bold text-white/80 font-sans">Quantidade:</span>
            <div className="flex items-center rounded-full bg-black/60 border border-white/15 p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer disabled:opacity-30"
                disabled={quantity <= 1}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center font-mono text-sm font-black text-[#F4A300]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Add to order action button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] text-white/60 uppercase font-sans">Total com {quantity}x</span>
              <span className="font-mono font-black text-lg text-[#F4A300]">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              id="btn-confirm-add-monte-marmita"
              onClick={handleFinishAndAdd}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF7A00] via-[#E85D04] to-[#F4A300] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-[#111111] shadow-[0_0_25px_rgba(244,163,0,0.4)] hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 stroke-[2.5]" />
              <span>Adicionar ao Pedido • R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
