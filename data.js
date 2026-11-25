// Datos verificados de los 3 viajes de referencia + catálogo del Sudeste Asiático
const DESTINATIONS = {
  dubai: {
    id: 'dubai', name: 'Dubái', country: 'Emiratos Árabes', iata: 'DXB',
    lat: 25.2048, lng: 55.2708, category: 'hub', isHub: true,
    recommendedNights: '2 noches (stopover)',
    avgHotelNight: 120, avgDailyCouple: 160,
    bestMonths: [11, 12, 1, 2, 3],
    tagline: 'Escala estratégica de Emirates para partir el vuelo de 30+ hs desde Ezeiza',
    description: 'Ideal si volás con Emirates desde Buenos Aires (vía Río de Janeiro): cortás el jet-lag a mitad de camino con 2 noches de desierto, Burj Khalifa y ciudad futurista.',
    highlights: ['Excursión en 4x4 por el desierto y cena', 'Burj Khalifa y Dubai Mall', 'Dubai Marina y casco histórico Al Fahidi'],
    tips: 'Al sacar con Emirates muchas veces el stopover en Dubái no encarece el pasaje a Bangkok.'
  },
  singapore: {
    id: 'singapore', name: 'Singapur', country: 'Singapur', iata: 'SIN',
    lat: 1.3521, lng: 103.8198, category: 'hub', isHub: true,
    recommendedNights: '2 noches',
    avgHotelNight: 155, avgDailyCouple: 210,
    bestMonths: [2, 3, 4, 5, 6, 7, 8, 9],
    tagline: 'Puerta de entrada futurista y súper fácil para arrancar sin shock cultural',
    description: 'Ciudad-estado impecable, segura, moderna y verde. Excelente puerta de entrada al Sudeste si vas a Bali/Indonesia porque está a solo 2h40 de vuelo directo de Denpasar.',
    highlights: ['Gardens by the Bay (Cloud Forest, Flower Dome y show nocturno)', 'Marina Bay Sands & Merlion', 'Hawker centers (Lau Pa Sat) + Chinatown y Little India', 'Isla Sentosa / Acuario'],
    tips: 'Es la ciudad más cara del viaje (hoteles chicos ~USD 140-180/noche). Llenar la SG Arrival Card online gratuita 3 días antes.'
  },
  ubud: {
    id: 'ubud', name: 'Ubud (Bali)', country: 'Indonesia', iata: 'DPS',
    lat: -8.5069, lng: 115.2625, category: 'culture', isHub: true,
    recommendedNights: '3–4 noches',
    avgHotelNight: 105, avgDailyCouple: 180,
    bestMonths: [5, 6, 7, 8, 9, 10],
    tagline: 'Corazón espiritual y selvático de Bali: arrozales, cascadas, templos y villas',
    description: 'La base favorita de los viajeros en Bali. Mezcla selva tropical, terrazas de arroz, templos hinduistas, cafés increíbles y villas con pileta infinita a precios muy razonables.',
    highlights: ['Terrazas de arroz Tegallalang y Cretya', 'Templos Tirta Empul, Besakih, Pura Kehen y Goa Gajah', 'Cascadas Kanto Lampo y Tibumana', 'Monkey Forest, masajes balineses y villas en la selva'],
    tips: 'Contratar guía/chofer privado por día cuesta ~USD 60-75 y te resuelve el tráfico de Bali. ¡Dejá las valijas grandes en locker antes de ir a las islas Gili/Penida!'
  },
  gili_air: {
    id: 'gili_air', name: 'Gili Air / Gili Meno', country: 'Indonesia', iata: 'DPS',
    lat: -8.3578, lng: 116.0823, category: 'beach', isHub: false,
    recommendedNights: '3 noches',
    avgHotelNight: 70, avgDailyCouple: 120,
    bestMonths: [5, 6, 7, 8, 9, 10],
    tagline: 'Islitas paradisíacas sin autos ni motos: bici, tortugas y atardeceres',
    description: 'Tres islas coralinas frente a Lombok (Gili Trawangan es fiesta, Gili Air es el equilibrio perfecto chill/pareja y Gili Meno es calma absoluta). No circulan autos ni motos: todo a pie o en bici.',
    highlights: ['Snorkel con tortugas marinas y estatuas submarinas de Gili Meno', 'Recorrer toda la isla en bici al atardecer', 'Restaurantes sobre la arena (Italy Pizzeria, Kopi Susu, Sand)'],
    tips: 'El fast boat sale desde Padangbai (~2 hs desde Ubud). Llevá mochila o carry-on liviano para subir cómodo al barco.'
  },
  nusa_penida: {
    id: 'nusa_penida', name: 'Nusa Penida', country: 'Indonesia', iata: 'DPS',
    lat: -8.7275, lng: 115.5444, category: 'beach', isHub: false,
    recommendedNights: '2 noches',
    avgHotelNight: 75, avgDailyCouple: 100,
    bestMonths: [5, 6, 7, 8, 9, 10],
    tagline: 'Acantilados épicos de postal y aguas turquesa a 45 min de Bali',
    description: 'Isla escénica al sur de Bali famosa por miradores dramáticos sobre el océano. Quedarse 2 noches (en vez de ir y volver en el día) permite recorrer Este y Oeste sin correr.',
    highlights: ['Diamond Beach y Atuh Beach (lado Este)', 'Kelingking Beach ("el T-Rex") y Broken Beach (lado Oeste)', 'Tree House (Rumah Pohon) y snorkel con mantarrayas'],
    tips: 'Los caminos internos son angostos y empinados: si no tenés mucha cancha en moto, conviene contratar chofer/guía local (~USD 65/día).'
  },
  langkawi: {
    id: 'langkawi', name: 'Langkawi (tránsito)', country: 'Malasia', iata: 'LGK',
    lat: 6.3500, lng: 99.8000, category: 'beach', isHub: false,
    recommendedNights: '0–1 noche (conexión)',
    avgHotelNight: 80, avgDailyCouple: 90,
    bestMonths: [12, 1, 2, 3, 4],
    tagline: 'El atajo secreto para conectar Bali/Singapur con Koh Lipe en 90 min de ferry',
    description: 'Isla malaya justo frente a Koh Lipe. Juani y Cande la usaron como puente súper inteligente: volaron directo desde Bali/KL a Langkawi y al día siguiente cruzaron en ferry a Koh Lipe (con migraciones en la playa).',
    highlights: ['Ferry directo internacional a Koh Lipe (noviembre a abril)', 'Puente SkyBridge y teleférico si hacés noche'],
    tips: 'El ferry Langkawi ↔ Koh Lipe opera en temporada seca (aprox. nov a abril/mayo).'
  },
  bangkok: {
    id: 'bangkok', name: 'Bangkok', country: 'Tailandia', iata: 'BKK',
    lat: 13.7563, lng: 100.5018, category: 'hub', isHub: true,
    recommendedNights: '3 noches',
    avgHotelNight: 95, avgDailyCouple: 180,
    bestMonths: [11, 12, 1, 2, 3],
    tagline: 'La gran capital vibrante del Sudeste: templos dorados, street food, rooftops y compras',
    description: 'Caótica, fascinante e inolvidable. Es EL hub aéreo principal del Sudeste Asiático desde Argentina. Conviene dejarla para el final si querés hacer compras (MBK, Don Don Donki, Chinatown) antes de volver a casa.',
    highlights: ['Gran Palacio, Wat Pho (Buda Reclinado) y Wat Arun al atardecer', 'Paseo en barco por el río Chao Phraya', 'Chinatown (Yaowarat), Khao San Road y Lumphini Park', 'Skybars en terrazas (Lebua / Mahanakhon) y mercados flotantes'],
    tips: 'Ojo: Bangkok tiene DOS aeropuertos — BKK (Suvarnabhumi, vuelos internacionales) y DMK (Don Mueang, vuelos low-cost como AirAsia). ¡Chequear siempre al conectar!'
  },
  kanchanaburi: {
    id: 'kanchanaburi', name: 'Kanchanaburi / Río Kwai', country: 'Tailandia', iata: 'BKK',
    lat: 14.0228, lng: 99.5328, category: 'culture', isHub: false,
    recommendedNights: '1–2 noches',
    avgHotelNight: 200, avgDailyCouple: 110,
    bestMonths: [11, 12, 1, 2, 3],
    tagline: 'Villas flotantes en la selva, historia de la 2da Guerra y mercados flotantes',
    description: 'A ~3 hs al oeste de Bangkok. Cande y Diego durmieron en villas flotantes de madera sobre el río Kwai combinándolo con el mercado flotante Damnoen Saduak y el histórico tren del Death Railway.',
    highlights: ['Dormir en villas flotantes (The FloatHouse River Kwai)', 'Mercado flotante Damnoen Saduak en camino', 'Puente sobre el río Kwai, Hellfire Pass y tren por la selva'],
    tips: 'Gran escapada de 2 días / 1 noche saliendo y volviendo a Bangkok.'
  },
  chiang_mai: {
    id: 'chiang_mai', name: 'Chiang Mai & Chiang Rai', country: 'Tailandia', iata: 'CNX',
    lat: 18.7883, lng: 98.9853, category: 'culture', isHub: false,
    recommendedNights: '3–4 noches',
    avgHotelNight: 100, avgDailyCouple: 110,
    bestMonths: [11, 12, 1, 2],
    tagline: 'Norte de Tailandia: templos mágicos, santuarios éticos de elefantes y cocina thai',
    description: 'Mucho más tranquila y verde que Bangkok. Es la capital cultural del norte: mercados nocturnos, cafeterías hermosas, clases de cocina orgánica y excursión a Chiang Rai (Templo Blanco y Templo Azul).',
    highlights: ['Templo Blanco (Wat Rong Khun), Templo Azul y Casa Negra en Chiang Rai', 'Santuario ético de elefantes (sin montar: Elephant Nature Park / Kanta)', 'Clase de cocina tailandesa (Grandma’s Home Cooking Class)', 'Templo Doi Suthep y Night Bazaar'],
    tips: 'Ojo entre fines de febrero y abril con la "burning season" (quema agrícola que genera humo en el norte). Mejor clima: nov–feb.'
  },
  krabi: {
    id: 'krabi', name: 'Krabi / Ao Nang / Railay', country: 'Tailandia', iata: 'KBV',
    lat: 8.0322, lng: 98.8235, category: 'beach', isHub: false,
    recommendedNights: '1–3 noches',
    avgHotelNight: 85, avgDailyCouple: 100,
    bestMonths: [11, 12, 1, 2, 3, 4],
    tagline: 'Puerta de entrada a las playas del Mar de Andamán y la península de Railay',
    description: 'Aeropuerto súper práctico (KBV) para bajar desde Bangkok o Chiang Mai rumbo a Phi Phi y Koh Lipe. Railay Beach (solo accesible en bote) tiene acantilados calizos espectaculares.',
    highlights: ['Railay Beach y Phra Nang Cave Beach', 'Tour de las 4 Islas o Hong Islands', 'Base perfecta para tomar el ferry a Phi Phi'],
    tips: 'Tom y Vero hicieron 1 noche en Ao Nang para cortar el vuelo y salir tranquilos en ferry a Phi Phi a la mañana siguiente.'
  },
  phi_phi: {
    id: 'phi_phi', name: 'Koh Phi Phi', country: 'Tailandia', iata: 'HKT',
    lat: 7.7407, lng: 98.7784, category: 'beach', isHub: false,
    recommendedNights: '2–3 noches',
    avgHotelNight: 125, avgDailyCouple: 145,
    bestMonths: [11, 12, 1, 2, 3, 4],
    tagline: 'Las postales icónicas de Tailandia: Maya Bay, Pileh Lagoon y acantilados esmeralda',
    description: 'Archipiélago icónico del Mar de Andamán. Tiene vida nocturna y ambiente joven en Tonsai Village, pero lo mejor es salir bien temprano en long-tail boat hacia Maya Bay y Pileh Lagoon antes de las multitudes.',
    highlights: ['Excursión en bote a Maya Bay, Pileh Lagoon, Viking Cave y Bamboo Island', 'Mirador Phi Phi Viewpoint al atardecer', 'Snorkel con tiburones punta negra y shows de fuego en la playa'],
    tips: 'Tour recomendado por Tom y Vero: "Phi Phi Latinos" (~USD 115 pareja). Elegí hotel un poco alejado de los bares de la playa para dormir bien.'
  },
  koh_lipe: {
    id: 'koh_lipe', name: 'Koh Lipe', country: 'Tailandia', iata: 'HDY',
    lat: 6.4910, lng: 99.3033, category: 'beach', isHub: false,
    recommendedNights: '3–4 noches',
    avgHotelNight: 125, avgDailyCouple: 130,
    bestMonths: [11, 12, 1, 2, 3, 4],
    tagline: 'Las "Maldivas de Tailandia": arena blanca talco, agua cristalina y relax total',
    description: 'La joya más al sur de Tailandia (cerca de Malasia). Es pequeña, caminable, con tres playas increíbles (Sunrise, Sunset y Pattaya Beach) y la mejor agua transparente del viaje según casi todos los que van.',
    highlights: ['Sunrise Beach y kayak hacia islotes vecinos (Koh Adang)', 'Atardecer en Zodiac Beach Bar / Sunset Beach', 'Snorkel en el Parque Nacional Tarutao y Walking Street por la noche'],
    tips: 'Se llega por ferry desde Phi Phi (~4 hs), desde Langkawi (1.5 hs) o desde el muelle Pak Bara + transfer al aeropuerto de Hat Yai (HDY) para volar a Bangkok.'
  },
  phuket: {
    id: 'phuket', name: 'Phuket (conexión)', country: 'Tailandia', iata: 'HKT',
    lat: 7.8804, lng: 98.3923, category: 'hub', isHub: true,
    recommendedNights: '0–2 noches',
    avgHotelNight: 95, avgDailyCouple: 120,
    bestMonths: [11, 12, 1, 2, 3, 4],
    tagline: 'Gran aeropuerto del sur tailandés con vuelos directos a Vietnam, Singapur y Bangkok',
    description: 'La isla más grande de Tailandia. Más urbana y con tráfico que Lipe o Railay, pero su aeropuerto internacional (HKT) es un comodín brutal para saltar directo de las islas del sur hacia Vietnam o Singapur sin volver a Bangkok.',
    highlights: ['Casco antiguo Phuket Old Town', 'Conexión directa de ferries con Phi Phi y vuelos regionales (HKT → Hanoi / Singapur / Bali)'],
    tips: 'Juani y Cande tomaron ferry Phi Phi → Phuket y volaron directo a Hanoi el mismo día.'
  },
  koh_samui: {
    id: 'koh_samui', name: 'Koh Samui / Koh Tao (Opcional Invierno AR)', country: 'Tailandia', iata: 'USM',
    lat: 9.5120, lng: 100.0136, category: 'beach', isHub: false,
    recommendedNights: '3–5 noches',
    avgHotelNight: 110, avgDailyCouple: 125,
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    tagline: 'Plan B clave si viajás entre mayo y septiembre (cuando llueve en Phi Phi/Lipe)',
    description: 'Islas del Golfo de Tailandia. Aunque las 3 parejas fueron en verano/otoño argentino (época del Mar de Andamán), si tu viaje cae entre mayo y septiembre, esta costa tiene sol pleno y mar calmo.',
    highlights: ['Buceo y snorkel de primer nivel en Koh Tao y Koh Nang Yuan', 'Playas y beach clubs en Koh Samui y Koh Phangan', 'Parque Nacional Marino Ang Thong'],
    tips: '¡No te olvides de esta opción si planeás viajar en vacaciones de invierno argentinas (junio–agosto)!'
  },
  hanoi: {
    id: 'hanoi', name: 'Hanoi', country: 'Vietnam', iata: 'HAN',
    lat: 21.0285, lng: 105.8542, category: 'hub', isHub: true,
    recommendedNights: '2–3 noches',
    avgHotelNight: 70, avgDailyCouple: 135,
    bestMonths: [10, 11, 12, 2, 3, 4],
    tagline: 'Caos encantador, café con huevo, Train Street, compras baratas y base a Ha Long Bay',
    description: 'Capital milenaria de Vietnam. Las 3 parejas pasaron por acá! Calles angostas llenas de motitos en el Old Quarter, gastronomía espectacular (pho, banh mi, bun cha), arquitectura colonial francesa y compras baratísimas de ropa técnica/camperas.',
    highlights: ['Old Quarter, Lago Hoan Kiem y Catedral San José', 'Train Street (tomar algo mientras pasa el tren a centímetros)', 'Templo de la Literatura, Prisión Hoa Lo y Mausoleo Ho Chi Minh', 'Tour nocturno en Vespa Vintage y compras de camperas/valijas'],
    tips: 'Tom y Vero hicieron base en Hanoi y dejaron equipaje para ir 1 noche a Ha Long Bay. ¡Acordate de tramitar la e-Visa de Vietnam online al menos 10 días antes!'
  },
  halong_bay: {
    id: 'halong_bay', name: 'Ha Long Bay / Lan Ha Bay', country: 'Vietnam', iata: 'HAN',
    lat: 20.9101, lng: 107.1839, category: 'culture', isHub: false,
    recommendedNights: '1–2 noches (crucero)',
    avgHotelNight: 320, avgDailyCouple: 60,
    bestMonths: [10, 11, 12, 3, 4, 5],
    tagline: 'Dormir en un crucero boutique entre miles de islotes kársticos esmeralda',
    description: 'Una de las 7 Maravillas Naturales del Mundo — las 3 parejas la hicieron y nadie se la saltea! Se llega en 2.5 hs por ruta desde Hanoi y se duerme embarcado con pensión completa, kayak y cuevas.',
    highlights: ['Navegar Lan Ha Bay (menos barcos que Ha Long central)', 'Kayak entre montañas de piedra caliza y cuevas en Cat Ba', 'Atardecer en cubierta, clase de spring rolls y Tai Chi al amanecer'],
    tips: '1 noche alcanza perfecto para probar la experiencia (Tom y Vero con Majesty Luxury USD 315; Cande y Diego con Mon Chéri). Juani y Cande hicieron 2 noches (Doris Cruise).'
  },
  hoi_an: {
    id: 'hoi_an', name: 'Hoi An & Da Nang', country: 'Vietnam', iata: 'DAD',
    lat: 15.8801, lng: 108.3380, category: 'culture', isHub: false,
    recommendedNights: '2–3 noches',
    avgHotelNight: 110, avgDailyCouple: 110,
    bestMonths: [2, 3, 4, 5, 6, 7, 8],
    tagline: 'El pueblo de los farolitos de colores, sastrería a medida y playa tranquila',
    description: 'Uno de los pueblos más fotogénicos de Asia, en el centro de Vietnam (a 45 min del aeropuerto de Da Nang). Casco antiguo peatonal Patrimonio UNESCO iluminado de noche por miles de faroles sobre el río.',
    highlights: ['Paseo nocturno por el casco histórico iluminado con farolitos', 'Bicicleta por aldeas rurales y botes cesta de bambú', 'Playa An Bang y hacerse trajes/vestidos a medida en 24 hs'],
    tips: 'Desde Da Nang (DAD) hay vuelos directos a Siem Reap (Angkor Wat), Hanoi y Ho Chi Minh.'
  },
  ho_chi_minh: {
    id: 'ho_chi_minh', name: 'Ho Chi Minh (Saigón)', country: 'Vietnam', iata: 'SGN',
    lat: 10.8231, lng: 106.6297, category: 'hub', isHub: true,
    recommendedNights: '2 noches',
    avgHotelNight: 115, avgDailyCouple: 130,
    bestMonths: [12, 1, 2, 3, 4],
    tagline: 'Metrópoli eléctrica del sur de Vietnam, historia de guerra y rooftop bars',
    description: 'Antigua Saigón: moderna, cosmopolita, intensa y con una escena gastronómica y cervecera increíble. Base para visitar los Túneles de Cu Chi, el Delta del Mekong o volar a playas del sur como Con Dao o Phu Quoc.',
    highlights: ['Túneles de Cu Chi (guerra de Vietnam)', 'Tour nocturno de street food, craft beer y speakeasies', 'Museo de los Vestigios de la Guerra y Mercado Ben Thanh'],
    tips: 'También funciona como excelente aeropuerto internacional de salida/entrada (SGN).'
  },
  con_dao: {
    id: 'con_dao', name: 'Isla Con Dao', country: 'Vietnam', iata: 'VCS',
    lat: 8.6830, lng: 106.6060, category: 'beach', isHub: false,
    recommendedNights: '3–4 noches',
    avgHotelNight: 450, avgDailyCouple: 150,
    bestMonths: [3, 4, 5, 6, 7, 8],
    tagline: 'Archipiélago virgen y exclusivo en el sur de Vietnam (playa ultra relax)',
    description: 'A 55 min de vuelo desde Ho Chi Minh. Parque nacional y marino súper preservado, sin turismo masivo. Cande y Diego cerraron la parte de playa acá en el Six Senses Con Dao.',
    highlights: ['Playas vírgenes de arena dorada y parque marino', 'Snorkel, tortugas marinas y relax total en resort boutique'],
    tips: 'Alternativa más económica en Vietnam sur: isla Phu Quoc.'
  },
  luang_prabang: {
    id: 'luang_prabang', name: 'Luang Prabang', country: 'Laos', iata: 'LPQ',
    lat: 19.8833, lng: 102.1347, category: 'culture', isHub: false,
    recommendedNights: '2–3 noches',
    avgHotelNight: 120, avgDailyCouple: 95,
    bestMonths: [11, 12, 1, 2, 3],
    tagline: 'Joya serena UNESCO sobre el río Mekong, monjes al amanecer y cascadas turquesa',
    description: 'Ciudad colonial francesa + templos budistas dorados rodeada de montañas. Un ritmo de vida súper pausado que contrasta hermoso con Bangkok o Hanoi.',
    highlights: ['Cascadas Kuang Si (agua turquesa increíble para nadar)', 'Templos Wat Xieng Thong, Palacio Real y atardecer en Monte Phousi', 'Mercado nocturno artesanal y navegación por el Mekong'],
    tips: 'Vuelo directo de solo 50 minutos desde Chiang Mai (CNX) y 1h10 hacia Hanoi (HAN).'
  },
  nong_khiaw: {
    id: 'nong_khiaw', name: 'Nong Khiaw & Muang Ngoi', country: 'Laos', iata: 'LPQ',
    lat: 20.5736, lng: 102.6152, category: 'culture', isHub: false,
    recommendedNights: '2 noches',
    avgHotelNight: 120, avgDailyCouple: 70,
    bestMonths: [11, 12, 1, 2, 3],
    tagline: 'Laos profundo: montañas kársticas dramáticas, aldeas textiles y río Nam Ou',
    description: 'A 4 hs al norte de Luang Prabang. Un paraíso escondido fuera del circuito masivo: navegar en bote por el río Nam Ou entre picos verticales y visitar aldeas tradicionales Tai Lue.',
    highlights: ['Navegación por el río Nam Ou hacia Muang Ngoi y Ban Sopjam', 'Aldea tradicional Tai Lue (tejidos a mano)', 'Miradores panorámicos y desconexión total'],
    tips: 'Ideal si buscás naturaleza auténtica y cero multitudes.'
  },
  siem_reap: {
    id: 'siem_reap', name: 'Siem Reap (Angkor Wat)', country: 'Camboya', iata: 'SAI',
    lat: 13.3671, lng: 103.8448, category: 'culture', isHub: false,
    recommendedNights: '2–3 noches',
    avgHotelNight: 105, avgDailyCouple: 110,
    bestMonths: [11, 12, 1, 2, 3],
    tagline: 'El complejo de templos más impresionante del planeta: Angkor Wat y Ta Prohm',
    description: 'Uno de los grandes imperdibles culturales del mundo. Ruinas del Imperio Jemer devoradas por árboles gigantes en medio de la selva. Además Siem Reap tiene hoteles increíbles muy accesibles y gran gastronomía.',
    highlights: ['Amanecer frente a Angkor Wat', 'Ta Prohm (templo de los árboles gigantes / Tomb Raider)', 'Angkor Thom y los 216 rostros de piedra del templo Bayon', 'Tour nocturno en tuk-tuk de comida Khmer (Road 60)'],
    tips: 'El nuevo aeropuerto (SAI) está a ~1h15 del centro. Se usa dólar estadounidense en todos lados.'
  },
  hong_kong: {
    id: 'hong_kong', name: 'Hong Kong', country: 'Hong Kong', iata: 'HKG',
    lat: 22.3193, lng: 114.1694, category: 'hub', isHub: true,
    recommendedNights: '2–3 noches',
    avgHotelNight: 175, avgDailyCouple: 185,
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    tagline: 'Skyline cinematográfico, dim sum, rascacielos y cierre cosmopolita ideal',
    description: 'Metrópoli electrizante mezcla de oriente y herencia británica. Excelente aeropuerto internacional de salida (HKG) para volver a Argentina después de recorrer Indochina.',
    highlights: ['Victoria Peak y ferry Star Ferry sobre la bahía', 'Mercados nocturnos de Kowloon y barrio Soho/Central', 'Dim sum, templos urbanos y Gran Buda de Lantau'],
    tips: 'Sin visa para pasaporte argentino (hasta 90 días) y sin vacunas obligatorias. Sacar tarjeta Octopus para moverse.'
  }
};

