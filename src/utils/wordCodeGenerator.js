// Word Code Generator for Vietnamese 3-word addresses
// Inspired by What3Words but with Vietnamese words

// Vietnamese words for generating 3-word codes
const VIETNAMESE_WORDS = {
  // Animals (Động vật)
  animals: [
    'meo', 'cho', 'ga', 'vit', 'ngua', 'bo', 'lon', 'de', 'cuu', 'trau',
    'voi', 'ho', 'su-tu', 'cao', 'soc', 'chuot', 'tho', 'ran', 'ech', 'ca'
  ],
  
  // Colors (Màu sắc)
  colors: [
    'do', 'xanh', 'vang', 'tim', 'cam', 'hong', 'nau', 'den', 'trang', 'xam',
    'lam', 'luc', 'hong-nhat', 'xanh-la', 'xanh-duong', 'vang-nhat', 'do-nhat'
  ],
  
  // Objects (Đồ vật)
  objects: [
    'ban', 'ghe', 'may', 'dien-thoai', 'sach', 'but', 'cay', 'hoa', 'nha', 'cua',
    'cua-so', 'den', 'quat', 'tivi', 'tu-lanh', 'may-giat', 'xe', 'xe-may', 'xe-dap'
  ],
  
  // Nature (Thiên nhiên)
  nature: [
    'nui', 'song', 'bien', 'rung', 'ho', 'suoi', 'giong', 'mua', 'nang', 'may',
    'sao', 'mat-troi', 'mat-trang', 'gio', 'mua', 'sap', 'suong-mu'
  ],
  
  // Food (Thức ăn)
  food: [
    'com', 'pho', 'banh-mi', 'bun', 'cha-ca', 'banh-cuon', 'nem', 'cha-gio',
    'banh-xeo', 'banh-khot', 'banh-tet', 'banh-chung', 'banh-troi', 'che'
  ],
  
  // Actions (Hành động)
  actions: [
    'di', 've', 'chay', 'nha', 'an', 'uong', 'ngu', 'doc', 'viet', 'hat',
    'mua', 'ban', 'hoc', 'lam', 'choi', 'xem', 'nghe', 'noi', 'cuoi', 'khoc'
  ]
};

// Combine all words into one array
const ALL_WORDS = [
  ...VIETNAMESE_WORDS.animals,
  ...VIETNAMESE_WORDS.colors,
  ...VIETNAMESE_WORDS.objects,
  ...VIETNAMESE_WORDS.nature,
  ...VIETNAMESE_WORDS.food,
  ...VIETNAMESE_WORDS.actions
];

// Generate a 3-word code based on coordinates
export const generateWordCode = (latitude, longitude) => {
  // Validate inputs
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    console.error('Invalid coordinates provided to generateWordCode:', { latitude, longitude });
    return 'meo.xanh.ban'; // Default fallback
  }
  
  // Normalize coordinates to 0-1 range
  const normalizedLat = (latitude + 90) / 180; // Convert from [-90, 90] to [0, 1]
  const normalizedLng = (longitude + 180) / 360; // Convert from [-180, 180] to [0, 1]
  
  // Convert to word indices
  const latIndex = Math.floor(normalizedLat * ALL_WORDS.length);
  const lngIndex = Math.floor(normalizedLng * ALL_WORDS.length);
  
  // Use a combination for the third word to add some uniqueness
  const combinedIndex = Math.floor(((normalizedLat + normalizedLng) / 2) * ALL_WORDS.length);
  
  // Get 3 words, ensuring indices are within bounds
  const word1 = ALL_WORDS[Math.min(latIndex, ALL_WORDS.length - 1)];
  const word2 = ALL_WORDS[Math.min(lngIndex, ALL_WORDS.length - 1)];
  const word3 = ALL_WORDS[Math.min(combinedIndex, ALL_WORDS.length - 1)];
  
  console.log('Generated word code:', { latitude, longitude, normalizedLat, normalizedLng, latIndex, lngIndex, combinedIndex, word1, word2, word3 });
  
  return `${word1}.${word2}.${word3}`;
};

// Parse a 3-word code back to approximate coordinates
export const parseWordCode = (wordCode) => {
  try {
    console.log('Parsing word code:', wordCode);
    
    const words = wordCode.toLowerCase().split('.');
    console.log('Split words:', words);
    
    if (words.length !== 3) {
      throw new Error(`Invalid word code format: expected 3 words, got ${words.length}`);
    }
    
    // Find indices of words
    const index1 = ALL_WORDS.indexOf(words[0]);
    const index2 = ALL_WORDS.indexOf(words[1]);
    const index3 = ALL_WORDS.indexOf(words[2]);
    
    console.log('Word indices:', { index1, index2, index3 });
    
    if (index1 === -1 || index2 === -1 || index3 === -1) {
      const invalidWords = [];
      if (index1 === -1) invalidWords.push(words[0]);
      if (index2 === -1) invalidWords.push(words[1]);
      if (index3 === -1) invalidWords.push(words[2]);
      throw new Error(`Invalid words in code: ${invalidWords.join(', ')}`);
    }
    
    // Convert back to approximate coordinates using the same logic as generation
    // First two words represent latitude and longitude
    const normalizedLat = index1 / ALL_WORDS.length;
    const normalizedLng = index2 / ALL_WORDS.length;
    
    // Convert back to actual coordinates
    const lat = (normalizedLat * 180) - 90;
    const lng = (normalizedLng * 360) - 180;
    
    const result = { latitude: lat, longitude: lng };
    console.log('Parsed coordinates:', { normalizedLat, normalizedLng, lat, lng });
    
    return result;
  } catch (error) {
    console.error('Error parsing word code:', error);
    return null;
  }
};

// Validate word code format
export const isValidWordCode = (wordCode) => {
  if (!wordCode || typeof wordCode !== 'string') {
    console.log('Invalid wordCode type:', typeof wordCode);
    return false;
  }
  
  const words = wordCode.toLowerCase().split('.');
  console.log('Validating words:', words);
  
  if (words.length !== 3) {
    console.log('Invalid word count:', words.length);
    return false;
  }
  
  const validWords = words.every(word => ALL_WORDS.includes(word));
  if (!validWords) {
    const invalidWords = words.filter(word => !ALL_WORDS.includes(word));
    console.log('Invalid words found:', invalidWords);
  }
  
  return validWords;
};

// Get a random word code for testing
export const getRandomWordCode = () => {
  const word1 = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
  const word2 = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
  const word3 = ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
  
  return `${word1}.${word2}.${word3}`;
};

// Get word categories for UI
export const getWordCategories = () => VIETNAMESE_WORDS;

// Get all words for search functionality
export const getAllWords = () => ALL_WORDS; 