import { Dish, Drink } from './types';

export const PRIMARY_PHONE_RAW = '5598981049475';
export const PRIMARY_PHONE_FORMATTED = '(98) 98104-9475';
export const SECONDARY_PHONE_RAW = '5598981639954';
export const SECONDARY_PHONE_FORMATTED = '(98) 98163-9954';

export const PIX_KEY = '98981049475'; // Chave Pix Celular Principal

export const DEFAULT_ACCOMPANIMENTS = [
  'Arroz Soltinho',
  'Feijão Caseiro',
  'Macarrão na Manteiga',
  'Farofa Crocante',
  'Salada Fresca',
  'Purê de Batata Cremoso'
];

export const DISHES: Dish[] = [
  {
    id: 'carne-de-sol',
    name: 'Carne de Sol Completa',
    description: 'Deliciosa carne de sol artesanal grelhada na chapa com cebola roxa, queijo coalho assado e mandioca cozida amanteigada.',
    category: 'carnes',
    price: 19.99,
    image: 'https://lh3.googleusercontent.com/d/1DBH8q2c7_iA10gQduK5vFThdRg7gnpQ2',
    isFeatured: false
  },
  {
    id: 'bisteca-suina',
    name: 'Bisteca Suína',
    description: 'Duas suculentas bistecas suínas grelhadas no capricho, bem douradas e temperadas com limão e ervas finas.',
    category: 'carnes',
    price: 19.99,
    image: 'https://lh3.googleusercontent.com/d/1NYCHxq-rXWqUUwLLwt6FpmBn5Sh-FEVW',
    isFeatured: false
  },
  {
    id: 'bisteca-bovina',
    name: 'Bisteca Bovina',
    description: 'Bisteca bovina premium com osso, grelhada com cebola caramelizada e finalizada com manteiga de garrafa.',
    category: 'carnes',
    price: 19.99,
    image: 'https://lh3.googleusercontent.com/d/1QtkT34rLzrfcsytbaxB9XGP-QoL7f3d_',
    isFeatured: false
  },
  {
    id: 'cozidao-nordestino',
    name: 'Cozidão Nordestino',
    description: 'Ensopado tradicional riquíssimo de cozido bovino feito lentamente com pedaços de mandioca, abóbora, quiabo, maxixe e batata.',
    category: 'carnes',
    price: 19.99,
    image: 'https://lh3.googleusercontent.com/d/1dhNNLZSVnRwg1EqUqt93_aD2f8UtTVBi',
    isFeatured: false
  },
  {
    id: 'bife-acebolado',
    name: 'Bife Acebolado com Batata',
    description: 'Bife bovino macio grelhado, coberto com uma montanha de anéis de cebola dourados e batatas fritas crocantes.',
    category: 'carnes',
    price: 19.99,
    image: 'https://lh3.googleusercontent.com/d/13ZOtT5X0LeiBeMNkCsQuQ3HAEEMquwFa',
    isFeatured: false
  },
  {
    id: 'figado-acebolado',
    name: 'Fígado Acebolado',
    description: 'Bife de fígado bovino fatiado fininho, extremamente macio, grelhado rapidamente com cebola e pimentão na chapa.',
    category: 'carnes',
    price: 19.99,
    image: 'https://lh3.googleusercontent.com/d/1atleLDVBk1-tqKNexGxJmzHsEHQLy_JC',
    isFeatured: false
  },
  {
    id: 'peixe-cozido',
    name: 'Peixe Cozido ao Molho de Coco',
    description: 'Posta de peixe fresca cozida lentamente em um delicioso molho de leite de coco leve, coentro, cebola, tomate and pimentões.',
    category: 'peixes',
    price: 19.99,
    image: 'https://lh3.googleusercontent.com/d/1Ib5HhsF12V8fUm6vOALugt0Hf0mQveKS',
    isFeatured: false
  },
  {
    id: 'peixe-frito',
    name: 'Peixe Frito Crocante',
    description: 'Generosa posta de peixe empanada e frita na hora, super sequinha por fora e muito suculenta e úmida por dentro.',
    category: 'peixes',
    price: 19.99,
    image: 'https://lh3.googleusercontent.com/d/1L9DOvjmEOUeIkTIb6SjyXS4PvTdRi7sS',
    isFeatured: false
  },
  {
    id: 'frango-frito',
    name: 'Frango Frito Crocante',
    description: 'Deliciosos pedaços de frango fritos sob medida, dourados e extremamente crocantes por fora, suculentos por dentro.',
    category: 'frango',
    price: 19.99,
    image: 'https://lh3.googleusercontent.com/d/1dFpy6ktJQ9UImGI40qNeqiPiFvLJxwvb',
    isFeatured: false
  },
  {
    id: 'frango-cozido',
    name: 'Frango Cozido com Quiabo',
    description: 'Frango ensopado ao molho caseiro com batata, cenoura e temperado com cominho, coentro e um toque de pimenta doce.',
    category: 'frango',
    price: 19.99,
    image: 'https://lh3.googleusercontent.com/d/14NfoJ42rsUIAhXcdeBrKkShvQDXwEui1',
    isFeatured: false
  },
  {
    id: 'assado-de-panela',
    name: 'Assado de Panela',
    description: 'Suculento assado de panela bovino cozido lentamente em molho encorpado com batatas, cenouras e temperos caseiros.',
    category: 'carnes',
    price: 19.99,
    image: 'https://lh3.googleusercontent.com/d/1Yp80JCxqY1LxcIfz-nxvk1K-Tj42HgCN',
    isFeatured: false
  }
];