const TRIPS = {
  tom_vero: {
    id: 'tom_vero',
    name: 'Tom y Vero',
    shortName: 'Tom y Vero',
    color: '#ea580c',
    badgeClass: 'badge-tom',
    dates: '20 Feb – 22 Mar 2026',
    monthLabel: 'Feb–Mar (Temporada seca Tailandia/Vietnam)',
    nightsInAsia: 26,
    totalDaysDoorToDoor: 30,
    style: 'Independiente (DIY) · Mix Islas + Bali + Norte Vietnam + Ciudades',
    intlFlight: {
      type: 'Multidestino (Open-Jaw)',
      airline: 'Qatar Airways',
      outbound: 'EZE → GRU → DOH → SIN (Singapur)',
      inbound: 'BKK (Bangkok) → DOH → GRU → EZE',
      entryHub: 'SIN',
      exitHub: 'BKK',
      whyItWorked: '¡Súper eficiente! Entraron por Singapur (a un paso de Bali) y salieron por Bangkok (donde terminaron haciendo compras). Cero vuelos desperdiciados volviendo al inicio.'
    },
    countries: ['Singapur', 'Indonesia', 'Vietnam', 'Tailandia'],
    summary: 'El viaje más equilibrado entre ciudades top, selva de Bali, 4 islas paradisíacas (Gili Air, Nusa Penida, Phi Phi, Koh Lipe) y la pincelada perfecta de Vietnam (Hanoi + crucero Ha Long Bay). Además documentaron CADA gasto real peso por peso.',
    totalCostKnown: 'USD 8.902 pareja en destino (Hoteles $2.813 + Traslados internos $1.513 + Gasto diario/tours/compras $4.576 · sin vuelo internacional)',
    stops: [
      {
        destId: 'singapore', dates: '22–24 Feb', nights: 2,
        hotel: 'Citadines Rochor Singapore', hotelUsd: 308,
        activities: ['Gardens by the Bay (Cloud Forest, Flower Dome y Skywalk)', 'Acuario de Sentosa', 'Lau Pa Sat hawker center', 'Bicis Hello Ride'],
        nextLeg: { mode: 'flight', detail: 'Singapore Airlines · SIN → DPS (2h40)', costUsd: 401 }
      },
      {
        destId: 'ubud', dates: '24–28 Feb', nights: 4,
        hotel: 'Weda Cita Resort (2n · $190) + Villa Cinta (2n · $343)', hotelUsd: 533,
        activities: ['Tegallalang Rice Terrace + tirolesa y Cretya', 'Templos Tirta Empul, Besakih, Pura Kehen, Goa Gajah y Villa Penglipuran', 'Cascadas Kanto Lampo y Tibumana con guías privados (Ariana y Made)', 'Monkey Forest, masajes y lockers de valijas ($121) antes de ir a las islas'],
        nextLeg: { mode: 'ferry', detail: 'Taxi a Padangbai + Ferry Wijaya Buyuk → Gili Air (2h30)', costUsd: 32 }
      },
      {
        destId: 'gili_air', dates: '28 Feb–3 Mar', nights: 3,
        hotel: 'The Koho Air', hotelUsd: 178,
        activities: ['Excursión bote snorkel a Gili Meno', 'Playa, bicis y relax total', 'Italy Pizzeria, Kopi Susu, Mama Pizza y anillos en Silver Corner'],
        nextLeg: { mode: 'ferry', detail: 'Ferry Wijaya Buyuk · Gili Air → Nusa Penida (1h50)', costUsd: 36 }
      },
      {
        destId: 'nusa_penida', dates: '3–5 Mar', nights: 2,
        hotel: 'Mambo Beach Resort', hotelUsd: 146,
        activities: ['Moto + Guía privado por la isla', 'Diamond Beach, House Tree (Rumah Pohon) y Amarta'],
        nextLeg: { mode: 'flight', detail: 'Ferry a Bali ($18) + Vuelo VietJet Air DPS → HAN (4h10)', costUsd: 333 }
      },
      {
        destId: 'hanoi', dates: '5–8 Mar (+9–10 Mar)', nights: 4,
        hotel: 'Airbnb Old Quarter (3n $164 + 1n $65)', hotelUsd: 229,
        activities: ['Prisión Hoa Lo, Templo de la Literatura, The Note Cafe', 'Train Street (cervezas junto a las vías)', 'Spa y compras fuertes de camperas, mochilas y carteras'],
        nextLeg: { mode: 'land', detail: 'Combi ida y vuelta al crucero Ha Long Bay (2h30)', costUsd: 75 }
      },
      {
        destId: 'halong_bay', dates: '8–9 Mar', nights: 1,
        hotel: 'Majesty Luxury Prime Cruises (5★ all-inclusive)', hotelUsd: 315,
        activities: ['Crucero 2 días / 1 noche por la bahía', 'Kayak, comidas a bordo y atardecer en cubierta'],
        nextLeg: { mode: 'flight', detail: 'Vietnam Airlines HAN → BKK ($210) + AirAsia BKK → KBV ($131) + locker valijas BKK ($38)', costUsd: 340 }
      },
      {
        destId: 'krabi', dates: '10–11 Mar', nights: 1,
        hotel: 'Mini House Aonang Hotel', hotelUsd: 84,
        activities: ['Noche estratégica en Ao Nang para cortar el traslado', 'Show de fuego en la playa'],
        nextLeg: { mode: 'ferry', detail: 'Ferry 12Go · Krabi → Koh Phi Phi', costUsd: 57 }
      },
      {
        destId: 'phi_phi', dates: '11–14 Mar', nights: 3,
        hotel: 'Panmanee Hotel', hotelUsd: 386,
        activities: ['Tour Phi Phi Latinos ($115 pareja)', 'Mirador Viewpoint', 'Freedom Bar y playa'],
        nextLeg: { mode: 'ferry', detail: 'Ferry 12Go · Koh Phi Phi → Koh Lipe', costUsd: 152 }
      },
      {
        destId: 'koh_lipe', dates: '14–17 Mar', nights: 3,
        hotel: 'The Chic Lipe', hotelUsd: 353,
        activities: ['Kayak y snorkel', 'Sunset Beach y Zodiac Beach Bar', 'Cena en Elephant y Bulow'],
        nextLeg: { mode: 'flight', detail: 'Ferry a Pak Bara ($46) + taxi Hat Yai + AirAsia HDY → DMK ($116)', costUsd: 162 }
      },
      {
        destId: 'bangkok', dates: '17–20 Mar', nights: 3,
        hotel: 'Airbnb Central Nordic Style River', hotelUsd: 280,
        activities: ['Gran Palacio, Wat Pho (Buda Reclinado), Wat Arun y Big Buddha', 'Lumphini Park, Chinatown, Khao San Road', 'Compras en Don Don Donki + cierre en Skybar ($91)'],
        nextLeg: null
      }
    ]
  },

  juani_cande: {
    id: 'juani_cande',
    name: 'Juani y Cande',
    shortName: 'Juani y Cande',
    color: '#0284c7',
    badgeClass: 'badge-juani',
    dates: '15 Dic 2023 – 12 Ene 2024',
    monthLabel: 'Dic–Ene (Navidad y Año Nuevo)',
    nightsInAsia: 26,
    totalDaysDoorToDoor: 28,
    style: 'Independiente · Emirates + Stopover Dubái + Islas + Norte Vietnam',
    intlFlight: {
      type: 'Ida y Vuelta mismo aeropuerto + Stopover',
      airline: 'Emirates',
      outbound: 'EZE → DXB (2 noches Dubái) → BKK (Bangkok)',
      inbound: 'BKK (Bangkok) → DXB → GIG → EZE',
      entryHub: 'BKK',
      exitHub: 'BKK',
      whyItWorked: 'Sacaron ida y vuelta a Bangkok con Emirates y aprovecharon 2 noches en Dubái. Al llegar a BKK durmieron 1 noche junto al aeropuerto y volaron al toque a Singapur para hacer el circuito y dejar Bangkok para el final.'
    },
    countries: ['Emiratos Árabes', 'Singapur', 'Indonesia', 'Malasia (paso)', 'Tailandia', 'Vietnam'],
    summary: 'Muy parecido al mix de destinos de Tom y Vero (de hecho Tom y Vero se inspiraron en ellos!), pero sumando Dubái al principio, usando el atajo Bali → Langkawi → Koh Lipe, y pasando Año Nuevo en Koh Lipe + 2 noches de crucero en Ha Long Bay.',
    totalCostKnown: 'Referencia parcial en Excel: Traslados internos ~USD 1.734+ · Hoteles ~USD 1.600+ (sin incluir todos los hoteles de Phi Phi/BKK)',
    stops: [
      {
        destId: 'dubai', dates: '16–19 Dic', nights: 2,
        hotel: 'Arabian Park Dubai by Rotana', hotelUsd: null,
        activities: ['Excursión al desierto', 'Recorrido por Dubái'],
        nextLeg: { mode: 'flight', detail: 'Emirates · DXB → BKK (tránsito 1 noche en The Cottage Suvarnabhumi $27) + BKK → SIN', costUsd: 701 }
      },
      {
        destId: 'singapore', dates: '20–21 Dic', nights: 1,
        hotel: 'Victoria Hotel, a NuVe Group Collection', hotelUsd: 105,
        activities: ['Recorrido express de 2 días por Singapur'],
        nextLeg: { mode: 'flight', detail: 'Singapore Airlines · SIN → DPS (incluido en ticket combinado BKK-SIN-DPS)', costUsd: null }
      },
      {
        destId: 'ubud', dates: '22–25 Dic', nights: 3,
        hotel: 'Arumasta Ubud', hotelUsd: 132,
        activities: ['Selva, templos y Navidad en Ubud'],
        nextLeg: { mode: 'ferry', detail: 'Ferry desde Bali → Islas Gili', costUsd: null }
      },
      {
        destId: 'gili_air', dates: '25–28 Dic', nights: 3,
        hotel: 'The Koho Air (Gili Air / Meno)', hotelUsd: 350,
        activities: ['Playa, snorkel y relax post-Navidad'],
        nextLeg: { mode: 'flight', detail: 'Ferry a Bali + Vuelo nocturno DPS → Langkawi (Malasia)', costUsd: 317 }
      },
      {
        destId: 'langkawi', dates: '28–29 Dic', nights: 0,
        hotel: 'Conexión nocturna / aeropuerto', hotelUsd: null,
        activities: ['Atajo directo hacia Tailandia sur'],
        nextLeg: { mode: 'ferry', detail: 'Ferry matutino Langkawi → Koh Lipe (~2 hs)', costUsd: null }
      },
      {
        destId: 'koh_lipe', dates: '29 Dic–2 Ene', nights: 4,
        hotel: 'Bella Vista Beach Resort (2n $225) + Sita Beach Resort (2n)', hotelUsd: 225,
        activities: ['¡Año Nuevo en las playas de Koh Lipe!', 'Snorkel y relax total'],
        nextLeg: { mode: 'ferry', detail: 'Ferry Koh Lipe → Koh Phi Phi', costUsd: null }
      },
      {
        destId: 'phi_phi', dates: '2–4 Ene', nights: 2,
        hotel: 'Koh Phi Phi', hotelUsd: null,
        activities: ['Excursión de islas (Maya Bay / lagunas)'],
        nextLeg: { mode: 'flight', detail: 'Ferry a Phuket + AirAsia HKT → HAN (con escala)', costUsd: 530 }
      },
      {
        destId: 'hanoi', dates: '4–5 Ene (+7–9 Ene)', nights: 3,
        hotel: 'Babylon Premium Hotel & Spa', hotelUsd: 100,
        activities: ['Old Quarter, cultura y gastronomía en Hanoi'],
        nextLeg: { mode: 'land', detail: 'Transfer a Ha Long Bay', costUsd: null }
      },
      {
        destId: 'halong_bay', dates: '5–7 Ene', nights: 2,
        hotel: 'Doris Cruise (2 noches)', hotelUsd: 588,
        activities: ['Crucero extendido 3 días / 2 noches por Ha Long / Lan Ha Bay'],
        nextLeg: { mode: 'flight', detail: 'AirAsia · HAN → Bangkok DMK', costUsd: 186 }
      },
      {
        destId: 'bangkok', dates: '9–11 Ene', nights: 2,
        hotel: 'Bangkok (vuelo regreso 12 Ene 01:05 AM)', hotelUsd: null,
        activities: ['Templos, ciudad y compras antes de volver a EZE'],
        nextLeg: null
      }
    ]
  },

  cande_diego: {
    id: 'cande_diego',
    name: 'Cande y Diego',
    shortName: 'Cande y Diego',
    color: '#059669',
    badgeClass: 'badge-cande',
    dates: '19 Mar – 19 Abr 2026',
    monthLabel: 'Mar–Abr (Indochina + Hong Kong)',
    nightsInAsia: 28,
    totalDaysDoorToDoor: 31,
    style: 'Agencia Boutique (Cartology Travel) · 100% Indochina Cultural + Playa Lujo + HK',
    intlFlight: {
      type: 'Multidestino (Open-Jaw)',
      airline: 'Aéreo internacional abierto BKK / HKG',
      outbound: 'EZE → BKK (Bangkok Suvarnabhumi)',
      inbound: 'HKG (Hong Kong) → EZE',
      entryHub: 'BKK',
      exitHub: 'HKG',
      whyItWorked: 'Línea geográfica impecable de oeste a este: Tailandia → Laos → Vietnam Norte → Centro → Camboya → Vietnam Sur → Isla Con Dao → Hong Kong. Sin retroceder nunca y con hoteles boutique/5★.'
    },
    countries: ['Tailandia', 'Laos', 'Vietnam', 'Camboya', 'Hong Kong'],
    summary: 'Un viaje RADICALMENTE distinto a los otros dos: cero Indonesia y cero islas de Tailandia. Profundiza en cultura, historia y naturaleza continental (Norte de Tailandia, Laos profundo, Vietnam completo, Angkor Wat en Camboya), 4 noches de playa ultra-lujo en Con Dao y cierre en Hong Kong.',
    totalCostKnown: 'Viaje armado a medida con agencia boutique (Cartology Travel / Trails of Indochina), traslados y guías privados, hoteles 4★/5★ y Six Senses Con Dao.',
    stops: [
      {
        destId: 'bangkok', dates: '21–23 Mar (+24–25 Mar)', nights: 3,
        hotel: 'Ariyasom Villa Boutique Hotel', hotelUsd: null,
        activities: ['Tour privado Wat Pho, Gran Palacio y Wat Arun en ferry local', 'Base para ida y vuelta al Río Kwai'],
        nextLeg: { mode: 'land', detail: 'Transfer privado + Mercado Flotante Damnoen Saduak → Kanchanaburi', costUsd: null }
      },
      {
        destId: 'kanchanaburi', dates: '23–24 Mar', nights: 1,
        hotel: 'The FloatHouse River Kwai (Floating Villa)', hotelUsd: null,
        activities: ['Puente sobre el río Kwai, Museo y Cementerio 2da Guerra', 'Tren histórico Death Railway y Hellfire Pass'],
        nextLeg: { mode: 'flight', detail: 'Regreso a BKK + Vuelo VZ130 BKK → Chiang Rai (CEI) + ruta terrestre a Chiang Mai', costUsd: null }
      },
      {
        destId: 'chiang_mai', dates: '25–28 Mar', nights: 3,
        hotel: 'Bodhi Serene Chiang Mai', hotelUsd: null,
        activities: ['Chiang Rai en ruta: Casa Negra (Baan Dam), Templo Azul y Templo Blanco', 'Clase de cocina en Grandma’s Home Cooking Class', 'Kanta Elephant Sanctuary (tarde con elefantes)'],
        nextLeg: { mode: 'flight', detail: 'Lao Airlines QV636 · CNX → Luang Prabang (50 min)', costUsd: null }
      },
      {
        destId: 'luang_prabang', dates: '28–30 Mar', nights: 2,
        hotel: 'Le Bel Air Resort', hotelUsd: null,
        activities: ['Cascadas Kuang Si y centro textil Ock Pop Tock', 'Palacio Real, Wat Visoun, Wat Xieng Thong y atardecer en Monte Phousi'],
        nextLeg: { mode: 'land', detail: 'Auto 4h30 por el río Nam Ou + aldea Tai Lue Ban Nayang → Nong Khiaw', costUsd: null }
      },
      {
        destId: 'nong_khiaw', dates: '30 Mar–1 Abr', nights: 2,
        hotel: 'Maison de Nong Khiaw (Nature Suites Riverside)', hotelUsd: null,
        activities: ['Navegación por el río Nam Ou a Muang Ngoi y aldea Ban Sopjam', 'Cueva refugio histórico, arrozales y montañas kársticas'],
        nextLeg: { mode: 'flight', detail: 'Auto a LPQ + Lao Airlines QV313 LPQ → Hanoi (1h10)', costUsd: null }
      },
      {
        destId: 'hanoi', dates: '1–3 Abr', nights: 2,
        hotel: 'La Sinfonía del Rey Hotel & Spa', hotelUsd: null,
        activities: ['Mausoleo Ho Chi Minh, Pagoda Un Pilar y Templo de la Literatura', 'Tour nocturno "Hanoi after dark" en Vespa Vintage + Train Street + live music'],
        nextLeg: { mode: 'land', detail: 'Auto con guía a Tuan Chau Marina (2h30)', costUsd: null }
      },
      {
        destId: 'halong_bay', dates: '3–4 Abr', nights: 1,
        hotel: 'Mon Chéri Cruise (Ocean Suite Balcony)', hotelUsd: null,
        activities: ['Navegación por Lan Ha Bay y kayak en Tra Bau', 'Clase de spring rolls, Tai Chi al amanecer y Cueva Trung Trang (Cat Ba)'],
        nextLeg: { mode: 'flight', detail: 'Transfer aeropuerto + Vietnam Airlines VN179 HAN → Da Nang (1h25)', costUsd: null }
      },
      {
        destId: 'hoi_an', dates: '4–6 Abr', nights: 2,
        hotel: 'Boutique Hoi An Resort (en la playa)', hotelUsd: null,
        activities: ['Barco por el río Thu Bon + 10 km en bici por aldea Tra Nhieu', 'Botes cesta de bambú en bosque de cocoteros + casco antiguo'],
        nextLeg: { mode: 'flight', detail: 'Air Cambodia K6841 · Da Nang (DAD) → Siem Reap (SAI) (1h55)', costUsd: null }
      },
      {
        destId: 'siem_reap', dates: '6–9 Abr', nights: 3,
        hotel: 'Anjali by Syphon', hotelUsd: null,
        activities: ['Amanecer en Angkor Wat, Banteay Kdei, Ta Prohm, Angkor Thom (Bayon) y bote al atardecer', 'Tour nocturno gastronómico en Tuk-Tuk por Road 60 + cervezas artesanales'],
        nextLeg: { mode: 'flight', detail: 'Air Cambodia K6824 · SAI → Ho Chi Minh (SGN) (1h10)', costUsd: null }
      },
      {
        destId: 'ho_chi_minh', dates: '9–11 Abr', nights: 2,
        hotel: 'Liberty Central Saigon Riverside', hotelUsd: null,
        activities: ['Tour nocturno "Saigon Flavourful Journey" (banh mi, mariscos, craft beer y speakeasy)', 'Excursión matutina a los Túneles de Cu Chi'],
        nextLeg: { mode: 'flight', detail: 'Vietnam Airlines VN1885 · SGN → Con Dao (VCS) (55 min)', costUsd: null }
      },
      {
        destId: 'con_dao', dates: '11–15 Abr', nights: 4,
        hotel: 'Six Senses Con Dao (Ocean View Duplex Pool Villa)', hotelUsd: null,
        activities: ['4 noches de playa paradisíaca y parque marino protegido', 'Afternoon tea frente al mar y desconexión total'],
        nextLeg: { mode: 'flight', detail: 'Vietnam Airlines VCS → SGN (Fast-track transit) + VN594 SGN → Hong Kong (2h50)', costUsd: null }
      },
      {
        destId: 'hong_kong', dates: '15–18 Abr', nights: 3,
        hotel: 'Novotel Century Hong Kong', hotelUsd: null,
        activities: ['3 días libres en Hong Kong (Wan Chai, Victoria Peak, Kowloon, compras y gastronomía)'],
        nextLeg: null
      }
    ]
  }
};

