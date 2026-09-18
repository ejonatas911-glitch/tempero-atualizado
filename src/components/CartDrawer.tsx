import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, Plus, Minus, Check, MapPin, Truck, Store, CreditCard, DollarSign, QrCode, Banknote, ArrowLeft, Compass, RefreshCw, Phone, Smartphone } from 'lucide-react';
import { CartItem, CustomerOrderInfo } from '../types';
import { PRIMARY_PHONE_RAW, PRIMARY_PHONE_FORMATTED, SECONDARY_PHONE_RAW, SECONDARY_PHONE_FORMATTED, PIX_KEY } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, amount: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [reference, setReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cash' | 'card'>('pix');
  const [cashChangeFor, setCashChangeFor] = useState('');
  const [selectedWhatsApp, setSelectedWhatsApp] = useState<string>(PRIMARY_PHONE_RAW);
  const [isFinishing, setIsFinishing] = useState(false);
  const [orderSentDetail, setOrderSentDetail] = useState<{ formattedText: string; total: number } | null>(null);

  // GPS Location states & integration
  const [isLocating, setIsLocating] = useState(false);
  const [locatingError, setLocatingError] = useState<string | null>(null);

  // Load saved location on modal open
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('tempero-nordestino-detected-location');
        if (saved) {
          const loc = JSON.parse(saved);
          if (loc && !street) {
            setStreet(loc.street || '');
            setNeighborhood(loc.neighborhood || '');
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  // Synchronize locations in real-time if changed
  useEffect(() => {
    const handleLocation = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const loc = customEvent.detail;
        setStreet(loc.street || '');
        setNeighborhood(loc.neighborhood || '');
      }
    };
    
    const handleClear = () => {
      setStreet('');
      setNeighborhood('');
    };

    window.addEventListener('tempero-location-detected', handleLocation);
    window.addEventListener('tempero-location-cleared', handleClear);
    return () => {
      window.removeEventListener('tempero-location-detected', handleLocation);
      window.removeEventListener('tempero-location-cleared', handleClear);
    };
  }, []);

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      setLocatingError('GPS não suportado por seu dispositivo.');
      return;
    }
    setIsLocating(true);
    setLocatingError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            { headers: { 'Accept-Language': 'pt-BR' } }
          );
          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const detectedStreet = addr.road || addr.pedestrian || addr.highway || addr.construction || addr.suburb || '';
            const detectedNeighborhood = addr.neighbourhood || addr.suburb || addr.village || addr.city_district || addr.township || 'Centro';
            
            setStreet(detectedStreet);
            setNeighborhood(detectedNeighborhood);
            
            // Save state
            const addressArray = [];
            if (detectedStreet) addressArray.push(detectedStreet);
            if (detectedNeighborhood) addressArray.push(detectedNeighborhood);
            addressArray.push('Arari');
            
            const newLoc = {
              lat: latitude,
              lng: longitude,
              street: detectedStreet,
              neighborhood: detectedNeighborhood,
              number: '',
              city: 'Arari',
              addressText: addressArray.join(', ')
            };
            localStorage.setItem('tempero-nordestino-detected-location', JSON.stringify(newLoc));
            // Notify other widgets
            window.dispatchEvent(new CustomEvent('tempero-location-detected', { detail: newLoc }));
          }
        } catch (err) {
          console.error(err);
          setLocatingError('Erro ao converter coordenadas para endereço.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setLocatingError('Sinal GPS indisponível ou permissão negada.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Constants
  const DELIVERY_FEE = 5.00;

  // Calculators
  const itemsTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCost = method === 'delivery' ? DELIVERY_FEE : 0;
  const grandTotal = itemsTotal + deliveryCost;

  // Error validations
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!name.trim()) tempErrors.name = 'Nome é obrigatório';
    if (!phone.trim()) tempErrors.phone = 'WhatsApp é obrigatório';

    if (method === 'delivery') {
      if (!street.trim()) tempErrors.street = 'Rua é obrigatória';
      if (!number.trim()) tempErrors.number = 'Número é obrigatório';
      if (!neighborhood.trim()) tempErrors.neighborhood = 'Bairro é obrigatório';
    }

    if (paymentMethod === 'cash') {
      if (cashChangeFor && parseFloat(cashChangeFor.replace(',', '.')) < grandTotal) {
        tempErrors.cashChangeFor = `O valor do troco deve ser maior que R$ ${grandTotal.toFixed(2)}`;
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!validateForm()) return;

    // Generate WhatsApp Message text
    let text = `*🏡 TEMPERO NORDESTINO - PEDIDO EXCLUSIVO* 🍛🍴\n`;
    text += `*Olá! Acabei de fazer um pedido pelo site de Arari!*\n`;
    text += `====================================\n`;
    text += `*👤 CLIENTE:* ${name}\n`;
    text += `*📞 WHATSAPP:* ${phone}\n`;
    text += `*🚚 ENTREGA/RETIRADA:* ${method === 'delivery' ? '🛵 Receber em Casa' : '🏪 Retirar no Restaurante'}\n`;
    text += `====================================\n\n`;

    text += `*🍱 MEUS PRATOS & COMPLEMENTOS:*\n`;
    cartItems.forEach((item, index) => {
      text += `*${index + 1}. item:* ${item.quantity}x _${item.name}_\n`;
      text += `   └ Valor unitário: R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
      
      if (item.marmitaSelections) {
        text += `   🍱 *Montagem Passo a Passo:*\n`;
        text += `      • 🥩 *Carne:* ${item.marmitaSelections.carne}\n`;
        text += `      • 🍚 *Arroz:* ${item.marmitaSelections.arroz}\n`;
        text += `      • 🍲 *Feijão:* ${item.marmitaSelections.feijao}\n`;
        text += `      • 🍝 *Macarrão:* ${item.marmitaSelections.macarrao}\n`;
        text += `      • 🌾 *Farofa:* ${item.marmitaSelections.farofa}\n`;
        text += `      • 🥗 *Salada:* ${item.marmitaSelections.salada}\n`;
        text += `      • 🥔 *Purê:* ${item.marmitaSelections.pure}\n`;
        text += `      • 📐 *Tamanho:* ${item.marmitaSelections.tamanho}\n`;
      } else if (item.removedAccompaniments && item.removedAccompaniments.length > 0) {
        text += `   └ 🚫 _Não colocar:_ ${item.removedAccompaniments.join(', ')}\n`;
      }
      if (item.observations) {
        text += `   └ ✍️ _Observações:_ "${item.observations}"\n`;
      }
      text += `\n`;
    });

    if (method === 'delivery') {
      text += `*📍 ENDEREÇO PARA ENTREGA:*\n`;
      text += `   📍 *Rua:* ${street}, Nº ${number}\n`;
      text += `   📍 *Bairro:* ${neighborhood}\n`;
      if (complement) text += `   📍 *Complemento:* ${complement}\n`;
      if (reference) text += `   📍 *Referência:* ${reference}\n`;
      text += `====================================\n\n`;
    } else {
      text += `*🏪 RETIRADA:* Retirarei na Rua do Posto BR Mania, 06 - Centro, Arari - MA\n`;
      text += `====================================\n\n`;
    }

    text += `*💳 DETALHES DE PAGAMENTO:*\n`;
    const payModes = { pix: 'Pix ⚡', card: 'Cartão (Levar Maquininha 💳)', cash: 'Espécie / Dinheiro 💵' };
    text += `   • *Forma:* ${payModes[paymentMethod]}\n`;
    
    if (paymentMethod === 'cash') {
      if (cashChangeFor) {
        const changeNeeded = parseFloat(cashChangeFor.replace(',', '.')) - grandTotal;
        text += `   • *Pagar com:* R$ ${parseFloat(cashChangeFor.replace(',', '.')).toFixed(2).replace('.', ',')}\n`;
        text += `   • *Levar troco de:* R$ ${changeNeeded.toFixed(2).replace('.', ',')}\n`;
      } else {
        text += `   • *Troco:* Não precisa de troco\n`;
      }
    } else if (paymentMethod === 'pix') {
      text += `   • *Chave Pix:* ${PIX_KEY} (Celular)\n`;
      text += `   _Vou enviar o comprovante em seguida._\n`;
    } else if (paymentMethod === 'card') {
      text += `   • *Aviso:* Por favor, levar a maquininha de cartão para pagamento na entrega.\n`;
    }
    text += `====================================\n\n`;

    text += `*🧾 RESUMO FINANCEIRO:*\n`;
    text += `   • Subtotal Pratos: R$ ${itemsTotal.toFixed(2).replace('.', ',')}\n`;
    if (method === 'delivery') {
      text += `   • Taxa de Entrega: R$ ${DELIVERY_FEE.toFixed(2).replace('.', ',')}\n`;
    }
    text += `   • *VALOR TOTAL:* R$ ${grandTotal.toFixed(2).replace('.', ',')}\n`;
    text += `====================================\n\n`;
    text += `🚀 *Por favor, confirme e inicie meu pedido do Tempero Nordestino! Obrigado!*`;

    // Open WhatsApp link
    const whatsappNumber = selectedWhatsApp || PRIMARY_PHONE_RAW;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedText}`;

    window.open(whatsappUrl, '_blank');

    // Trigger local successful screen
    setOrderSentDetail({ formattedText: text, total: grandTotal });
  };

  const handleCloseReceipt = () => {
    setOrderSentDetail(null);
    onClearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md">
      {/* Background click close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ tension: 200, friction: 25 }}
        id="cart-drawer-panel"
        className="relative z-10 flex h-full w-full max-w-lg flex-col bg-[#111111]/95 text-white border-l border-[#F4A300]/25 shadow-2xl glass-panel"
      >
        {/* Receipt Screen (Shown after successful submit) */}
        <AnimatePresence>
          {orderSentDetail && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              id="receipt-container"
              className="absolute inset-0 z-20 flex flex-col bg-[#111111] p-6 overflow-y-auto"
            >
              <div className="my-auto max-w-md mx-auto space-y-6 text-center w-full">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F4A300]/15 text-[#F4A300]">
                  <Check className="h-9 w-9 stroke-[3]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif italic font-black text-white">Pedido Enviado!</h3>
                  <p className="text-xs text-[#FFF3E0]/90 font-sans leading-relaxed">
                    Enviamos os detalhes do seu pedido com sucesso para o WhatsApp do restaurante parceiro. Verifique o aplicativo do WhatsApp para enviar a mensagem do carrinho!
                  </p>
                </div>

                {/* Simulated Ticket Visual (Premium brand invoice) */}
                <div className="rounded-2xl border border-[#F4A300]/25 bg-[#111111]/90 p-5.5 text-left font-mono text-xs shadow-2xl space-y-3.5 divide-y divide-dotted divide-[#F4A300]/30 text-[#FFF3E0]">
                  <div className="pb-3 text-center">
                    <p className="font-serif italic font-black text-[#F4A300] text-base">TEMPERO NORDESTINO</p>
                    <p className="text-[10px] text-white/50 tracking-wider">Recibo gerado em {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="py-3.5 space-y-2 text-[#FFF3E0]/95 font-sans">
                    <p className="text-[9.5px] tracking-wide"><span className="font-black text-[#F4A300] uppercase text-[9px] mr-1">Cliente:</span> {name}</p>
                    <p className="text-[9.5px] tracking-wide"><span className="font-black text-[#F4A300] uppercase text-[9px] mr-1">Método:</span> {method === 'delivery' ? 'Entrega em Casa' : 'Retirada no Local'}</p>
                    {method === 'delivery' && (
                      <p className="text-[9.5px] tracking-wide"><span className="font-black text-[#F4A300] uppercase text-[9px] mr-1">Endereço:</span> {street}, {number} - {neighborhood}</p>
                    )}
                  </div>
                  <div className="py-3.5 space-y-1.5 font-mono text-[11px]">
                    <p className="font-black text-[#F4A300] font-sans text-[10px] uppercase pb-1 tracking-wider">Produtos:</p>
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-white/90">
                        <span>• {item.quantity}x {item.name}</span>
                        <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3.5 font-sans font-black flex justify-between text-white text-sm">
                    <span className="tracking-wide">VALOR TOTAL</span>
                    <span className="text-[#F4A300]">R$ {grandTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <button
                  id="btn-close-receipt"
                  onClick={handleCloseReceipt}
                  className="w-full h-12 rounded-full btn-premium-gold uppercase tracking-wider text-xs font-extrabold cursor-pointer"
                >
                  Fazer outro pedido &rarr;
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#F4A300]/25 bg-[#111111] px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-[#F4A300]" />
            <span className="font-serif italic text-lg font-black text-white">Seu Carrinho</span>
            <span className="rounded-full bg-gradient-to-r from-[#FF7A00] to-[#E85D04] px-3 py-0.5 font-mono text-xs font-black text-white border border-[#F4A300]/20">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            id="btn-close-cart-panel"
            onClick={onClose}
            className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body */}
        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-5">
            <div className="rounded-full bg-[#111111] border border-[#F4A300]/20 p-6 text-[#F4A300] shadow-xl">
              <ShoppingCart className="h-10 w-10 stroke-[2]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif italic text-lg font-black text-white">O carrinho está vazio</h3>
              <p className="text-xs text-[#FFF3E0]/70 max-w-xs font-sans leading-relaxed">
                Adicione deliciosos pratos e bebidas do cardápio do Tempero Nordestino para iniciar seu pedido personalizado.
              </p>
            </div>
            <button
              id="btn-cart-back-menu"
              onClick={onClose}
              className="rounded-full btn-premium px-8 py-3 text-xs tracking-wider uppercase font-black cursor-pointer font-sans"
            >
              Ver Cardápio
            </button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* Scrollable Items list */}
            <div className="divide-y divide-[#F4A300]/15 bg-[#111111]/40 border-b border-[#F4A300]/20 max-h-[35vh] overflow-y-auto scrollbar-thin">
              {cartItems.map((item) => (
                <div key={item.id} className="flex p-4.5 gap-3.5 hover:bg-[#111111]/60 transition-colors">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <h4 className="font-serif italic text-sm font-black text-white leading-snug">{item.name}</h4>
                      <span className="font-mono text-xs font-black text-[#F4A300] ml-2 shrink-0">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    {/* Marmita Step-by-Step Customization Breakdown or Excluded Accompaniments */}
                    {item.marmitaSelections ? (
                      <div className="text-[10px] text-white/85 bg-black/50 rounded-xl p-2.5 border border-[#F4A300]/25 space-y-1 font-sans mt-1">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase text-[#F4A300] tracking-wider border-b border-white/10 pb-1">
                          <span>🍱 Montagem da Marmita</span>
                          <span className="text-white/80 bg-white/10 px-1.5 py-0.5 rounded">{item.marmitaSelections.tamanho}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9.5px]">
                          <p><span className="text-[#F4A300] font-bold">🥩</span> {item.marmitaSelections.carne}</p>
                          <p><span className="text-[#F4A300] font-bold">🍚</span> {item.marmitaSelections.arroz}</p>
                          <p><span className="text-[#F4A300] font-bold">🍲</span> {item.marmitaSelections.feijao}</p>
                          <p><span className="text-[#F4A300] font-bold">🍝</span> {item.marmitaSelections.macarrao}</p>
                          <p><span className="text-[#F4A300] font-bold">🌾</span> {item.marmitaSelections.farofa}</p>
                          <p><span className="text-[#F4A300] font-bold">🥗</span> {item.marmitaSelections.salada}</p>
                          <p className="col-span-2"><span className="text-[#F4A300] font-bold">🥔</span> {item.marmitaSelections.pure}</p>
                        </div>
                      </div>
                    ) : item.removedAccompaniments && item.removedAccompaniments.length > 0 ? (
                      <p className="text-[10px] text-[#FF7A00] font-sans font-bold uppercase tracking-wider">
                        🚫 Sem: {item.removedAccompaniments.join(', ')}
                      </p>
                    ) : null}

                    {/* Custom Observation item */}
                    {item.observations && (
                      <p className="text-[10px] text-[#F4A300] bg-[#F4A300]/10 border border-[#F4A300]/15 rounded px-2 py-0.5 inline-block font-sans font-black">
                        ✍️ Obs: "{item.observations}"
                      </p>
                    )}

                    {/* Item modifiers controller */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-[#F4A300]/20 bg-[#111111]/60 p-0.5">
                        <button
                          id={`qt-dec-${item.id}`}
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 px-2 text-white/70 hover:text-[#F4A300] transition cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-black text-[#F4A300]">
                          {item.quantity}
                        </span>
                        <button
                          id={`qt-inc-${item.id}`}
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 px-2 text-white/70 hover:text-[#F4A300] transition cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        id={`del-item-${item.id}`}
                        onClick={() => onRemoveItem(item.id)}
                        className="text-white/40 hover:text-red-500 p-1.5 transition rounded-full hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Form section */}
            <div className="p-5.5 space-y-6 bg-black/30 flex-1 overflow-y-auto scrollbar-thin">
              <h3 className="text-[10px] font-black font-sans tracking-widest text-[#F4A300] uppercase pb-2 border-b border-[#F4A300]/20">
                Informações para Entrega
              </h3>

              {/* Delivery Choice (Truck vs Store Pickup) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="checkout-method-delivery"
                  type="button"
                  onClick={() => setMethod('delivery')}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3.5 transition cursor-pointer ${
                    method === 'delivery'
                      ? 'border-[#F4A300] bg-[#FF7A00]/10 text-white font-extrabold shadow-md shadow-[#FF7A00]/10'
                      : 'border-white/10 bg-black/45 text-white/60 hover:border-white/20'
                  }`}
                >
                  <Truck className="h-4 w-4 text-[#F4A300]" />
                  <span className="text-xs font-sans">Receber em Casa</span>
                </button>
                <button
                  id="checkout-method-pickup"
                  type="button"
                  onClick={() => setMethod('pickup')}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3.5 transition cursor-pointer ${
                    method === 'pickup'
                      ? 'border-[#F4A300] bg-[#FF7A00]/10 text-white font-extrabold shadow-md shadow-[#FF7A00]/10'
                      : 'border-white/10 bg-black/45 text-white/60 hover:border-white/20'
                  }`}
                >
                  <Store className="h-4 w-4 text-[#F4A300]" />
                  <span className="text-xs font-sans">Retirar no Local</span>
                </button>
              </div>

              {/* Personal info Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1 block">
                  <label htmlFor="customer-name" className="text-[9px] font-black font-sans tracking-widest text-[#FFF3E0]/70 uppercase">
                    Seu Nome *
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full rounded-xl border bg-black/45 p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#F4A300] ${
                      errors.name ? 'border-red-500' : 'border-white/15'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-1 block">
                  <label htmlFor="customer-phone" className="text-[9px] font-black font-sans tracking-widest text-[#FFF3E0]/70 uppercase">
                    WhatsApp (Celular) *
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    placeholder="Ex: (98) 99999-9999"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    className={`w-full rounded-xl border bg-black/45 p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#F4A300] ${
                      errors.phone ? 'border-red-500' : 'border-white/15'
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Delivery specific fields */}
              {method === 'delivery' && (
                <div className="space-y-3.5 animate-fade-in block">
                  
                  {/* GPS Delivery Autofill Trigger Button */}
                  <div className="bg-[#111111]/60 border border-[#F4A300]/20 rounded-xl p-3 flex flex-col gap-2 shadow-inner">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[10px] font-black uppercase text-[#F4A300] tracking-wider flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#F4A300]" />
                        Autocompletar via GPS
                      </span>
                      
                      <button
                        id="btn-drawer-quick-gps"
                        type="button"
                        onClick={handleGetGPS}
                        disabled={isLocating}
                        className="rounded-lg bg-[#F4A300] text-[#111111] px-3.5 py-1.5 text-[9.5px] uppercase font-black tracking-wider hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {isLocating ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Compass className="h-3 w-3 stroke-[2.5]" />
                        )}
                        <span>{isLocating ? 'Buscando...' : 'Puxar Localização'}</span>
                      </button>
                    </div>
                    
                    {locatingError ? (
                      <p className="text-[9.5px] text-red-400 font-sans mt-0.5 leading-snug font-semibold">{locatingError}</p>
                    ) : (
                      <p className="text-[9.5px] text-[#FFF3E0]/70 leading-relaxed">
                        {street && neighborhood ? '✅ Campos preenchidos com o seu GPS ativo.' : 'Preencha os campos abaixo de forma 100% automática com apenas um clique!'}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1 block">
                      <label htmlFor="delivery-street" className="text-[9px] font-black font-sans tracking-widest text-[#FFF3E0]/70 uppercase">
                        Rua / Avenida *
                      </label>
                      <input
                        id="delivery-street"
                        type="text"
                        placeholder="Nome da sua rua"
                        value={street}
                        onChange={(e) => {
                          setStreet(e.target.value);
                          if (errors.street) setErrors({ ...errors, street: '' });
                        }}
                        className={`w-full rounded-xl border bg-black/45 p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#F4A300] ${
                          errors.street ? 'border-red-500' : 'border-white/15'
                        }`}
                      />
                      {errors.street && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.street}</p>}
                    </div>

                    <div className="space-y-1 block">
                      <label htmlFor="delivery-number" className="text-[9px] font-black font-sans tracking-widest text-[#FFF3E0]/70 uppercase">
                        Número *
                      </label>
                      <input
                        id="delivery-number"
                        type="text"
                        placeholder="Nº"
                        value={number}
                        onChange={(e) => {
                          setNumber(e.target.value);
                          if (errors.number) setErrors({ ...errors, number: '' });
                        }}
                        className={`w-full rounded-xl border bg-black/45 p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#F4A300] ${
                          errors.number ? 'border-red-500' : 'border-white/15'
                        }`}
                      />
                      {errors.number && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.number}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1 block">
                      <label htmlFor="delivery-neighborhood" className="text-[9px] font-black font-sans tracking-widest text-[#FFF3E0]/70 uppercase">
                        Bairro *
                      </label>
                      <input
                        id="delivery-neighborhood"
                        type="text"
                        placeholder="Ex: Centro"
                        value={neighborhood}
                        onChange={(e) => {
                          setNeighborhood(e.target.value);
                          if (errors.neighborhood) setErrors({ ...errors, neighborhood: '' });
                        }}
                        className={`w-full rounded-xl border bg-black/45 p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#F4A300] ${
                          errors.neighborhood ? 'border-red-500' : 'border-white/15'
                        }`}
                      />
                      {errors.neighborhood && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.neighborhood}</p>}
                    </div>

                    <div className="space-y-1 block">
                      <label htmlFor="delivery-complement" className="text-[9px] font-black font-sans tracking-widest text-[#FFF3E0]/70 uppercase">
                        Complemento (Opcional)
                      </label>
                      <input
                        id="delivery-complement"
                        type="text"
                        placeholder="Apto, Bloco, etc."
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/45 p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#F4A300]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 block">
                    <label htmlFor="delivery-reference" className="text-[9px] font-black font-sans tracking-widest text-[#FFF3E0]/70 uppercase block">
                      Ponto de Referência (Opcional)
                    </label>
                    <input
                      id="delivery-reference"
                      type="text"
                      placeholder="Ex: Próximo ao posto de gasolina"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/45 p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#F4A300]"
                    />
                  </div>
                </div>
              )}

              {/* Payment Select section */}
              <div className="space-y-4 block">
                <label className="text-[10px] font-extrabold font-sans tracking-widest text-[#F4A300] uppercase block pb-1 border-b border-white/10">
                  Forma de Pagamento (Selecione uma)
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { 
                      id: 'pix', 
                      label: 'Pix', 
                      desc: 'Chave Celular', 
                      icon: QrCode, 
                      color: 'text-[#F4A300]', 
                      bg: 'bg-[#FF7A00]/10',
                      borderColor: 'border-[#F4A300]' 
                    },
                    { 
                      id: 'cash', 
                      label: 'Espécie', 
                      desc: 'Dinheiro', 
                      icon: Banknote, 
                      color: 'text-emerald-500', 
                      bg: 'bg-emerald-500/10',
                      borderColor: 'border-emerald-500' 
                    },
                    { 
                      id: 'card', 
                      label: 'Cartão', 
                      desc: 'Maquininha', 
                      icon: CreditCard, 
                      color: 'text-brand-orange', 
                      bg: 'bg-brand-orange/15',
                      borderColor: 'border-brand-orange' 
                    },
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    const IconComp = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(m.id as any);
                          // Clear change value if changing from cash
                          if (m.id !== 'cash') {
                            setCashChangeFor('');
                          }
                        }}
                        className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.03] cursor-pointer text-center ${
                          isSelected
                            ? `${m.borderColor} ${m.bg} shadow-md scale-102`
                            : 'border-white/10 bg-black/45 text-white/70 hover:border-white/20'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <Check className="h-2.5 w-2.5 stroke-[4]" />
                          </div>
                        )}
                        <IconComp className={`h-8 w-8 mb-1.5 ${isSelected ? m.color : 'text-white/40'}`} />
                        <span className={`text-[11px] sm:text-xs font-black tracking-wide ${isSelected ? 'text-white' : 'text-white/80'}`}>
                          {m.label}
                        </span>
                        <span className="text-[8px] sm:text-[9.5px] font-medium text-white/50 mt-0.5">
                          {m.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Cash dynamic Change field */}
                {paymentMethod === 'cash' && (
                  <div className="mt-3 rounded-xl bg-black/45 p-4 border border-white/10 space-y-2 animate-slide-down block">
                    <label htmlFor="cash-change" className="text-xs font-black font-sans text-[#F4A300] block">
                      💵 Precisa de troco para quanto?
                    </label>
                    <p className="text-[10px] text-[#FFF3E0]/70">Informe o valor em dinheiro com o qual vai pagar para mandarmos o troco exato:</p>
                    <div className="flex items-center gap-2 bg-black/60 rounded-xl border border-white/20 px-3 py-2.5 text-xs">
                      <span className="font-extrabold text-[#F4A300]">R$</span>
                      <input
                        id="cash-change"
                        type="text"
                        placeholder="Ex: 50,00"
                        value={cashChangeFor}
                        onChange={(e) => {
                          setCashChangeFor(e.target.value);
                          if (errors.cashChangeFor) setErrors({ ...errors, cashChangeFor: '' });
                        }}
                        className="w-full bg-transparent focus:outline-none text-white font-mono"
                      />
                    </div>
                    {errors.cashChangeFor && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.cashChangeFor}</p>}
                  </div>
                )}

                {/* Pix instructions block */}
                {paymentMethod === 'pix' && (
                  <div className="mt-3 rounded-xl bg-gradient-to-r from-[#FF7A00]/10 to-[#E85D04]/10 p-4 border border-[#F4A300]/25 text-[11px] text-white font-sans block leading-relaxed shadow-inner">
                    ⚡ <span className="font-black text-[#F4A300]">Chave Pix do Restaurante:</span> <span className="font-black font-mono text-[#F4A300] bg-black/45 px-2 py-0.5 rounded border border-white/10">{PIX_KEY}</span> (Celular)
                    <p className="mt-2 text-[10px] text-[#FFF3E0]/70">Efetue o Pix pelo aplicativo do seu banco e mande o comprovante logo após confirmar o pedido no WhatsApp!</p>
                  </div>
                )}

                {/* Card instructions block */}
                {paymentMethod === 'card' && (
                  <div className="mt-3 rounded-xl bg-black/45 p-4 border border-white/10 text-[11px] text-white font-sans block leading-relaxed">
                    💳 <span className="font-black text-[#F4A300]">Pagamento de Cartão na Entrega:</span> Levamos a maquininha de cartão diretamente até sua residência!
                    <p className="mt-2 text-[10px] text-[#FFF3E0]/70">Aceitamos com total segurança as principais bandeiras nacionais de Crédito e Débito.</p>
                  </div>
                )}

                {/* WhatsApp destination selector */}
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <label className="text-[10.5px] font-black font-sans tracking-widest text-[#F4A300] uppercase block">
                    📲 Enviar Pedido para qual WhatsApp?
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedWhatsApp(PRIMARY_PHONE_RAW)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedWhatsApp === PRIMARY_PHONE_RAW
                          ? 'border-[#F4A300] bg-[#F4A300]/15 ring-1 ring-[#F4A300]'
                          : 'border-white/10 bg-black/40 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-[#F4A300] text-black px-2 py-0.5 rounded-full">
                          ⭐ Principal
                        </span>
                        {selectedWhatsApp === PRIMARY_PHONE_RAW && (
                          <Check className="h-3.5 w-3.5 text-[#F4A300]" />
                        )}
                      </div>
                      <span className="font-mono font-bold text-xs text-white mt-1.5">{PRIMARY_PHONE_FORMATTED}</span>
                      <span className="text-[9.5px] text-white/60">Atendimento Oficial Prioritário</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedWhatsApp(SECONDARY_PHONE_RAW)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedWhatsApp === SECONDARY_PHONE_RAW
                          ? 'border-[#F4A300] bg-[#F4A300]/15 ring-1 ring-[#F4A300]'
                          : 'border-white/10 bg-black/40 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 bg-white/10 px-2 py-0.5 rounded-full">
                          Contato 2
                        </span>
                        {selectedWhatsApp === SECONDARY_PHONE_RAW && (
                          <Check className="h-3.5 w-3.5 text-[#F4A300]" />
                        )}
                      </div>
                      <span className="font-mono font-bold text-xs text-white mt-1.5">{SECONDARY_PHONE_FORMATTED}</span>
                      <span className="text-[9.5px] text-white/60">Atendimento Complementar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Footer computation */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#F4A300]/25 bg-[#111111] p-5 space-y-4">
            <div className="space-y-2 text-xs text-white/70 font-sans font-medium">
              <div className="flex justify-between">
                <span>Subtotal Itens</span>
                <span className="font-mono text-white">R$ {itemsTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {method === 'delivery' && (
                <div className="flex justify-between">
                  <span>Taxa de Entrega (Fixa)</span>
                  <span className="font-mono text-white">R$ {DELIVERY_FEE.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-black text-white pt-2 border-t border-white/10">
                <span className="tracking-widest uppercase">Total Geral do Pedido</span>
                <span className="font-mono text-[#F4A300] text-sm">R$ {grandTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button
              id="btn-submit-order"
              type="button"
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#FF7A00] to-[#E85D04] border border-[#F4A300]/30 text-white font-black py-4 text-xs tracking-wider uppercase transition-all duration-300 shadow-md shadow-[#FF7A00]/25 cursor-pointer font-sans hover:brightness-110 active:scale-[0.99]"
            >
              🚀 Confirmar & Enviar via WhatsApp • R$ {grandTotal.toFixed(2).replace('.', ',')}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
