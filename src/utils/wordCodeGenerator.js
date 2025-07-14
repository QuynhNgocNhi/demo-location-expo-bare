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
  
  // Convert coordinates to a hash
  const latHash = Math.abs(Math.floor(latitude * 1000000)) % ALL_WORDS.length;
  const lngHash = Math.abs(Math.floor(longitude * 1000000)) % ALL_WORDS.length;
  const combinedHash = Math.abs(Math.floor((latitude + longitude) * 1000000)) % ALL_WORDS.length;
  
  // Get 3 words
  const word1 = ALL_WORDS[latHash];
  const word2 = ALL_WORDS[lngHash];
  const word3 = ALL_WORDS[combinedHash];
  
  return `${word1}.${word2}.${word3}`;
};

// Parse a 3-word code back to approximate coordinates
export const parseWordCode = (wordCode) => {
  try {
    const words = wordCode.toLowerCase().split('.');
    if (words.length !== 3) {
      throw new Error('Invalid word code format');
    }
    
    // Find indices of words
    const index1 = ALL_WORDS.indexOf(words[0]);
    const index2 = ALL_WORDS.indexOf(words[1]);
    const index3 = ALL_WORDS.indexOf(words[2]);
    
    if (index1 === -1 || index2 === -1 || index3 === -1) {
      throw new Error('Invalid words in code');
    }
    
    // Convert back to approximate coordinates
    // This is a simplified reverse mapping
    const lat = (index1 / ALL_WORDS.length) * 180 - 90;
    const lng = (index2 / ALL_WORDS.length) * 360 - 180;
    
    return { latitude: lat, longitude: lng };
  } catch (error) {
    console.error('Error parsing word code:', error);
    return null;
  }
};

// Validate word code format
export const isValidWordCode = (wordCode) => {
  if (!wordCode || typeof wordCode !== 'string') return false;
  
  const words = wordCode.toLowerCase().split('.');
  if (words.length !== 3) return false;
  
  return words.every(word => ALL_WORDS.includes(word));
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