const REAL_BUDGET_TOM_VERO = {
  totalDestinationUsd: 8902.03,
  nights: 26,
  days: 27,
  hotelsUsd: 2812.79,
  avgHotelPerNight: 108.18,
  transfersUsd: 1512.74,
  dailySpendUsd: 4576.50,
  avgDailySpendCouple: 169.50,
  byPlaceDaily: [
    { place: 'Ubud (4d · guías + locker + visa + entradas)', usd: 887 },
    { place: 'Bangkok (3d · templos + Don Donki + compras + Skybar)', usd: 886 },
    { place: 'Hanoi (4d · compras fuertes de camperas/ropa + tours)', usd: 795 },
    { place: 'Singapur (2.5d · Sentosa + Gardens by the Bay + comidas)', usd: 517 },
    { place: 'Gili Air (3d · snorkel + restaurantes + anillos)', usd: 398 },
    { place: 'Koh Lipe (3d · comidas + kayak + playa)', usd: 376 },
    { place: 'Koh Phi Phi (3d · Tour Phi Phi Latinos + bares)', usd: 332 },
    { place: 'Nusa Penida (2d · guía + moto + entradas)', usd: 175 },
    { place: 'Bali tránsito aeropuerto', usd: 82 },
    { place: 'Ha Long Bay (combi al barco)', usd: 80 },
    { place: 'Ao Nang / Krabi (1 noche)', usd: 49 }
  ],
  transfersList: [
    { route: 'Singapur → Bali (DPS)', mode: 'Avión', company: 'Singapore Airlines', usd: 401 },
    { route: 'Bali (DPS) → Hanoi (HAN)', mode: 'Avión', company: 'VietJet Air', usd: 315 },
    { route: 'Hanoi → Bangkok', mode: 'Avión', company: 'Vietnam Airlines', usd: 210 },
    { route: 'Phi Phi → Koh Lipe', mode: 'Ferry', company: '12Go', usd: 152 },
    { route: 'Bangkok → Krabi', mode: 'Avión', company: 'AirAsia', usd: 131 },
    { route: 'Hat Yai → Bangkok (DMK)', mode: 'Avión', company: 'AirAsia', usd: 116 },
    { route: 'Krabi → Phi Phi', mode: 'Ferry', company: '12Go', usd: 57 },
    { route: 'Koh Lipe → Pak Bara', mode: 'Ferry', company: '12Go', usd: 46 },
    { route: 'Gili Air → Nusa Penida', mode: 'Ferry', company: 'Wijaya Buyuk', usd: 36 },
    { route: 'Ubud/Padangbai → Gili Air', mode: 'Ferry', company: 'Wijaya Buyuk', usd: 32 },
    { route: 'Nusa Penida → Bali', mode: 'Ferry', company: 'Wijaya Buyuk', usd: 18 }
  ]
};

