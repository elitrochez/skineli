/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export const SKIN_TYPES = [
  { id: 'seca', label: 'Piel Seca', desc: 'Sientes tirantez, descamación o aspecto opaco. Requiere hidratación profunda y restauración de barrera.' },
  { id: 'grasa', label: 'Piel Grasa', desc: 'Brillo constante, poros dilatados o tendencia a granitos. Requiere texturas ligeras y seborreguladores.' },
  { id: 'mixta', label: 'Piel Mixta', desc: 'Zona T grasa (frente, nariz, barbilla) y mejillas normales o secas. Requiere balance inteligente.' },
  { id: 'sensible', label: 'Piel Sensible', desc: 'Enrojecimiento, picor o reacción rápida a productos. Requiere fórmulas minimalistas para calmar la barrera.' }
] as const;

export const SKIN_CONCERNS = [
  { id: 'acne', label: 'Acné y Poros Impuros', icon: 'Sparkles' },
  { id: 'manchas', label: 'Manchas e Hiperpigmentación', icon: 'Sun' },
  { id: 'envejecimiento', label: 'Líneas Finas y Arrugas', icon: 'TrendingUp' },
  { id: 'deshidratacion', label: 'Deshidratación y Opacidad', icon: 'Droplets' },
  { id: 'luminosidad', label: 'Falta de Luminosidad / Tono Apagado', icon: 'Moon' }
] as const;

export const ROUTINE_STEPS_INFO = {
  1: {
    num: 1,
    name: 'Limpiar',
    title: 'Limpiar Impurezas',
    desc: 'Elimina el exceso de grasa, sudor, bacterias, células muertas y residuos acumulados. Es la base indispensable para recibir el tratamiento posterior.',
    importance: 'Evita la obstrucción de poros y prepara la barrera cutánea sin dañarla.'
  },
  2: {
    num: 2,
    name: 'Tratar',
    title: 'Tratar con un Sérum',
    desc: 'Sérums ultraconcentrados con ingredientes activos que penetran profundamente en la piel para corregir preocupaciones específicas del cutis.',
    importance: 'Fórmulas cargadas de activos como Vitamina C, Ácido Hialurónico, Ácido Salicílico o Niacinamide.'
  },
  3: {
    num: 3,
    name: 'Hidratar',
    title: 'Nutrir e Hidratar',
    desc: 'Retiene el agua en la epidermis y sella los nutrientes de los pasos anteriores. Crea una barrera física protectora frente a agresiones externas.',
    importance: 'Evita la pérdida transepidérmica de agua y mantiene la piel elástica.'
  },
  4: {
    num: 4,
    name: 'Proteger',
    title: 'Aplicar Protector Solar',
    desc: 'El paso indiscutible más vital. Protege la piel de los rayos ultravioleta (UVA y UVB), culpables del 80% de los signos de envejecimiento, manchas y cáncer de piel.',
    importance: 'Evita el fotodaño, previniendo machas y preservando el colágeno del cutis.'
  }
} as const;

