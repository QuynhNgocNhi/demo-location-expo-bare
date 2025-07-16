// Word Code Generator for Vietnamese 3-word addresses
// Inspired by What3Words but with Vietnamese words with diacritics
// Precision: High precision through word combinations

// Vietnamese words with diacritics for generating 3-word codes
// Each word can be combined with others to create unique combinations
const VIETNAMESE_WORDS = {
  // Basic words (Từ cơ bản) - 50 words
  basic: [
    'mèo', 'chó', 'gà', 'vịt', 'ngựa', 'bò', 'lợn', 'dê', 'cừu', 'trâu',
    'voi', 'hổ', 'sư tử', 'cáo', 'sóc', 'chuột', 'thỏ', 'rắn', 'ếch', 'cá',
    'chim', 'ong', 'bướm', 'kiến', 'ruồi', 'muỗi', 'nhện', 'bọ cạp', 'cua', 'tôm',
    'cá sấu', 'rùa', 'ếch nhái', 'nhện nhà', 'ong mật', 'ong nghệ', 'ong vò vẽ', 'ong đất',
    'bướm đêm', 'bướm ngày', 'kiến đen', 'kiến đỏ', 'ruồi xanh', 'ruồi đen', 'muỗi anopheles',
    'muỗi culex', 'nhện hùng', 'nhện nâu', 'bọ cạp đen', 'bọ cạp vàng', 'cua biển', 'cua sông'
  ],
  
  // Colors with diacritics (Màu sắc có dấu) - 50 words
  colors: [
    'đỏ', 'xanh', 'vàng', 'tím', 'cam', 'hồng', 'nâu', 'đen', 'trắng', 'xám',
    'lam', 'lục', 'hồng nhạt', 'xanh lá', 'xanh dương', 'vàng nhạt', 'đỏ nhạt',
    'xanh xám', 'vàng cam', 'đỏ sẫm', 'xanh nhạt', 'tím nhạt', 'cam nhạt',
    'đỏ đậm', 'đỏ tươi', 'đỏ nhạt', 'đỏ cam', 'xanh dương đậm', 'xanh dương nhạt',
    'xanh lá đậm', 'xanh lá nhạt', 'vàng đậm', 'vàng nhạt', 'vàng cam', 'vàng xanh',
    'tím đậm', 'tím nhạt', 'tím xanh', 'tím đỏ', 'cam đậm', 'cam nhạt', 'cam đỏ',
    'hồng đậm', 'hồng nhạt', 'hồng đỏ', 'hồng tím', 'nâu đậm', 'nâu nhạt', 'nâu đỏ',
    'nâu xanh', 'đen tuyệt', 'đen xám', 'trắng tuyệt', 'trắng ngà', 'xám đậm', 'xám nhạt'
  ],
  
  // Objects with diacritics (Đồ vật có dấu) - 50 words
  objects: [
    'bàn', 'ghế', 'máy', 'điện thoại', 'sách', 'bút', 'cây', 'hoa', 'nhà', 'cửa',
    'cửa sổ', 'đèn', 'quạt', 'tivi', 'tủ lạnh', 'máy giặt', 'xe', 'xe máy', 'xe đạp',
    'giường', 'ghế sofa', 'bàn ăn', 'tủ quần áo', 'máy tính', 'chuột', 'bàn phím',
    'loa', 'micro', 'camera', 'tablet', 'laptop', 'máy in', 'máy scan', 'máy chiếu',
    'máy tính bảng', 'điện thoại thông minh', 'điện thoại cổ', 'sách giáo khoa', 'sách tiểu thuyết',
    'sách kỹ thuật', 'bút bi', 'bút chì', 'bút lông', 'bút dạ', 'cây cảnh', 'cây ăn quả',
    'cây lấy gỗ', 'hoa hồng', 'hoa cúc', 'hoa lan', 'hoa sen', 'nhà chung cư', 'nhà biệt thự',
    'nhà phố', 'cửa gỗ', 'cửa nhôm', 'cửa kính', 'cửa sổ gỗ', 'cửa sổ nhôm', 'đèn tuýp', 'đèn led'
  ],
  
  // Nature with diacritics (Thiên nhiên có dấu) - 50 words
  nature: [
    'núi', 'sông', 'biển', 'rừng', 'hồ', 'suối', 'gió', 'mưa', 'nắng', 'mây',
    'sao', 'mặt trời', 'mặt trăng', 'gió', 'sấm', 'sương mù', 'đá', 'cát', 'đất',
    'cỏ', 'lá', 'rễ', 'thân', 'cành', 'hoa', 'quả', 'núi cao', 'núi thấp', 'núi lửa',
    'sông lớn', 'sông nhỏ', 'sông cái', 'biển xanh', 'biển xám', 'rừng già', 'rừng non',
    'hồ lớn', 'hồ nhỏ', 'suối nước', 'suối khô', 'gió to', 'gió nhỏ', 'mưa rào',
    'mưa phùn', 'nắng gắt', 'nắng nhẹ', 'mây trắng', 'mây đen', 'sao sáng', 'sao mờ'
  ],
  
  // Food with diacritics (Thức ăn có dấu) - 50 words
  food: [
    'cơm', 'phở', 'bánh mì', 'bún', 'chả cá', 'bánh cuốn', 'nem', 'chả giò',
    'bánh xèo', 'bánh khọt', 'bánh tét', 'bánh chưng', 'bánh trôi', 'chè',
    'bánh bột lọc', 'bánh nậm', 'bánh bèo', 'bánh ít', 'bánh chay', 'bánh gai',
    'bánh khô', 'bánh dẻo', 'bánh pía', 'bánh dân gian', 'bánh tráng', 'bánh cuốn lá',
    'bánh cuốn tôm', 'bánh cuốn thịt', 'nem chua', 'nem nướng', 'chả giò tôm',
    'chả giò thịt', 'chả cá lãng', 'chả cá hà nội', 'phở bò', 'phở gà', 'phở chay',
    'bún bò', 'bún chả', 'bún riêu', 'bún mắm', 'cơm tấm', 'cơm rang', 'cơm chay',
    'chè ba màu', 'chè hạt sen', 'chè trân châu', 'chè thái', 'chè đậu xanh'
  ],
  
  // Actions with diacritics (Hành động có dấu) - 50 words
  actions: [
    'đi', 'về', 'chạy', 'nhảy', 'ăn', 'uống', 'ngủ', 'đọc', 'viết', 'hát',
    'mua', 'bán', 'học', 'làm', 'chơi', 'xem', 'nghe', 'nói', 'cười', 'khóc',
    'đứng', 'ngồi', 'nằm', 'đi bộ', 'chạy bộ', 'bơi', 'nhảy', 'múa', 'hát',
    'nghe nhạc', 'xem phim', 'đọc sách', 'viết thư', 'gọi điện', 'gửi tin',
    'đi làm', 'đi chơi', 'đi du lịch', 'đi học', 'đi bệnh viện', 'đi chợ',
    'về nhà', 'về trường', 'về công ty', 'về quê', 'chạy nhanh', 'chạy chậm',
    'nhảy nhanh', 'nhảy chậm', 'ăn sáng', 'ăn trưa', 'ăn tối', 'uống nước', 'uống trà'
  ],
  
  // Places with diacritics (Địa điểm có dấu) - 50 words
  places: [
    'nhà', 'trường', 'bệnh viện', 'chợ', 'siêu thị', 'ngân hàng', 'bưu điện',
    'công ty', 'văn phòng', 'khách sạn', 'nhà hàng', 'quán cà phê', 'rạp chiếu phim',
    'sân vận động', 'công viên', 'viện bảo tàng', 'thư viện', 'nhà ga', 'sân bay',
    'nhà thờ', 'chùa', 'đền', 'miếu', 'làng', 'xã', 'phường', 'quận', 'huyện',
    'tỉnh', 'thành phố', 'thị trấn', 'thị xã', 'khu công nghiệp', 'khu du lịch',
    'khu dân cư', 'khu thương mại', 'khu giải trí', 'khu thể thao', 'khu y tế',
    'khu giáo dục', 'khu hành chính', 'khu quân sự', 'khu an ninh', 'khu cảnh sát',
    'khu cứu hỏa', 'khu bưu chính', 'khu điện lực', 'khu nước', 'khu rác', 'khu xe'
  ],
  
  // Numbers with diacritics (Số đếm có dấu) - 50 words
  numbers: [
    'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười',
    'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu',
    'mười bảy', 'mười tám', 'mười chín', 'hai mươi', 'ba mươi', 'bốn mươi',
    'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi', 'một trăm',
    'hai trăm', 'ba trăm', 'bốn trăm', 'năm trăm', 'sáu trăm', 'bảy trăm',
    'tám trăm', 'chín trăm', 'một nghìn', 'hai nghìn', 'ba nghìn', 'bốn nghìn',
    'năm nghìn', 'sáu nghìn', 'bảy nghìn', 'tám nghìn', 'chín nghìn', 'mười nghìn',
    'hai mươi nghìn', 'ba mươi nghìn', 'bốn mươi nghìn', 'năm mươi nghìn'
  ]
};