const HOTELS_CATALOG = [
  {
    "city": "Ubud",
    "name": "Villa Cinta Ubud",
    "stars": "4.0",
    "rating": 9.1,
    "m2": null,
    "breakfast": "NO",
    "priceNight": 172,
    "comment": "Villa privada con pileta (2 últimas noches en Ubud)",
    "source": "Tom y Vero",
    "chosenBy": "Elegido Tom y Vero"
  },
  {
    "city": "Hanoi",
    "name": "Airbnb Old Quarter (Vero / Tom)",
    "stars": "-",
    "rating": null,
    "m2": null,
    "breakfast": "NO",
    "priceNight": 57,
    "comment": "USD 55–65/noche, excelente relación precio/calidad",
    "source": "Tom y Vero",
    "chosenBy": "Elegido Tom y Vero"
  },
  {
    "city": "Krabi / Ao Nang",
    "name": "Mini House Aonang Hotel",
    "stars": "3.0",
    "rating": 8.6,
    "m2": null,
    "breakfast": "NO",
    "priceNight": 84,
    "comment": "1 noche de paso estratégica antes del ferry a Phi Phi",
    "source": "Tom y Vero",
    "chosenBy": "Elegido Tom y Vero"
  },
  {
    "city": "Bangkok",
    "name": "Airbnb Central Nordic Style River",
    "stars": "-",
    "rating": null,
    "m2": null,
    "breakfast": "NO",
    "priceNight": 93,
    "comment": "3 noches sobre el río, súper cómodo",
    "source": "Tom y Vero",
    "chosenBy": "Elegido Tom y Vero"
  },
  {
    "city": "Ubud",
    "name": "Arumasta Ubud",
    "stars": "3.0",
    "rating": 9.0,
    "m2": null,
    "breakfast": "SI",
    "priceNight": 44,
    "comment": "USD 132 total por 3 noches",
    "source": "Juani y Cande",
    "chosenBy": "Elegido Juani y Cande"
  },
  {
    "city": "Koh Lipe",
    "name": "Bella Vista Beach Resort",
    "stars": "3.5",
    "rating": 8.4,
    "m2": null,
    "breakfast": "SI",
    "priceNight": 113,
    "comment": "Sobre Pattaya Beach, USD 225 por 2 noches",
    "source": "Juani y Cande",
    "chosenBy": "Elegido Juani y Cande"
  },
  {
    "city": "Dubái",
    "name": "Arabian Park Dubai by Rotana",
    "stars": "3.5",
    "rating": 8.2,
    "m2": null,
    "breakfast": "NO",
    "priceNight": 95,
    "comment": "Stopover Emirates 2 noches",
    "source": "Juani y Cande",
    "chosenBy": "Elegido Juani y Cande"
  },
  {
    "city": "Bangkok",
    "name": "Ariyasom Villa Boutique Hotel",
    "stars": "4.5",
    "rating": 9.3,
    "m2": null,
    "breakfast": "SI",
    "priceNight": 180,
    "comment": "Villa tailandesa restaurada de los años 40 en Sukhumvit Soi 1 (restaurante veg/seafood)",
    "source": "Cande y Diego",
    "chosenBy": "Elegido Cande y Diego"
  },
  {
    "city": "Kanchanaburi",
    "name": "The FloatHouse River Kwai",
    "stars": "4.5",
    "rating": 9.2,
    "m2": 90,
    "breakfast": "SI",
    "priceNight": 260,
    "comment": "Villas flotantes de madera de teca sobre el río Kwai, acceso en long-tail boat",
    "source": "Cande y Diego",
    "chosenBy": "Elegido Cande y Diego"
  },
  {
    "city": "Chiang Mai",
    "name": "Bodhi Serene Chiang Mai",
    "stars": "4.0",
    "rating": 8.9,
    "m2": null,
    "breakfast": "SI",
    "priceNight": 135,
    "comment": "Hotel boutique tranquilo dentro de la ciudad amurallada (Old City)",
    "source": "Cande y Diego",
    "chosenBy": "Elegido Cande y Diego"
  },
  {
    "city": "Luang Prabang",
    "name": "Le Bel Air Resort",
    "stars": "4.0",
    "rating": 9.0,
    "m2": null,
    "breakfast": "SI",
    "priceNight": 150,
    "comment": "Estilo colonial a orillas del río Nam Khan, pileta infinita",
    "source": "Cande y Diego",
    "chosenBy": "Elegido Cande y Diego"
  },
  {
    "city": "Nong Khiaw",
    "name": "Maison de Nong Khiaw (Nature Suites)",
    "stars": "4.0",
    "rating": 9.4,
    "m2": null,
    "breakfast": "SI",
    "priceNight": 170,
    "comment": "Bungalows de lujo frente a montañas kársticas y el río Nam Ou",
    "source": "Cande y Diego",
    "chosenBy": "Elegido Cande y Diego"
  },
  {
    "city": "Hanoi",
    "name": "La Sinfonía del Rey Hotel & Spa",
    "stars": "4.5",
    "rating": 9.5,
    "m2": null,
    "breakfast": "SI",
    "priceNight": 145,
    "comment": "Boutique top a pasos del Lago Hoan Kiem con skybar panorámico",
    "source": "Cande y Diego",
    "chosenBy": "Elegido Cande y Diego"
  },
  {
    "city": "Ha Long Bay",
    "name": "Mon Chéri Cruise (Lan Ha Bay)",
    "stars": "5.0",
    "rating": 9.5,
    "m2": 35,
    "breakfast": "SI",
    "priceNight": 380,
    "comment": "Navega por Lan Ha Bay (menos turistas), Ocean Suite con balcón, all-inclusive",
    "source": "Cande y Diego",
    "chosenBy": "Elegido Cande y Diego"
  },
  {
    "city": "Hoi An",
    "name": "Boutique Hoi An Resort",
    "stars": "4.5",
    "rating": 9.1,
    "m2": null,
    "breakfast": "SI",
    "priceNight": 165,
    "comment": "Directo sobre la playa An Bang, cerca del casco antiguo de farolitos",
    "source": "Cande y Diego",
    "chosenBy": "Elegido Cande y Diego"
  },
  {
    "city": "Siem Reap",
    "name": "Anjali by Syphon",
    "stars": "4.5",
    "rating": 9.4,
    "m2": null,
    "breakfast": "SI",
    "priceNight": 155,
    "comment": "Oasis boutique de 29 habitaciones a 10 min del centro y cerca de Angkor Wat",
    "source": "Cande y Diego",
    "chosenBy": "Elegido Cande y Diego"
  },
  {
    "city": "Ho Chi Minh",
    "name": "Liberty Central Saigon Riverside",
    "stars": "4.5",
    "rating": 8.8,
    "m2": null,
    "breakfast": "SI",
    "priceNight": 135,
    "comment": "District 1 frente al río Saigón con pileta rooftop y sky bar",
    "source": "Cande y Diego",
    "chosenBy": "Elegido Cande y Diego"
  },
  {
    "city": "Con Dao",
    "name": "Six Senses Con Dao",
    "stars": "5.0",
    "rating": 9.6,
    "m2": 194,
    "breakfast": "SI",
    "priceNight": 950,
    "comment": "Ultra lujo en parque marino protegido · Ocean View Duplex Pool Villa",
    "source": "Cande y Diego",
    "chosenBy": "Elegido Cande y Diego"
  },
  {
    "city": "Hong Kong",
    "name": "Novotel Century Hong Kong",
    "stars": "4.0",
    "rating": 8.4,
    "m2": null,
    "breakfast": "NO",
    "priceNight": 175,
    "comment": "Muy buena ubicación en Wan Chai",
    "source": "Cande y Diego",
    "chosenBy": "Elegido Cande y Diego"
  },
  {
    "city": "Singapur",
    "name": "Hotel Boss",
    "stars": "4.0",
    "rating": 7.2,
    "m2": 14,
    "breakfast": "NO",
    "priceNight": 122.0,
    "comment": "Habitación muy chica",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Hotel mi rochor",
    "stars": "4.0",
    "rating": 8.1,
    "m2": 15,
    "breakfast": "NO",
    "priceNight": 148.0,
    "comment": "Buena ubicación",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Hotel Traveltime downtown",
    "stars": "4.0",
    "rating": 7.7,
    "m2": 19,
    "breakfast": "NO",
    "priceNight": 154.0,
    "comment": "Buena ubicación, chico  el cuarto y olor a humedad",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Dhotel singapur",
    "stars": "4.0",
    "rating": 8.3,
    "m2": 27,
    "breakfast": "NO",
    "priceNight": 157.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Citadines Rochor",
    "stars": "4.0",
    "rating": 8.5,
    "m2": 20,
    "breakfast": "NO",
    "priceNight": 161.0,
    "comment": "",
    "source": "Investigación Tom y Vero",
    "chosenBy": "Elegido Tom y Vero (USD 154/n)"
  },
  {
    "city": "Singapur",
    "name": "Village Hotel Bugis by far",
    "stars": "4.0",
    "rating": 7.8,
    "m2": 32,
    "breakfast": "NO",
    "priceNight": 161.0,
    "comment": "Bien ubicado, medio viejo",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Ibis singapure on bencoolen",
    "stars": "4.0",
    "rating": 8.2,
    "m2": 18,
    "breakfast": "NO",
    "priceNight": 163.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Yotel singapore orchard",
    "stars": "4.0",
    "rating": 8.3,
    "m2": 14,
    "breakfast": "NO",
    "priceNight": 167.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Hotel mi Bencoolen",
    "stars": "4.0",
    "rating": 8.0,
    "m2": 17,
    "breakfast": "NO",
    "priceNight": 177.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Victoria hotel a nu ve",
    "stars": "3.0",
    "rating": 7.8,
    "m2": 23,
    "breakfast": "NO",
    "priceNight": 180.0,
    "comment": "Donde fueron los chicos",
    "source": "Investigación Tom y Vero",
    "chosenBy": "Elegido Juani y Cande (USD 105/n)"
  },
  {
    "city": "Singapur",
    "name": "Dorsett singapore",
    "stars": "4.0",
    "rating": 7.8,
    "m2": 22,
    "breakfast": "NO",
    "priceNight": 185.0,
    "comment": "Centrico, en chinatown",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Aloft singapore novena",
    "stars": "4.0",
    "rating": 8.8,
    "m2": 18,
    "breakfast": "SI",
    "priceNight": 187.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Furama city",
    "stars": "4.0",
    "rating": 7.4,
    "m2": 28,
    "breakfast": "NO",
    "priceNight": 191.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Citadines connect city",
    "stars": "4.0",
    "rating": 8.6,
    "m2": 18,
    "breakfast": "NO",
    "priceNight": 200.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Mondrian singapore",
    "stars": "5.0",
    "rating": 8.7,
    "m2": 22,
    "breakfast": "NO",
    "priceNight": 222.0,
    "comment": "Buenos comentarios, cuarto chico",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Park regis",
    "stars": "4.0",
    "rating": 8.6,
    "m2": 20,
    "breakfast": "SI",
    "priceNight": 222.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Mercure ICON",
    "stars": "4.0",
    "rating": 8.0,
    "m2": 15,
    "breakfast": "NO",
    "priceNight": 228.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Oasia hotel",
    "stars": "4.0",
    "rating": 8.8,
    "m2": 23,
    "breakfast": "NO",
    "priceNight": 237.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "M hotel",
    "stars": "5.0",
    "rating": 8.1,
    "m2": 30,
    "breakfast": "NO",
    "priceNight": 261.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "Holiday Inn",
    "stars": "4.0",
    "rating": 8.5,
    "m2": 18,
    "breakfast": "SI",
    "priceNight": 305.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Singapur",
    "name": "QT singapore",
    "stars": "5.0",
    "rating": 8.9,
    "m2": 23,
    "breakfast": "NO",
    "priceNight": 370.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ubud",
    "name": "Cahaya Guest House",
    "stars": "",
    "rating": 9.3,
    "m2": 24,
    "breakfast": "SI",
    "priceNight": 24.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ubud",
    "name": "Ubud mesari",
    "stars": "4.0",
    "rating": 9.9,
    "m2": 56,
    "breakfast": "SI",
    "priceNight": 54.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ubud",
    "name": "Villa Sawah Ramah",
    "stars": "4.0",
    "rating": 9.4,
    "m2": 35,
    "breakfast": "NO",
    "priceNight": 36.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ubud",
    "name": "Gedong Batu villas",
    "stars": "4.0",
    "rating": 9.7,
    "m2": 66,
    "breakfast": "SI",
    "priceNight": 47.0,
    "comment": "Muy lejos del centro",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ubud",
    "name": "Gunung Gelagah",
    "stars": "4.0",
    "rating": 9.2,
    "m2": 35,
    "breakfast": "NO",
    "priceNight": 55.0,
    "comment": "Muy lejos del centro",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ubud",
    "name": "Queen at gunung sari",
    "stars": "3.0",
    "rating": 8.6,
    "m2": 9,
    "breakfast": "NO",
    "priceNight": 72.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ubud",
    "name": "Weda Cita resort",
    "stars": "5.0",
    "rating": 9.2,
    "m2": 42,
    "breakfast": "SI",
    "priceNight": 78.0,
    "comment": "Puede ser 3 noches",
    "source": "Investigación Tom y Vero",
    "chosenBy": "Elegido Tom y Vero (USD 95/n · 2n)"
  },
  {
    "city": "Ubud",
    "name": "Bucu view resort",
    "stars": "4.0",
    "rating": 8.8,
    "m2": 40,
    "breakfast": "SI",
    "priceNight": 88.0,
    "comment": "Lindo cuarto con pileta + caro",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ubud",
    "name": "Arkamara dijiwa",
    "stars": "5.0",
    "rating": 9.3,
    "m2": 53,
    "breakfast": "SI",
    "priceNight": 108.0,
    "comment": "Divino",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ubud",
    "name": "The hava Ubud",
    "stars": "5.0",
    "rating": 9.1,
    "m2": 36,
    "breakfast": "SI",
    "priceNight": 125.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ubud",
    "name": "Adiwana Unagi Suites",
    "stars": "5.0",
    "rating": 9.4,
    "m2": 50,
    "breakfast": "SI",
    "priceNight": 190.0,
    "comment": "Donde fueron una noche los chicos",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "Lagom Guest house",
    "stars": "2.0",
    "rating": 8.7,
    "m2": 24,
    "breakfast": "NO",
    "priceNight": 18.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "Nanas homestay",
    "stars": "2.0",
    "rating": 9.0,
    "m2": 22,
    "breakfast": "NO",
    "priceNight": 34.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "Villa Tahid",
    "stars": "3.0",
    "rating": 9.5,
    "m2": 20,
    "breakfast": "SI",
    "priceNight": 42.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "Pelangi Cottages",
    "stars": "3.0",
    "rating": 8.9,
    "m2": 40,
    "breakfast": "SI",
    "priceNight": 47.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "Unzipp Bungalows",
    "stars": "3.0",
    "rating": 9.1,
    "m2": 18,
    "breakfast": "SI",
    "priceNight": 51.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "Larchipel",
    "stars": "3.0",
    "rating": 8.8,
    "m2": 24,
    "breakfast": "SI",
    "priceNight": 54.0,
    "comment": "Puede ser",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "Omala Village",
    "stars": "4.0",
    "rating": 8.9,
    "m2": 27,
    "breakfast": "SI",
    "priceNight": 59.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "The koho",
    "stars": "4.0",
    "rating": 9.5,
    "m2": 24,
    "breakfast": "SI",
    "priceNight": 68.0,
    "comment": "Donde se quedaron los chicos",
    "source": "Investigación Tom y Vero",
    "chosenBy": "Elegido Tom y Vero (USD 59/n) + Juani y Cande"
  },
  {
    "city": "Gili Air",
    "name": "Scallywags beach club",
    "stars": "4.0",
    "rating": 8.8,
    "m2": 32,
    "breakfast": "SI",
    "priceNight": 68.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "Hani Hideaway",
    "stars": "4.0",
    "rating": 9.7,
    "m2": 17,
    "breakfast": "SI",
    "priceNight": 81.0,
    "comment": "No tiene cancelacion gratis",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "Gili air escape",
    "stars": "3.0",
    "rating": 9.3,
    "m2": 40,
    "breakfast": "SI",
    "priceNight": 85.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "The mandana villa",
    "stars": "4.0",
    "rating": 8.5,
    "m2": 75,
    "breakfast": "SI",
    "priceNight": 100.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "Turtlepad villa",
    "stars": "3.0",
    "rating": 8.1,
    "m2": null,
    "breakfast": "SI",
    "priceNight": 152.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Gili Air",
    "name": "Villa Maiya",
    "stars": "4.0",
    "rating": 8.2,
    "m2": 60,
    "breakfast": "NO",
    "priceNight": 158.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Nusa Penida",
    "name": "Penida dream homestay",
    "stars": "",
    "rating": 8.9,
    "m2": 20,
    "breakfast": "SI",
    "priceNight": 29.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Nusa Penida",
    "name": "Kamassan Cottage",
    "stars": "3.0",
    "rating": 9.0,
    "m2": 35,
    "breakfast": "SI",
    "priceNight": 34.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Nusa Penida",
    "name": "Batan sabo & co",
    "stars": "3.0",
    "rating": 8.8,
    "m2": 35,
    "breakfast": "SI",
    "priceNight": 42.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Nusa Penida",
    "name": "La roja bungalows",
    "stars": "3.0",
    "rating": 9.0,
    "m2": 24,
    "breakfast": "SI",
    "priceNight": 44.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Nusa Penida",
    "name": "The MG villa",
    "stars": "4.0",
    "rating": 8.0,
    "m2": 32,
    "breakfast": "SI",
    "priceNight": 62.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Nusa Penida",
    "name": "Mambo beach resort",
    "stars": "4.0",
    "rating": 8.6,
    "m2": 24,
    "breakfast": "SI",
    "priceNight": 74.0,
    "comment": "",
    "source": "Investigación Tom y Vero",
    "chosenBy": "Elegido Tom y Vero (USD 73/n)"
  },
  {
    "city": "Nusa Penida",
    "name": "Sea la vie resort",
    "stars": "4.0",
    "rating": 8.6,
    "m2": 32,
    "breakfast": "SI",
    "priceNight": 114.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Nusa Penida",
    "name": "Beachfront luxury dome",
    "stars": "",
    "rating": 9.3,
    "m2": 70,
    "breakfast": "NO",
    "priceNight": 171.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Hanoi",
    "name": "The soho hanoi",
    "stars": "3.0",
    "rating": 9.2,
    "m2": 19,
    "breakfast": "SI",
    "priceNight": 35.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Hanoi",
    "name": "La palm boutique",
    "stars": "3.0",
    "rating": 9.1,
    "m2": 18,
    "breakfast": "SI",
    "priceNight": 35.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Hanoi",
    "name": "Serene Boutique",
    "stars": "4.0",
    "rating": 8.8,
    "m2": 22,
    "breakfast": "SI",
    "priceNight": 52.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Hanoi",
    "name": "Golden sunshine villa",
    "stars": "4.0",
    "rating": 9.1,
    "m2": 30,
    "breakfast": "SI",
    "priceNight": 53.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Hanoi",
    "name": "Amira hotel",
    "stars": "4.0",
    "rating": 9.2,
    "m2": 25,
    "breakfast": "SI",
    "priceNight": 69.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Hanoi",
    "name": "Hanoi solis",
    "stars": "5.0",
    "rating": 9.8,
    "m2": 18,
    "breakfast": "SI",
    "priceNight": 106.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Hanoi",
    "name": "Babylon premium hotel",
    "stars": "4.0",
    "rating": 9.2,
    "m2": 38,
    "breakfast": "SI",
    "priceNight": 120.0,
    "comment": "Al que fueron los chicos",
    "source": "Investigación Tom y Vero",
    "chosenBy": "Elegido Juani y Cande"
  },
  {
    "city": "Hanoi",
    "name": "May de ville corner",
    "stars": "5.0",
    "rating": 9.5,
    "m2": 30,
    "breakfast": "SI",
    "priceNight": 123.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Hanoi",
    "name": "La passion hanoi",
    "stars": "4.0",
    "rating": 9.3,
    "m2": 35,
    "breakfast": "SI",
    "priceNight": 126.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Hanoi",
    "name": "May de ville crown",
    "stars": "5.0",
    "rating": 9.6,
    "m2": 25,
    "breakfast": "SI",
    "priceNight": 127.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Hanoi",
    "name": "Classyc hotel",
    "stars": "5.0",
    "rating": 9.6,
    "m2": 24,
    "breakfast": "SI",
    "priceNight": 145.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Hanoi",
    "name": "Hanoi l´heritage diamond",
    "stars": "4.0",
    "rating": 9.1,
    "m2": 23,
    "breakfast": "SI",
    "priceNight": 94.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ha Long Bay",
    "name": "Doris cruise",
    "stars": "5.0",
    "rating": 9.3,
    "m2": 28,
    "breakfast": "SI",
    "priceNight": 300.0,
    "comment": "",
    "source": "Investigación Tom y Vero",
    "chosenBy": "Elegido Juani y Cande (USD 294/n · 2n)"
  },
  {
    "city": "Ha Long Bay",
    "name": "Majesty luxury",
    "stars": "5.0",
    "rating": 9.4,
    "m2": 35,
    "breakfast": "SI",
    "priceNight": 315.0,
    "comment": "",
    "source": "Investigación Tom y Vero",
    "chosenBy": "Elegido Tom y Vero (USD 315/n)"
  },
  {
    "city": "Ha Long Bay",
    "name": "Rosy cruises",
    "stars": "5.0",
    "rating": 8.5,
    "m2": 28,
    "breakfast": "SI",
    "priceNight": 334.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ha Long Bay",
    "name": "Peony cruises",
    "stars": "5.0",
    "rating": 9.2,
    "m2": 26,
    "breakfast": "SI",
    "priceNight": 347.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Ha Long Bay",
    "name": "Genesis luxury regal",
    "stars": "5.0",
    "rating": 9.3,
    "m2": 32,
    "breakfast": "SI",
    "priceNight": 450.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Phi Phi",
    "name": "Phi phi natural resort",
    "stars": "4.0",
    "rating": 8.4,
    "m2": 38,
    "breakfast": "SI",
    "priceNight": 107.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Phi Phi",
    "name": "P2 wood loft",
    "stars": "3.0",
    "rating": 8.3,
    "m2": 21,
    "breakfast": "NO",
    "priceNight": 111.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Phi Phi",
    "name": "Phi phi island cabana",
    "stars": "3.0",
    "rating": 7.1,
    "m2": 24,
    "breakfast": "SI",
    "priceNight": 138.0,
    "comment": "Muy viejo",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Phi Phi",
    "name": "Panmanee Hotel",
    "stars": "3.0",
    "rating": 8.9,
    "m2": 26,
    "breakfast": "NO",
    "priceNight": 140.0,
    "comment": "Buena ubicación, moderno",
    "source": "Investigación Tom y Vero",
    "chosenBy": "Elegido Tom y Vero (USD 129/n)"
  },
  {
    "city": "Koh Phi Phi",
    "name": "Phi phi villa resort",
    "stars": "3.0",
    "rating": 8.5,
    "m2": 32,
    "breakfast": "SI",
    "priceNight": 166.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Phi Phi",
    "name": "Phi phi at pier",
    "stars": "4.0",
    "rating": 8.9,
    "m2": 38,
    "breakfast": "SI",
    "priceNight": 204.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Phi Phi",
    "name": "Phi phi indigo hotel",
    "stars": "3.0",
    "rating": 8.0,
    "m2": 20,
    "breakfast": "NO",
    "priceNight": 90.0,
    "comment": "Muy ruidoso",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Lipe",
    "name": "Sea to moon lipe",
    "stars": "3.0",
    "rating": 7.9,
    "m2": 25,
    "breakfast": "SI",
    "priceNight": 62.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Lipe",
    "name": "The chic lipe",
    "stars": "3.0",
    "rating": 9.0,
    "m2": 24,
    "breakfast": "SI",
    "priceNight": 91.0,
    "comment": "Hostel con cuarto privado",
    "source": "Investigación Tom y Vero",
    "chosenBy": "Elegido Tom y Vero (USD 118/n)"
  },
  {
    "city": "Koh Lipe",
    "name": "Castaway resort",
    "stars": "3.0",
    "rating": 8.7,
    "m2": 32,
    "breakfast": "NO",
    "priceNight": 105.0,
    "comment": "Muy rustico",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Lipe",
    "name": "Andaman beach resort",
    "stars": "",
    "rating": 8.2,
    "m2": 36,
    "breakfast": "SI",
    "priceNight": 108.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Lipe",
    "name": "Bayview hill resort",
    "stars": "",
    "rating": 7.6,
    "m2": 30,
    "breakfast": "SI",
    "priceNight": 114.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Lipe",
    "name": "The reef hotel & studio",
    "stars": "3.0",
    "rating": 8.5,
    "m2": 15,
    "breakfast": "SI",
    "priceNight": 125.0,
    "comment": "Canchero, desyauno ok",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Lipe",
    "name": "Anda lipe resort",
    "stars": "3.0",
    "rating": 8.0,
    "m2": 35,
    "breakfast": "SI",
    "priceNight": 159.0,
    "comment": "No me copa el baño",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Lipe",
    "name": "Salisa Resort",
    "stars": "3.0",
    "rating": 7.8,
    "m2": 20,
    "breakfast": "SI",
    "priceNight": 184.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Lipe",
    "name": "Sita beach resort",
    "stars": "4.0",
    "rating": 8.5,
    "m2": 45,
    "breakfast": "SI",
    "priceNight": 185.0,
    "comment": "Suite nupcial cheta",
    "source": "Investigación Tom y Vero",
    "chosenBy": "Elegido Juani y Cande (2n Año Nuevo)"
  },
  {
    "city": "Koh Lipe",
    "name": "Bundhaya villas",
    "stars": "4.0",
    "rating": 8.8,
    "m2": 64,
    "breakfast": "SI",
    "priceNight": 193.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Lipe",
    "name": "Ananya lipe",
    "stars": "5.0",
    "rating": 8.9,
    "m2": 42,
    "breakfast": "SI",
    "priceNight": 200.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Lipe",
    "name": "Ilylic",
    "stars": "4.0",
    "rating": 8.8,
    "m2": 42,
    "breakfast": "SI",
    "priceNight": 201.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Lipe",
    "name": "Akira lipe",
    "stars": "4.0",
    "rating": 9.2,
    "m2": 59,
    "breakfast": "SI",
    "priceNight": 231.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Koh Lipe",
    "name": "Mali resort",
    "stars": "4.0",
    "rating": 8.8,
    "m2": 35,
    "breakfast": "SI",
    "priceNight": 264.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Bangkok",
    "name": "Amara bangkok hotel",
    "stars": "5.0",
    "rating": 8.8,
    "m2": 27,
    "breakfast": "NO",
    "priceNight": 126.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Bangkok",
    "name": "Eastin grand hotel",
    "stars": "5.0",
    "rating": 9.3,
    "m2": 32,
    "breakfast": "SI",
    "priceNight": 209.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Bangkok",
    "name": "Holiday inn express sathorn",
    "stars": "4.0",
    "rating": 8.3,
    "m2": 19,
    "breakfast": "SI",
    "priceNight": 87.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Bangkok",
    "name": "The berkeley hotel",
    "stars": "5.0",
    "rating": 8.6,
    "m2": 35,
    "breakfast": "NO",
    "priceNight": 94.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Bangkok",
    "name": "Travelodge sukhumvit",
    "stars": "",
    "rating": null,
    "m2": 21,
    "breakfast": "NO",
    "priceNight": 78.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Bangkok",
    "name": "NH bangkok asoke",
    "stars": "4.0",
    "rating": 8.3,
    "m2": 33,
    "breakfast": "NO",
    "priceNight": 88.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  },
  {
    "city": "Bangkok",
    "name": "The moment",
    "stars": "4.0",
    "rating": 9.5,
    "m2": 30,
    "breakfast": "SI",
    "priceNight": 72.0,
    "comment": "",
    "source": "Investigación Tom y Vero"
  }
];