export const DRINKS: Drink[] = [
  // SUCOS NATURAIS
  {
    id: 'suco-acerola',
    name: 'Suco de Acerola',
    type: 'juice',
    image: 'https://lh3.googleusercontent.com/d/1ViKv9_4eg-HG0OPT3Y1-pPRUX5Xp25C5',
    isFeatured: false,
    prices: {
      '300ml': 7.00,
      '500ml': 9.50,
      '1 Litro': 16.00
    }
  },
  {
    id: 'suco-caja',
    name: 'Suco de Cajá',
    type: 'juice',
    image: 'https://lh3.googleusercontent.com/d/1z4w8VHMsoO8etUgOhmfcqTKWVDn2mSLo',
    isFeatured: false,
    prices: {
      '300ml': 7.00,
      '500ml': 9.50,
      '1 Litro': 16.00
    }
  },
  {
    id: 'suco-goiaba',
    name: 'Suco de Goiaba',
    type: 'juice',
    image: 'https://lh3.googleusercontent.com/d/1f4Kve40NHjvYaNpvVZo70CHS8GNRCAo3',
    isFeatured: false,
    prices: {
      '300ml': 7.00,
      '500ml': 9.50,
      '1 Litro': 16.00
    }
  },
  {
    id: 'suco-maracuja',
    name: 'Suco de Maracujá',
    type: 'juice',
    image: 'https://lh3.googleusercontent.com/d/1a2m9SrYoBlYWbXeNEcsMxaPS7BMo8WjS',
    isFeatured: false,
    prices: {
      '300ml': 7.00,
      '500ml': 9.50,
      '1 Litro': 16.00
    }
  },
  {
    id: 'suco-abacaxi',
    name: 'Suco de Abacaxi com Hortelã',
    type: 'juice',
    image: 'https://lh3.googleusercontent.com/d/1opd-G6SWdHPcFIRsr95W3NMDmPtL3NhR',
    isFeatured: false,
    prices: {
      '300ml': 7.00,
      '500ml': 9.50,
      '1 Litro': 16.00
    }
  },
  // REFRIGERANTES
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    type: 'soda',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    prices: {
      'Lata 350ml': 6.00,
      '600ml': 8.00,
      '1 Litro': 11.00,
      '2 Litros': 14.00
    }
  },
  {
    id: 'coca-cola-zero',
    name: 'Coca-Cola Zero',
    type: 'soda',
    image: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=600&auto=format&fit=crop&q=80',
    prices: {
      'Lata 350ml': 6.00,
      '600ml': 8.00,
      '1 Litro': 11.00,
      '2 Litros': 14.00
    }
  },
  {
    id: 'guarana-antarctica',
    name: 'Guaraná Antarctica',
    type: 'soda',
    image: 'https://lh3.googleusercontent.com/d/13iW6KGOqrKfBJArJ72FnmQMiPVfISJOH',
    prices: {
      'Lata 350ml': 6.00,
      '600ml': 8.00,
      '1 Litro': 11.00,
      '2 Litros': 14.00
    }
  },
  {
    id: 'fanta-laranja',
    name: 'Fanta Laranja',
    type: 'soda',
    image: 'https://lh3.googleusercontent.com/d/1_Tb7yPgeBx97lORkbpC7DvyZZ1psAfM1',
    prices: {
      'Lata 350ml': 6.00,
      '600ml': 8.00,
      '2 Litros': 14.00
    }
  },
  {
    id: 'sprite',
    name: 'Sprite',
    type: 'soda',
    image: 'https://lh3.googleusercontent.com/d/10mzbwknNmjwQaE57vbDhGkWH5DjgTBrM',
    prices: {
      'Lata 350ml': 6.00,
      '600ml': 8.00,
      '2 Litros': 14.00
    }
  },
  {
    id: 'pepsi',
    name: 'Pepsi',
    type: 'soda',
    image: 'https://lh3.googleusercontent.com/d/1stC_9RwVBsc2W-k9HbaMrULsMoIEGSs1',
    prices: {
      'Lata 350ml': 6.00,
      '2 Litros': 14.00
    }
  }
];
