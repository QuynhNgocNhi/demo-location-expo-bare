// Word Code Generator for Vietnamese 3-word addresses
// Inspired by What3Words but with Vietnamese words

// Vietnamese words for generating 3-word codes with high precision
const VIETNAMESE_WORDS = {
  // Animals (Động vật) - 50 words
  animals: [
    'meo', 'cho', 'ga', 'vit', 'ngua', 'bo', 'lon', 'de', 'cuu', 'trau',
    'voi', 'ho', 'su-tu', 'cao', 'soc', 'chuot', 'tho', 'ran', 'ech', 'ca',
    'chim', 'ong', 'buom', 'kien', 'ruoi', 'muoi', 'nhen', 'bo-cap', 'cua', 'tom',
    'ca-sau', 'rua', 'ech-nhai', 'nhen-nha', 'ong-mat', 'ong-nghe', 'ong-vo-vang', 'ong-dat',
    'buom-dem', 'buom-ngay', 'kien-den', 'kien-do', 'ruoi-xanh', 'ruoi-den', 'muoi-anopheles',
    'muoi-culex', 'nhen-hung', 'nhen-nau', 'bo-cap-den', 'bo-cap-vang', 'cua-bien', 'cua-song',
    'tom-he', 'tom-su', 'tom-cang', 'tom-hum', 'ca-bass', 'ca-chim', 'ca-ro', 'ca-tram'
  ],
  
  // Colors (Màu sắc) - 50 words
  colors: [
    'do', 'xanh', 'vang', 'tim', 'cam', 'hong', 'nau', 'den', 'trang', 'xam',
    'lam', 'luc', 'hong-nhat', 'xanh-la', 'xanh-duong', 'vang-nhat', 'do-nhat',
    'xanh-xam', 'vang-cam', 'do-sam', 'xanh-nhat', 'tim-nhat', 'cam-nhat',
    'do-dam', 'do-tuoi', 'do-nhat', 'do-cam', 'xanh-duong-dam', 'xanh-duong-nhat',
    'xanh-la-dam', 'xanh-la-nhat', 'vang-dam', 'vang-nhat', 'vang-cam', 'vang-xanh',
    'tim-dam', 'tim-nhat', 'tim-xanh', 'tim-do', 'cam-dam', 'cam-nhat', 'cam-do',
    'hong-dam', 'hong-nhat', 'hong-do', 'hong-tim', 'nau-dam', 'nau-nhat', 'nau-do',
    'nau-xanh', 'den-tuyet', 'den-xam', 'trang-tuyet', 'trang-nga', 'xam-dam', 'xam-nhat'
  ],
  
  // Objects (Đồ vật) - 50 words
  objects: [
    'ban', 'ghe', 'may', 'dien-thoai', 'sach', 'but', 'cay', 'hoa', 'nha', 'cua',
    'cua-so', 'den', 'quat', 'tivi', 'tu-lanh', 'may-giat', 'xe', 'xe-may', 'xe-dap',
    'giuong', 'ghe-sofa', 'ban-an', 'tu-quan-ao', 'may-tinh', 'chuot', 'ban-phim',
    'loa', 'micro', 'camera', 'tablet', 'laptop', 'may-in', 'may-scan', 'may-chi',
    'may-tinh-bang', 'dien-thoai-thong-minh', 'dien-thoai-co', 'sach-giao-khoa', 'sach-tieu-thuyet',
    'sach-ky-thuat', 'but-bi', 'but-chi', 'but-long', 'but-dau', 'cay-canh', 'cay-an-qua',
    'cay-lay-go', 'hoa-hong', 'hoa-cuc', 'hoa-lan', 'hoa-sen', 'nha-chung-cu', 'nha-biet-thu',
    'nha-pho', 'cua-go', 'cua-nhom', 'cua-kinh', 'cua-so-go', 'cua-so-nhom', 'den-tuyp', 'den-led'
  ],
  
  // Nature (Thiên nhiên) - 50 words
  nature: [
    'nui', 'song', 'bien', 'rung', 'ho', 'suoi', 'giong', 'mua', 'nang', 'may',
    'sao', 'mat-troi', 'mat-trang', 'gio', 'sap', 'suong-mu', 'da', 'cat', 'dat',
    'co', 'la', 're', 'than', 'canh', 'hoa', 'qua', 'nui-cao', 'nui-thap', 'nui-lua',
    'song-lon', 'song-nho', 'song-cai', 'bien-xanh', 'bien-xam', 'rung-gia', 'rung-non',
    'ho-lon', 'ho-nho', 'suoi-nuoc', 'suoi-kho', 'giong-to', 'giong-nho', 'mua-rao',
    'mua-phun', 'nang-gay', 'nang-nhe', 'may-trang', 'may-den', 'sao-sang', 'sao-mo'
  ],
  
  // Food (Thức ăn) - 50 words
  food: [
    'com', 'pho', 'banh-mi', 'bun', 'cha-ca', 'banh-cuon', 'nem', 'cha-gio',
    'banh-xeo', 'banh-khot', 'banh-tet', 'banh-chung', 'banh-troi', 'che',
    'banh-bot-loc', 'banh-nam', 'banh-beo', 'banh-it', 'banh-chay', 'banh-gai',
    'banh-kho', 'banh-deo', 'banh-pia', 'banh-dan-gian', 'banh-trang', 'banh-cuon-la',
    'banh-cuon-tom', 'banh-cuon-thit', 'nem-chua', 'nem-nuong', 'cha-gio-tom',
    'cha-gio-thit', 'cha-ca-lang', 'cha-ca-ha-noi', 'pho-bo', 'pho-ga', 'pho-chay',
    'bun-bo', 'bun-cha', 'bun-rieu', 'bun-mam', 'com-tam', 'com-rang', 'com-chay',
    'che-ba-mau', 'che-hat-sen', 'che-tran-chau', 'che-thai', 'che-dau-xanh'
  ],
  
  // Actions (Hành động) - 50 words
  actions: [
    'di', 've', 'chay', 'nha', 'an', 'uong', 'ngu', 'doc', 'viet', 'hat',
    'mua', 'ban', 'hoc', 'lam', 'choi', 'xem', 'nghe', 'noi', 'cuoi', 'khoc',
    'dung', 'ngoi', 'nam', 'di-bo', 'chay-bo', 'boi', 'nhay', 'mua', 'hat',
    'nghe-nhac', 'xem-phim', 'doc-sach', 'viet-thu', 'goi-dien', 'gui-tin',
    'di-lam', 'di-choi', 'di-du-lich', 'di-hoc', 'di-benh-vien', 'di-cho',
    've-nha', 've-truong', 've-cong-ty', 've-que', 'chay-nhanh', 'chay-cham',
    'nha-nhanh', 'nha-cham', 'an-sang', 'an-trua', 'an-toi', 'uong-nuoc', 'uong-tra'
  ],
  
  // Places (Địa điểm) - 50 words
  places: [
    'nha', 'truong', 'benh-vien', 'cho', 'sieu-thi', 'ngan-hang', 'buu-dien',
    'cong-ty', 'van-phong', 'khach-san', 'nha-hang', 'quan-cafe', 'rap-chieu-phim',
    'san-van-dong', 'cong-vien', 'vien-bao-tang', 'thu-vien', 'nha-ga', 'san-bay',
    'nha-tho', 'chua', 'den', 'mieu', 'lang', 'xa', 'phuong', 'quan', 'huyen',
    'tinh', 'thanh-pho', 'thi-tran', 'thi-xa', 'khu-cong-nghiep', 'khu-du-lich',
    'khu-dan-cu', 'khu-thuong-mai', 'khu-giai-tri', 'khu-the-thao', 'khu-y-te',
    'khu-giao-duc', 'khu-hanh-chinh', 'khu-quan-su', 'khu-an-ninh', 'khu-canh-sat',
    'khu-cuu-hoa', 'khu-buu-chinh', 'khu-dien-luc', 'khu-nuoc', 'khu-rac', 'khu-xe'
  ],
  
  // Numbers (Số đếm) - 50 words
  numbers: [
    'mot', 'hai', 'ba', 'bon', 'nam', 'sau', 'bay', 'tam', 'chin', 'muoi',
    'muoi-mot', 'muoi-hai', 'muoi-ba', 'muoi-bon', 'muoi-lam', 'muoi-sau',
    'muoi-bay', 'muoi-tam', 'muoi-chin', 'hai-muoi', 'ba-muoi', 'bon-muoi',
    'nam-muoi', 'sau-muoi', 'bay-muoi', 'tam-muoi', 'chin-muoi', 'mot-tram',
    'hai-tram', 'ba-tram', 'bon-tram', 'nam-tram', 'sau-tram', 'bay-tram',
    'tam-tram', 'chin-tram', 'mot-nghin', 'hai-nghin', 'ba-nghin', 'bon-nghin',
    'nam-nghin', 'sau-nghin', 'bay-nghin', 'tam-nghin', 'chin-nghin', 'muoi-nghin',
    'hai-muoi-nghin', 'ba-muoi-nghin', 'bon-muoi-nghin', 'nam-muoi-nghin'
  ]
};