const FLIGHT_STRATEGIES = [
  {
    id: 'open_jaw_sin_bkk',
    title: 'Multidestino (Open-Jaw): Entrar por Singapur / Volver por Bangkok',
    routeCode: 'EZE → SIN  //  BKK → EZE',
    entryHub: 'singapore',
    exitHub: 'bangkok',
    reference: 'Usado por Tom y Vero (Qatar Airways)',
    airlines: 'Qatar Airways (vía GRU+DOH), Turkish Airlines (vía IST), Emirates (vía DXB), Air France/KLM, Lufthansa/Swiss',
    bestFor: ['beach', 'bali', 'cities', 'hybrid'],
    pros: 'Cero tiempo perdido volviendo atrás. Arrancás suave en Singapur (a 2h40 de Bali), recorrés islas/Vietnam y cerrás en Bangkok con compras antes de volver.',
    cons: 'A veces el pasaje multidestino cuesta USD 100–250 más que un ida y vuelta clásico (comparalo siempre antes de emitir).'
  },
  {
    id: 'roundtrip_bkk',
    title: 'Ida y Vuelta a Bangkok (El Comodín Más Barato y Flexible)',
    routeCode: 'EZE ↔ BKK',
    entryHub: 'bangkok',
    exitHub: 'bangkok',
    reference: 'Usado por Juani y Cande (Emirates + stopover Dubái)',
    airlines: 'Emirates (vía GIG+DXB), Qatar Airways, Turkish Airlines, Ethiopian Airlines (vía ADD)',
    bestFor: ['budget', 'beach', 'culture', 'hybrid', 'bali'],
    pros: 'Casi siempre es el pasaje más barato y con más promos desde Ezeiza. Bangkok conecta con vuelos low-cost (USD 40–90) a TODO el Sudeste: Bali, Singapur, Vietnam, Camboya, Laos y playas.',
    cons: 'Te obliga a cerrar el círculo volviendo a Bangkok (igual es genial dejar Bangkok para los últimos 3 días de compras!).'
  },
  {
    id: 'open_jaw_bkk_hkg',
    title: 'Multidestino Indochina: Entrar por Bangkok / Volver por Hong Kong (o Hanoi/SGN)',
    routeCode: 'EZE → BKK  //  HKG → EZE',
    entryHub: 'bangkok',
    exitHub: 'hong_kong',
    reference: 'Usado por Cande y Diego',
    airlines: 'Qatar Airways, Emirates, Turkish Airlines, Air France/KLM, Lufthansa',
    bestFor: ['culture', 'cities'],
    pros: 'Perfecto para hacer Indochina de punta a punta (Tailandia Norte → Laos → Vietnam → Camboya) sin dar vueltas y cerrar en una gran metrópoli como Hong Kong.',
    cons: 'Menos cómodo si tu prioridad número uno es Bali + islas de Indonesia.'
  },
  {
    id: 'roundtrip_sin_or_kul',
    title: 'Ida y Vuelta a Singapur o Kuala Lumpur (Ideal Invierno Argentino · May–Sep)',
    routeCode: 'EZE ↔ SIN  (o EZE ↔ KUL)',
    entryHub: 'singapore',
    exitHub: 'singapore',
    reference: 'Clave si viajás en Mayo–Septiembre (temporada seca de Bali)',
    airlines: 'Qatar Airways, Emirates, Turkish Airlines, KLM/Air France',
    bestFor: ['bali', 'cities', 'winter_ar'],
    pros: 'Si viajás entre mayo y septiembre, Bali/Gili/Penida están en su mejor clima y Singapur/Kuala Lumpur te dejan a 2h30 de vuelo directo (y a 1h45 de Koh Samui/Golfo de Tailandia).',
    cons: 'Si querés incluir norte de Vietnam o norte de Tailandia, sumás un vuelo regional un poco más largo (~3h).'
  }
];