export const PRODUCTS: Product[] = [
  // PASO 1: LIMPIADORES
  {
    id: 'prod_cleanse_salicylic',
    brand: 'Dermacare Lab',
    name: 'Glicolic Wash Gel Limpiador Seborregulador',
    step: 1,
    stepName: 'Limpiar',
    description: 'Gel purificante espumoso con ácido salicílico al 1.5% y extracto de té verde. Limpia profundamente los poros, controla el exceso de grasa y combate puntos negros sin resecar la piel.',
    price: 24.00,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
    skinType: ['grasa', 'mixta'],
    concern: ['acne', 'deshidratacion'],
    ingredients: ['Ácido Salicílico (1.5%)', 'Extracto de Té Verde', 'Pantenol (B5)', 'Glicerina'],
    volume: '150ml',
    rating: 4.8,
    isPopular: true
  },
  {
    id: 'prod_cleanse_hydrating',
    brand: 'Ceramide Essentials',
    name: 'Hydra-Calm Emulsión Limpiadora Humectante',
    step: 1,
    stepName: 'Limpiar',
    description: 'Fórmula hidratante en loción no espumosa con 3 ceramidas esenciales, ácido hialurónico y avena coloidal. Ideal para limpiar impurezas respetando la barrera cutánea más delicada o seca.',
    price: 22.50,
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600',
    skinType: ['seca', 'sensible'],
    concern: ['deshidratacion', 'manchas'],
    ingredients: ['3 Ceramidas Esenciales', 'Ácido Hialurónico', 'Avena Coloidal', 'Niacinamida'],
    volume: '200ml',
    rating: 4.9
  },
  {
    id: 'prod_cleanse_micellar',
    brand: 'Pure Botanical',
    name: 'Balm-to-Milk Bálsamo de Limpieza Profunda',
    step: 1,
    stepName: 'Limpiar',
    description: 'Bálsamo a base de aceites botánicos ligeros que se funde con el maquillaje y filtros solares, transformándose en leche al contacto con el agua. Limpieza perfecta sin tirantez.',
    price: 26.00,
    imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600',
    skinType: ['seca', 'grasa', 'mixta', 'sensible'],
    concern: ['deshidratacion', 'luminosidad'],
    ingredients: ['Aceite de Almendras Dulces', 'Vitamina E', 'Extracto de Manzanilla'],
    volume: '100g',
    rating: 4.7
  },

  // PASO 2: SÉRUMS (TRATAR)
  {
    id: 'prod_treat_vitc',
    brand: 'C-Radiance Lab',
    name: 'Vitamina C + Silicio Activo Serum Iluminador',
    step: 2,
    stepName: 'Tratar',
    description: 'Sérum antioxidante de alta potencia con un 15% de Vitamina C Pura (Ácido L-Ascórbico) estabilizada con Ácido Ferúlico. Desvanece manchas oscuras y aporta una luminosidad deslumbrante al cutis apagado.',
    price: 38.00,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
    skinType: ['seca', 'grasa', 'mixta'],
    concern: ['manchas', 'luminosidad', 'envejecimiento'],
    ingredients: ['Vitamina C Pura (15%)', 'Ácido Ferúlico (0.5%)', 'Vitamina E (1%)', 'Extracto de Ginkgo Biloba'],
    volume: '30ml',
    rating: 4.9,
    isPopular: true
  },
  {
    id: 'prod_treat_hyaluronic',
    brand: 'Plump Skin',
    name: 'Super-Plump Ácido Hialurónico Multipeso',
    step: 2,
    stepName: 'Tratar',
    description: 'Sérum hidratante de triple peso molecular concentrado al 2.5%. Infunde agua en múltiples niveles celulares para rellenar arrugas de deshidratación y dejar un acabado terso y "jugoso".',
    price: 32.00,
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=600',
    skinType: ['seca', 'grasa', 'mixta', 'sensible'],
    concern: ['deshidratacion', 'envejecimiento'],
    ingredients: ['Ácido Hialurónico (Alto, Medio y Bajo peso molec.)', 'Pro-Vitamina B5', 'Madecasósido (Calmante)'],
    volume: '30ml',
    rating: 4.8
  },
  {
    id: 'prod_treat_niacinamide',
    brand: 'Dermacare Lab',
    name: 'Niacinamida 10% + Zinc PCA Sérum Perfeccionador',
    step: 2,
    stepName: 'Tratar',
    description: 'Formulado para equilibrar la producción de sebo, minimizar el diámetro de los poros abiertos y calmar rojeces. Excelente para mitigar marcas de brotes pasados y unificar la textura de la tez.',
    price: 29.00,
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600',
    skinType: ['grasa', 'mixta', 'sensible'],
    concern: ['acne', 'manchas', 'luminosidad'],
    ingredients: ['Niacinamida (10%)', 'Zinc PCA (1%)', 'Alantoína', 'Agua de Rosas Orgánica'],
    volume: '30ml',
    rating: 4.7
  },
  {
    id: 'prod_treat_retinol',
    brand: 'Aethel Clinic',
    name: 'Retinol Youth Renewal Serum 0.3%',
    step: 2,
    stepName: 'Tratar',
    description: 'Sérum reparador nocturno con un 0.3% de retinol puro encapsulado en liposomas para minimizar la irritación. Acelera la renovación celular cutánea, reduce arrugas profundas y estimula el colágeno natural.',
    price: 45.00,
    imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600',
    skinType: ['seca', 'grasa', 'mixta'],
    concern: ['envejecimiento', 'manchas'],
    ingredients: ['Retinol Encapsulado (0.3%)', 'Escualano Vegetal', 'Bisabolol (Anti-irritaciones)', 'Péptidos de Cobre'],
    volume: '30ml',
    rating: 4.6
  },

  // PASO 3: HIDRATANTES
  {
    id: 'prod_hydrate_gelcream',
    brand: 'Plump Skin',
    name: 'Aqua-Light Hydro-Gel Equivalente de Agua',
    step: 3,
    stepName: 'Hidratar',
    description: 'Hidratante ultraligera de rápida absorción en gel-crema. Absorbe instantáneamente sin engrasar los poros, ofreciendo hidratación equilibrada por 72 horas continuas.',
    price: 34.00,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
    skinType: ['grasa', 'mixta'],
    concern: ['deshidratacion', 'acne'],
    ingredients: ['Glicoproteínas Antárticas', 'Extracto de Aloe Vera', 'Ácido Hialurónico', 'Extracto de Pepino'],
    volume: '50ml',
    rating: 4.8,
    isPopular: true
  },
  {
    id: 'prod_hydrate_cream',
    brand: 'Ceramide Essentials',
    name: 'Barrier-Restore Crema Rica de Nutrición Profunda',
    step: 3,
    stepName: 'Hidratar',
    description: 'Crema reparadora sumamente rica, enriquecida con 5 fitoceramidas, fitoesfingosinas y manteca de karité pura. Diseñada para sanar las pieles deshidratadas o altamente sensibilizadas por factores climáticos.',
    price: 36.00,
    imageUrl: 'https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?auto=format&fit=crop&q=80&w=600',
    skinType: ['seca', 'sensible'],
    concern: ['deshidratacion', 'envejecimiento'],
    ingredients: ['5 Ceramidas Esenciales', 'Ácidos Grasos Libres', 'Manteca de Karité', 'Escualano'],
    volume: '50ml',
    rating: 4.9
  },

  // PASO 4: PROTECTOR SOLAR
  {
    id: 'prod_protect_matte',
    brand: 'Sun Defense Pro',
    name: 'Invisible Fluid FPS 50+ Efecto Mate',
    step: 4,
    stepName: 'Proteger',
    description: 'Protector solar fluido de amplio espectro diario, ultraligero y 100% invisible en cualquier tono de piel. Ofrece acabado de control de grasa seco mate al tacto y previene manchas.',
    price: 28.50,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600',
    skinType: ['grasa', 'mixta'],
    concern: ['manchas', 'acne', 'luminosidad'],
    ingredients: ['Filtros Orgánicos UVA/UVB', 'Silíce Absorbedor de Sebo', 'Extracto de Regaliz (Anti-manchas)', 'Vitamina E'],
    volume: '50ml',
    rating: 4.9,
    isPopular: true
  },
  {
    id: 'prod_protect_glow',
    brand: 'Sun Defense Pro',
    name: 'Barrier Shield FPS 50+ Hidratante Glow',
    step: 4,
    stepName: 'Proteger',
    description: 'Protector solar fusionado con crema de día antioxidante. No comedogénico, brinda protección celular intensa dejando un aspecto juvenil, fresco, luminoso y radiantemente saludable ("dewy glow").',
    price: 29.90,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600',
    skinType: ['seca', 'sensible'],
    concern: ['manchas', 'deshidratacion', 'envejecimiento'],
    ingredients: ['Extracto de Centella Asiática', 'Ácido Hialurónico', 'Niacinamida (3%)', 'Filtros Minerales Premium'],
    volume: '50ml',
    rating: 4.8
  },
  // ACCESORIOS
  {
    id: 'prod_acc_roller',
    brand: 'Dermacare Tools',
    name: 'Roller Facial de Cuarzo Rosa Natural',
    category: 'accesorios',
    description: 'Herramienta de masaje facial fabricada con cuarzo rosa 100% natural. Ayuda a reducir la hinchazón, promover el drenaje linfático, mejorar la circulación y facilitar la absorción de sérums.',
    price: 18.00,
    imageUrl: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=600',
    skinType: ['seca', 'grasa', 'mixta', 'sensible'],
    concern: ['envejecimiento', 'luminosidad'],
    ingredients: ['Cuarzo Rosa Natural Tallado a Mano'],
    volume: '1 unidad',
    rating: 4.8,
    isPopular: true
  },
  {
    id: 'prod_acc_pads',
    brand: 'Eco Beauty',
    name: 'Discos Desmaquillantes Reutilizables de Bambú',
    category: 'accesorios',
    description: 'Pack de 10 discos de algodón y fibra de bambú súper suaves, lavables y reutilizables. Incluye una bolsa de malla para lavado. Perfectos para limpiar impurezas de manera ecológica.',
    price: 12.50,
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600',
    skinType: ['seca', 'grasa', 'mixta', 'sensible'],
    concern: ['deshidratacion'],
    ingredients: ['70% Fibra de Bambú Orgánica', '30% Algodón'],
    volume: '10 unidades',
    rating: 4.7
  },
  {
    id: 'prod_acc_band',
    brand: 'Dermacare Accessories',
    name: 'Banda Elástica de Spa para Cabello Bunny',
    category: 'accesorios',
    description: 'Banda de microfibra ultrasuave para retirar el cabello del rostro durante tu rutina de limpieza o aplicación de mascarillas. Elástica y cómoda, apta para todo tamaño.',
    price: 7.90,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600',
    skinType: ['seca', 'grasa', 'mixta', 'sensible'],
    concern: [],
    ingredients: ['Microfibra de Poliéster'],
    volume: '1 unidad',
    rating: 4.9
  },
  // KITS
  {
    id: 'prod_kit_basic',
    brand: 'SkinEli Essentials',
    name: 'Kit Rutina Esencial Hidratación y Calma',
    category: 'kits',
    description: 'El kit perfecto para empezar tu rutina diaria. Incluye Emulsión Limpiadora Humectante (200ml), Crema Rica de Nutrición Profunda (50ml) y Protector Solar Glow (50ml). Ahorra un 15% comprándolos juntos.',
    price: 75.00,
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600',
    skinType: ['seca', 'sensible'],
    concern: ['deshidratacion', 'luminosidad'],
    ingredients: ['Ceramidas Esenciales', 'Ácido Hialurónico', 'Centella Asiática'],
    volume: '3 productos',
    rating: 4.9,
    isPopular: true
  },
  {
    id: 'prod_kit_acne',
    brand: 'SkinEli Clinical',
    name: 'Kit Tratamiento Antiacné y Poros Limpios',
    category: 'kits',
    description: 'Rutina concentrada de dos pasos para controlar el brillo y combatir brotes. Contiene el Gel Limpiador Glicolic Wash (150ml) y el Sérum Perfeccionador de Niacinamida 10% (30ml).',
    price: 46.00,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
    skinType: ['grasa', 'mixta'],
    concern: ['acne', 'manchas'],
    ingredients: ['Ácido Salicílico (1.5%)', 'Niacinamida (10%)', 'Zinc PCA (1%)'],
    volume: '2 productos',
    rating: 4.8
  }
];