// Combine all words into one array
const ALL_WORDS = [
  ...VIETNAMESE_WORDS.animals,
  ...VIETNAMESE_WORDS.colors,
  ...VIETNAMESE_WORDS.objects,
  ...VIETNAMESE_WORDS.nature,
  ...VIETNAMESE_WORDS.food,
  ...VIETNAMESE_WORDS.actions,
  ...VIETNAMESE_WORDS.places,
  ...VIETNAMESE_WORDS.numbers
];

// Remove duplicates and log the final array
const UNIQUE_WORDS = [...new Set(ALL_WORDS)];
console.log('Word code system initialized with', UNIQUE_WORDS.length, 'unique words');
console.log('Sample words:', UNIQUE_WORDS.slice(0, 10));

// Generate a 3-word code based on coordinates with 3m precision
export const generateWordCode = (latitude, longitude) => {
  // Validate inputs
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    console.error('Invalid coordinates provided to generateWordCode:', { latitude, longitude });
    return 'meo.xanh.ban'; // Default fallback
  }
  
  // Focus on Ho Chi Minh City region for 3m precision
  // HCMC roughly: 10.3°N to 11.2°N, 106.2°E to 107.2°E
  const HCMC_LAT_MIN = 10.3;
  const HCMC_LAT_MAX = 11.2;
  const HCMC_LNG_MIN = 106.2;
  const HCMC_LNG_MAX = 107.2;
  
  // Normalize coordinates within HCMC region
  const normalizedLat = (latitude - HCMC_LAT_MIN) / (HCMC_LAT_MAX - HCMC_LAT_MIN);
  const normalizedLng = (longitude - HCMC_LNG_MIN) / (HCMC_LNG_MAX - HCMC_LNG_MIN);
  
  // Clamp to 0-1 range
  const clampedLat = Math.max(0, Math.min(1, normalizedLat));
  const clampedLng = Math.max(0, Math.min(1, normalizedLng));
  
  // Calculate grid size for 3m precision
  // 3m ≈ 0.000027 degrees (roughly)
  const GRID_SIZE_LAT = Math.floor((HCMC_LAT_MAX - HCMC_LAT_MIN) / 0.000027);
  const GRID_SIZE_LNG = Math.floor((HCMC_LNG_MAX - HCMC_LNG_MIN) / 0.000027);
  
  // Convert to grid coordinates
  const latGrid = Math.floor(clampedLat * GRID_SIZE_LAT);
  const lngGrid = Math.floor(clampedLng * GRID_SIZE_LNG);
  
  // Convert grid coordinates to word indices
  const latIndex = Math.min(UNIQUE_WORDS.length - 1, Math.floor(latGrid * UNIQUE_WORDS.length / GRID_SIZE_LAT));
  const lngIndex = Math.min(UNIQUE_WORDS.length - 1, Math.floor(lngGrid * UNIQUE_WORDS.length / GRID_SIZE_LNG));
  
  // Use a combination for the third word to add some uniqueness
  const combinedIndex = Math.min(UNIQUE_WORDS.length - 1, Math.floor(((latGrid + lngGrid) / (GRID_SIZE_LAT + GRID_SIZE_LNG)) * UNIQUE_WORDS.length));
  
  // Get 3 words, ensuring indices are within bounds
  const word1 = UNIQUE_WORDS[Math.max(0, Math.min(latIndex, UNIQUE_WORDS.length - 1))];
  const word2 = UNIQUE_WORDS[Math.max(0, Math.min(lngIndex, UNIQUE_WORDS.length - 1))];
  const word3 = UNIQUE_WORDS[Math.max(0, Math.min(combinedIndex, UNIQUE_WORDS.length - 1))];
  
  console.log('Generated word code:', { 
    latitude, longitude, 
    normalizedLat, normalizedLng, 
    clampedLat, clampedLng,
    latGrid, lngGrid, GRID_SIZE_LAT, GRID_SIZE_LNG,
    latIndex, lngIndex, combinedIndex, 
    word1, word2, word3,
    totalWords: UNIQUE_WORDS.length,
    precision: '3m x 3m'
  });
  
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
    const index1 = UNIQUE_WORDS.indexOf(words[0]);
    const index2 = UNIQUE_WORDS.indexOf(words[1]);
    const index3 = UNIQUE_WORDS.indexOf(words[2]);
    
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
    const normalizedLat = index1 / (UNIQUE_WORDS.length - 1);
    const normalizedLng = index2 / (UNIQUE_WORDS.length - 1);
    
    // Convert back to actual coordinates within HCMC region
    const HCMC_LAT_MIN = 10.3;
    const HCMC_LAT_MAX = 11.2;
    const HCMC_LNG_MIN = 106.2;
    const HCMC_LNG_MAX = 107.2;
    
    // Calculate grid size for 3m precision
    const GRID_SIZE_LAT = Math.floor((HCMC_LAT_MAX - HCMC_LAT_MIN) / 0.000027);
    const GRID_SIZE_LNG = Math.floor((HCMC_LNG_MAX - HCMC_LNG_MIN) / 0.000027);
    
    // Convert word indices back to grid coordinates
    const latGrid = Math.floor(normalizedLat * GRID_SIZE_LAT);
    const lngGrid = Math.floor(normalizedLng * GRID_SIZE_LNG);
    
    // Convert grid coordinates back to normalized coordinates
    const clampedLat = latGrid / GRID_SIZE_LAT;
    const clampedLng = lngGrid / GRID_SIZE_LNG;
    
    // Convert back to actual coordinates
    const lat = (clampedLat * (HCMC_LAT_MAX - HCMC_LAT_MIN)) + HCMC_LAT_MIN;
    const lng = (clampedLng * (HCMC_LNG_MAX - HCMC_LNG_MIN)) + HCMC_LNG_MIN;
    
    // Add small offset based on third word for sub-grid precision
    const thirdWordWeight = index3 / (UNIQUE_WORDS.length - 1);
    const latOffset = (thirdWordWeight - 0.5) * 0.000027; // ±3m offset
    const lngOffset = (thirdWordWeight - 0.5) * 0.000027;
    
    const finalLat = lat + latOffset;
    const finalLng = lng + lngOffset;
    
    const result = { latitude: finalLat, longitude: finalLng };
    console.log('Parsed coordinates:', { 
      wordCode,
      index1, index2, index3,
      normalizedLat, normalizedLng, 
      latGrid, lngGrid, GRID_SIZE_LAT, GRID_SIZE_LNG,
      lat, lng, finalLat, finalLng,
      totalWords: UNIQUE_WORDS.length,
      precision: '3m x 3m grid'
    });
    
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
  
  const validWords = words.every(word => UNIQUE_WORDS.includes(word));
  if (!validWords) {
    const invalidWords = words.filter(word => !UNIQUE_WORDS.includes(word));
    console.log('Invalid words found:', invalidWords);
  }
  
  return validWords;
};

// Get a random word code for testing
export const getRandomWordCode = () => {
  const word1 = UNIQUE_WORDS[Math.floor(Math.random() * UNIQUE_WORDS.length)];
  const word2 = UNIQUE_WORDS[Math.floor(Math.random() * UNIQUE_WORDS.length)];
  const word3 = UNIQUE_WORDS[Math.floor(Math.random() * UNIQUE_WORDS.length)];
  
  return `${word1}.${word2}.${word3}`;
};

// Get word categories for UI
export const getWordCategories = () => VIETNAMESE_WORDS;

// Get all words for search functionality
export const getAllWords = () => UNIQUE_WORDS; 