// 3 = Ideal/Seco, 2 = Mixto/Transición, 1 = Lluvias/Monzón fuerte
const MONSOON_MATRIX = [
  { region: 'Tailandia Andamán (Phi Phi, Krabi, Koh Lipe)', months: [3,3,3,3,1,1,1,1,1,1,2,3], note: 'Koh Lipe reduce ferries de mayo a octubre.' },
  { region: 'Tailandia Golfo (Koh Samui, Koh Tao)', months: [2,3,3,3,3,3,3,3,2,1,1,1], note: 'La gran alternativa playera en invierno argentino.' },
  { region: 'Bangkok & Norte Tailandia (Chiang Mai)', months: [3,3,2,2,2,2,2,1,1,2,3,3], note: 'Mar–Abr hace mucho calor y humo agrícola en Chiang Mai.' },
  { region: 'Bali, Gili Air & Nusa Penida', months: [1,1,2,2,3,3,3,3,3,3,2,1], note: 'Dic–Mar llueve a ratos (chubascos tropicales), igual se viaja bien.' },
  { region: 'Vietnam Norte (Hanoi, Ha Long Bay)', months: [2,2,3,3,2,2,1,1,2,3,3,2], note: 'Dic–Ene fresco (15°C); Mar–Abr y Oct–Nov ideales.' },
  { region: 'Vietnam Centro (Hoi An, Da Nang)', months: [2,3,3,3,3,3,3,3,2,1,1,1], note: 'Oct–Nov época de lluvias fuertes/tifones en el centro.' },
  { region: 'Vietnam Sur (Saigón, Con Dao) & Camboya/Laos', months: [3,3,3,3,2,2,1,1,1,2,3,3], note: 'Nov–Abr temporada seca perfecta.' },
  { region: 'Singapur & Hong Kong', months: [2,3,3,3,2,2,2,2,2,3,3,2], note: 'Singapur es ecuatorial todo el año; HK ideal Oct–Abr.' }
];