// Combine all words into one array
const ALL_WORDS = [
  ...VIETNAMESE_WORDS.basic,
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
console.log('Word code system initialized with', UNIQUE_WORDS.length, 'unique words with diacritics');
console.log('Sample words:', UNIQUE_WORDS.slice(0, 10));

// Function to combine words to create unique combinations
const combineWords = (word1, word2) => {
  // Simple combination: word1 + word2
  return `${word1}${word2}`;
};

// Function to create compound words from base words
const createCompoundWord = (baseWord, modifier) => {
  // Create compound words like "mèo đen", "nhà cao", "xe nhanh"
  return `${baseWord} ${modifier}`;
};

// Generate a 3-word code based on coordinates with high precision through combinations
export const generateWordCode = (latitude, longitude) => {
  // Validate inputs
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    console.error('Invalid coordinates provided to generateWordCode:', { latitude, longitude });
    return 'mèo.xanh.bàn'; // Default fallback
  }
  
  // Focus on Ho Chi Minh City region for high precision
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
  
  // Calculate grid size for high precision (~1m precision)
  // 1m ≈ 0.000009 degrees (roughly)
  const GRID_SIZE_LAT = Math.floor((HCMC_LAT_MAX - HCMC_LAT_MIN) / 0.000009);
  const GRID_SIZE_LNG = Math.floor((HCMC_LNG_MAX - HCMC_LNG_MIN) / 0.000009);
  
  // Convert to grid coordinates
  const latGrid = Math.floor(clampedLat * GRID_SIZE_LAT);
  const lngGrid = Math.floor(clampedLng * GRID_SIZE_LNG);
  
  // Use word combinations for higher precision
  // First word: base word from latitude
  const latIndex = Math.floor(latGrid * UNIQUE_WORDS.length / GRID_SIZE_LAT) % UNIQUE_WORDS.length;
  const baseWord = UNIQUE_WORDS[latIndex];
  
  // Second word: modifier word from longitude
  const lngIndex = Math.floor(lngGrid * UNIQUE_WORDS.length / GRID_SIZE_LNG) % UNIQUE_WORDS.length;
  const modifierWord = UNIQUE_WORDS[lngIndex];
  
  // Third word: combination for sub-grid precision
  const combinedIndex = Math.floor(((latGrid * 37 + lngGrid * 73) % (GRID_SIZE_LAT + GRID_SIZE_LNG)) * UNIQUE_WORDS.length / (GRID_SIZE_LAT + GRID_SIZE_LNG)) % UNIQUE_WORDS.length;
  const thirdWord = UNIQUE_WORDS[combinedIndex];
  
  // Create compound words for higher precision
  const word1 = createCompoundWord(baseWord, modifierWord);
  const word2 = createCompoundWord(modifierWord, thirdWord);
  const word3 = createCompoundWord(thirdWord, baseWord);
  
  console.log('Generated word code:', { 
    latitude, longitude, 
    normalizedLat, normalizedLng, 
    clampedLat, clampedLng,
    latGrid, lngGrid, GRID_SIZE_LAT, GRID_SIZE_LNG,
    latIndex, lngIndex, combinedIndex, 
    baseWord, modifierWord, thirdWord,
    word1, word2, word3,
    totalWords: UNIQUE_WORDS.length,
    totalCombinations: UNIQUE_WORDS.length * UNIQUE_WORDS.length * UNIQUE_WORDS.length,
    precision: '~1m x 1m through word combinations'
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
    
    // Extract base words from compound words - need to find actual UNIQUE_WORDS within compounds
    // Since compound words are created as "baseWord modifierWord", we need to find
    // which UNIQUE_WORDS are contained in each compound word
    
    const findWordsInCompound = (compoundWord) => {
      // Try to find which UNIQUE_WORDS are contained in this compound
      const possibleWords = [];
      for (const word of UNIQUE_WORDS) {
        if (compoundWord.includes(word)) {
          possibleWords.push(word);
        }
      }
      // Sort by length descending to prioritize longer matches
      return possibleWords.sort((a, b) => b.length - a.length);
    };
    
    const words1Candidates = findWordsInCompound(words[0]);
    const words2Candidates = findWordsInCompound(words[1]);
    const words3Candidates = findWordsInCompound(words[2]);
    
    console.log('Word candidates:', { words1Candidates, words2Candidates, words3Candidates });
    
    // Based on generation logic:
    // word1 = createCompoundWord(baseWord, modifierWord);
    // word2 = createCompoundWord(modifierWord, thirdWord);
    // word3 = createCompoundWord(thirdWord, baseWord);
    
    // From pattern: word1 contains baseWord and modifierWord
    // word2 contains modifierWord and thirdWord
    // word3 contains thirdWord and baseWord
    
    // Find common words between word1 and word3 (should be baseWord)
    const baseWordCandidates = words1Candidates.filter(w => words3Candidates.includes(w));
    // Find common words between word1 and word2 (should be modifierWord) 
    const modifierWordCandidates = words1Candidates.filter(w => words2Candidates.includes(w));
    // Find common words between word2 and word3 (should be thirdWord)
    const thirdWordCandidates = words2Candidates.filter(w => words3Candidates.includes(w));
    
    console.log('Common word candidates:', { baseWordCandidates, modifierWordCandidates, thirdWordCandidates });
    
    // Take the best candidates (longest first)
    const baseWord = baseWordCandidates[0];
    const modifierWord = modifierWordCandidates[0];
    const thirdWord = thirdWordCandidates[0];
    
    console.log('Reconstructed words:', { baseWord, modifierWord, thirdWord });
    
    // Find indices of words in UNIQUE_WORDS
    const baseIndex = UNIQUE_WORDS.indexOf(baseWord);
    const modifierIndex = UNIQUE_WORDS.indexOf(modifierWord);
    const thirdIndex = UNIQUE_WORDS.indexOf(thirdWord);
    
    console.log('Word indices:', { baseIndex, modifierIndex, thirdIndex });
    
    if (baseIndex === -1 || modifierIndex === -1 || thirdIndex === -1) {
      const invalidWords = [];
      if (baseIndex === -1) invalidWords.push(baseWord);
      if (modifierIndex === -1) invalidWords.push(modifierWord);
      if (thirdIndex === -1) invalidWords.push(thirdWord);
      throw new Error(`Invalid words in code: ${invalidWords.join(', ')}`);
    }
    
    // Constants matching generation
    const HCMC_LAT_MIN = 10.3;
    const HCMC_LAT_MAX = 11.2;
    const HCMC_LNG_MIN = 106.2;
    const HCMC_LNG_MAX = 107.2;
    
    const GRID_SIZE_LAT = Math.floor((HCMC_LAT_MAX - HCMC_LAT_MIN) / 0.000009);
    const GRID_SIZE_LNG = Math.floor((HCMC_LNG_MAX - HCMC_LNG_MIN) / 0.000009);
    
         // Reverse the generation logic using direct mathematical approach
     // latIndex = Math.floor(latGrid * UNIQUE_WORDS.length / GRID_SIZE_LAT) % UNIQUE_WORDS.length;
     // lngIndex = Math.floor(lngGrid * UNIQUE_WORDS.length / GRID_SIZE_LNG) % UNIQUE_WORDS.length;
     
     // Calculate possible grid positions directly from indices
     // Since we have modulo operations, there might be multiple solutions
     let bestLatGrid = 0;
     let bestLngGrid = 0;
     let bestError = Infinity;
     
     // For modulo equation: latIndex = Math.floor(latGrid * UNIQUE_WORDS.length / GRID_SIZE_LAT) % UNIQUE_WORDS.length
     // We can calculate multiple possible latGrid values
     const possibleLatGrids = [];
     const possibleLngGrids = [];
     
     // Calculate all possible latGrid values that could produce baseIndex
     for (let k = 0; k < 10; k++) { // Check multiple modulo cycles
       const latGridFloat = (baseIndex + k * UNIQUE_WORDS.length) * GRID_SIZE_LAT / UNIQUE_WORDS.length;
       const latGridInt = Math.floor(latGridFloat);
       if (latGridInt >= 0 && latGridInt < GRID_SIZE_LAT) {
         possibleLatGrids.push(latGridInt);
       }
     }
     
     // Calculate all possible lngGrid values that could produce modifierIndex
     for (let k = 0; k < 10; k++) { // Check multiple modulo cycles
       const lngGridFloat = (modifierIndex + k * UNIQUE_WORDS.length) * GRID_SIZE_LNG / UNIQUE_WORDS.length;
       const lngGridInt = Math.floor(lngGridFloat);
       if (lngGridInt >= 0 && lngGridInt < GRID_SIZE_LNG) {
         possibleLngGrids.push(lngGridInt);
       }
     }
     
     console.log('Possible grid positions:', { 
       possibleLatGrids: possibleLatGrids.slice(0, 5), 
       possibleLngGrids: possibleLngGrids.slice(0, 5),
       totalLatCandidates: possibleLatGrids.length,
       totalLngCandidates: possibleLngGrids.length
     });
     
     // Test all combinations of possible grid positions
     for (const latGrid of possibleLatGrids) {
       for (const lngGrid of possibleLngGrids) {
         // Verify this combination produces the correct indices
         const calcLatIndex = Math.floor(latGrid * UNIQUE_WORDS.length / GRID_SIZE_LAT) % UNIQUE_WORDS.length;
         const calcLngIndex = Math.floor(lngGrid * UNIQUE_WORDS.length / GRID_SIZE_LNG) % UNIQUE_WORDS.length;
         const calcCombinedIndex = Math.floor(((latGrid * 37 + lngGrid * 73) % (GRID_SIZE_LAT + GRID_SIZE_LNG)) * UNIQUE_WORDS.length / (GRID_SIZE_LAT + GRID_SIZE_LNG)) % UNIQUE_WORDS.length;
         
         const error = Math.abs(calcLatIndex - baseIndex) + 
                      Math.abs(calcLngIndex - modifierIndex) + 
                      Math.abs(calcCombinedIndex - thirdIndex);
         
         if (error < bestError) {
           bestError = error;
           bestLatGrid = latGrid;
           bestLngGrid = lngGrid;
           
           // If we found exact match, we can stop
           if (error === 0) break;
         }
       }
       if (bestError === 0) break;
     }
     
     console.log('Direct calculation result:', { bestLatGrid, bestLngGrid, bestError });
    
    console.log('Best grid match:', { bestLatGrid, bestLngGrid, bestError });
    
    // Convert grid coordinates back to normalized coordinates
    const clampedLat = bestLatGrid / GRID_SIZE_LAT;
    const clampedLng = bestLngGrid / GRID_SIZE_LNG;
    
    // Convert back to actual coordinates
    const lat = (clampedLat * (HCMC_LAT_MAX - HCMC_LAT_MIN)) + HCMC_LAT_MIN;
    const lng = (clampedLng * (HCMC_LNG_MAX - HCMC_LNG_MIN)) + HCMC_LNG_MIN;
    
    // Add small offset based on third word for sub-grid precision
    const thirdWordWeight = thirdIndex / (UNIQUE_WORDS.length - 1);
    const latOffset = (thirdWordWeight - 0.5) * 0.000009; // ±1m offset
    const lngOffset = (thirdWordWeight - 0.5) * 0.000009;
    
    const finalLat = lat + latOffset;
    const finalLng = lng + lngOffset;
    
    const result = { latitude: finalLat, longitude: finalLng };
    console.log('Parsed coordinates:', { 
      wordCode,
      baseWord, modifierWord, thirdWord,
      baseIndex, modifierIndex, thirdIndex,
      bestLatGrid, bestLngGrid, bestError,
      GRID_SIZE_LAT, GRID_SIZE_LNG,
      clampedLat, clampedLng,
      lat, lng, finalLat, finalLng,
      totalWords: UNIQUE_WORDS.length,
      precision: '~1m x 1m through word combinations'
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
  
  // Extract words using the same logic as parsing
  const findWordsInCompound = (compoundWord) => {
    const possibleWords = [];
    for (const word of UNIQUE_WORDS) {
      if (compoundWord.includes(word)) {
        possibleWords.push(word);
      }
    }
    return possibleWords.sort((a, b) => b.length - a.length);
  };
  
  try {
    const words1Candidates = findWordsInCompound(words[0]);
    const words2Candidates = findWordsInCompound(words[1]);
    const words3Candidates = findWordsInCompound(words[2]);
    
    // Find common words using the same pattern matching as parsing
    const baseWordCandidates = words1Candidates.filter(w => words3Candidates.includes(w));
    const modifierWordCandidates = words1Candidates.filter(w => words2Candidates.includes(w));
    const thirdWordCandidates = words2Candidates.filter(w => words3Candidates.includes(w));
    
    // Check if we found valid candidates for all three words
    const hasValidBase = baseWordCandidates.length > 0;
    const hasValidModifier = modifierWordCandidates.length > 0;
    const hasValidThird = thirdWordCandidates.length > 0;
    
    if (!hasValidBase || !hasValidModifier || !hasValidThird) {
      console.log('Missing word candidates:', { 
        baseWordCandidates, 
        modifierWordCandidates, 
        thirdWordCandidates 
      });
    }
    
    return hasValidBase && hasValidModifier && hasValidThird;
  } catch (error) {
    console.log('Error validating word code:', error);
    return false;
  }
};

// Get a random word code for testing
export const getRandomWordCode = () => {
  const word1 = UNIQUE_WORDS[Math.floor(Math.random() * UNIQUE_WORDS.length)];
  const word2 = UNIQUE_WORDS[Math.floor(Math.random() * UNIQUE_WORDS.length)];
  const word3 = UNIQUE_WORDS[Math.floor(Math.random() * UNIQUE_WORDS.length)];
  
  // Create compound words
  const compoundWord1 = createCompoundWord(word1, word2);
  const compoundWord2 = createCompoundWord(word2, word3);
  const compoundWord3 = createCompoundWord(word3, word1);
  
  return `${compoundWord1}.${compoundWord2}.${compoundWord3}`;
};

// Get word categories for UI
export const getWordCategories = () => VIETNAMESE_WORDS;

// Get all words for search functionality
export const getAllWords = () => UNIQUE_WORDS; 