const VISAS_GUIDE = [
  { country: 'Tailandia 🇹🇭', arPassport: 'SIN VISA hasta 60 días', extra: 'Completar TDAC online gratis dentro de las 72 hs previas (tdac.immigration.go.th).', yellowFever: 'OBLIGATORIA si venís desde Argentina (Certificado Internacional).' },
  { country: 'Singapur 🇸🇬', arPassport: 'SIN VISA hasta 30 días', extra: 'Completar SG Arrival Card gratis 3 días antes (eservices.ica.gov.sg).', yellowFever: 'Puede pedirse si transitaste zona de riesgo en últimos 6 días.' },
  { country: 'Indonesia (Bali) 🇮🇩', arPassport: 'Visa on Arrival / e-VOA (~USD 32 p/p)', extra: 'Se saca online antes o al aterrizar en Bali + tasa turística de Bali (~USD 10) + declaración aduana.', yellowFever: 'Recomendable llevar el carnet siempre encima.' },
  { country: 'Vietnam 🇻🇳', arPassport: 'e-Visa OBLIGATORIA previa (~USD 25)', extra: 'Tramitar en evisa.gov.vn al menos 10–15 días antes (no hay visa al llegar). Pasaporte francés/italiano/español suele entrar sin visa hasta 45 días.', yellowFever: 'Puede solicitarse llegando desde Sudamérica.' },
  { country: 'Camboya 🇰🇭', arPassport: 'e-Visa o Visa on Arrival (~USD 30–36)', extra: 'evisa.gov.kh o al llegar al aeropuerto de Siem Reap (llevar USD cash).', yellowFever: 'Puede solicitarse llegando desde Argentina.' },
  { country: 'Laos 🇱🇦', arPassport: 'e-Visa o Visa on Arrival (~USD 40–50)', extra: 'laoevisa.gov.la o al llegar a Luang Prabang (llevar USD en billetes impecables).', yellowFever: 'Puede solicitarse llegando desde Argentina.' },
  { country: 'Hong Kong 🇭🇰', arPassport: 'SIN VISA hasta 90 días', extra: 'Súper ágil.', yellowFever: 'No requerida.' }
];

const STARTER_TEMPLATES = {
  plan_19n_a: {
    name: '⭐ 19 noches (27 Mar–18 Abr) · A: BKK → Islas Thai → Bali/Gili → SIN (Ritmo ideal)',
    stops: [
      { destId: 'bangkok', nights: 3 },
      { destId: 'phi_phi', nights: 3 },
      { destId: 'koh_lipe', nights: 3 },
      { destId: 'ubud', nights: 4 },
      { destId: 'gili_air', nights: 4 },
      { destId: 'singapore', nights: 2 }
    ]
  },
  plan_19n_b: {
    name: '⭐ 19 noches (27 Mar–18 Abr) · B: SIN → Bali → Vietnam Norte → Phi Phi → BKK (Tom & Vero compacto)',
    stops: [
      { destId: 'singapore', nights: 2 },
      { destId: 'ubud', nights: 3 },
      { destId: 'gili_air', nights: 3 },
      { destId: 'hanoi', nights: 3 },
      { destId: 'halong_bay', nights: 1 },
      { destId: 'phi_phi', nights: 4 },
      { destId: 'bangkok', nights: 3 }
    ]
  },
  plan_19n_c: {
    name: '⭐ 19 noches (27 Mar–18 Abr) · C: BKK → Angkor → Vietnam + Playa → HKG (Indochina)',
    stops: [
      { destId: 'bangkok', nights: 3 },
      { destId: 'siem_reap', nights: 3 },
      { destId: 'hanoi', nights: 2 },
      { destId: 'halong_bay', nights: 1 },
      { destId: 'hoi_an', nights: 3 },
      { destId: 'con_dao', nights: 4 },
      { destId: 'hong_kong', nights: 3 }
    ]
  },
  tom_vero_base: {
    name: 'Estilo Tom y Vero (26 noches · Islas + Bali + Vietnam)',
    stops: [
      { destId: 'singapore', nights: 2 },
      { destId: 'ubud', nights: 4 },
      { destId: 'gili_air', nights: 3 },
      { destId: 'nusa_penida', nights: 2 },
      { destId: 'hanoi', nights: 3 },
      { destId: 'halong_bay', nights: 1 },
      { destId: 'krabi', nights: 2 },
      { destId: 'phi_phi', nights: 3 },
      { destId: 'koh_lipe', nights: 3 },
      { destId: 'bangkok', nights: 3 }
    ]
  },
  indochina_cultural: {
    name: 'Estilo Cande y Diego (25 noches · Cultura + Angkor + Playa)',
    stops: [
      { destId: 'bangkok', nights: 3 },
      { destId: 'chiang_mai', nights: 3 },
      { destId: 'luang_prabang', nights: 3 },
      { destId: 'hanoi', nights: 2 },
      { destId: 'halong_bay', nights: 1 },
      { destId: 'hoi_an', nights: 3 },
      { destId: 'siem_reap', nights: 3 },
      { destId: 'ho_chi_minh', nights: 2 },
      { destId: 'con_dao', nights: 3 },
      { destId: 'hong_kong', nights: 2 }
    ]
  },
  best_of_both_24: {
    name: 'Híbrido "Lo Mejor de Todo" (24 noches · Sin correr)',
    stops: [
      { destId: 'singapore', nights: 2 },
      { destId: 'ubud', nights: 4 },
      { destId: 'gili_air', nights: 3 },
      { destId: 'siem_reap', nights: 3 },
      { destId: 'hanoi', nights: 2 },
      { destId: 'halong_bay', nights: 1 },
      { destId: 'phi_phi', nights: 3 },
      { destId: 'koh_lipe', nights: 3 },
      { destId: 'bangkok', nights: 3 }
    ]
  },
  winter_ar_22: {
    name: 'Invierno Argentino May–Sep (22 noches · Clima 100% Seco)',
    stops: [
      { destId: 'singapore', nights: 2 },
      { destId: 'ubud', nights: 4 },
      { destId: 'nusa_penida', nights: 2 },
      { destId: 'gili_air', nights: 3 },
      { destId: 'hoi_an', nights: 3 },
      { destId: 'koh_samui', nights: 5 },
      { destId: 'bangkok', nights: 3 }
    ]
  }
};
