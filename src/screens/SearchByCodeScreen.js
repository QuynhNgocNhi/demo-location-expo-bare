import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Clipboard,
  ScrollView,
} from 'react-native';
import { parseWordCode, isValidWordCode } from '../utils/wordCodeGenerator';

const SearchByCodeScreen = ({ navigation }) => {
  const [wordCode, setWordCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!wordCode || !wordCode.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã 3 từ');
      return;
    }

    const trimmedCode = wordCode.trim();
    if (!isValidWordCode(trimmedCode)) {
      Alert.alert(
        'Mã không hợp lệ', 
        'Mã 3 từ phải có định dạng: từ1.từ2.từ3\n\nVí dụ: meo.xanh.ban',
        [
          { text: 'Xem ví dụ', onPress: () => handleCopyExample('meo.xanh.ban') },
          { text: 'OK' }
        ]
      );
      return;
    }

    setIsSearching(true);

    try {
      const coordinates = parseWordCode(trimmedCode);
      
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        // Navigate to LocationTracker with the found coordinates
        if (navigation && typeof navigation.navigate === 'function') {
          navigation.navigate('LocationTracker', {
            searchMode: true,
            targetLocation: coordinates,
            wordCode: trimmedCode,
          });
        } else {
          console.error('Navigation is not available');
        }
      } else {
        Alert.alert('Lỗi', 'Không thể tìm thấy vị trí cho mã này');
      }
    } catch (error) {
      console.error('Error parsing word code:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tìm kiếm vị trí');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setWordCode('');
  };

  const handlePaste = async () => {
    try {
      const content = await Clipboard.getString();
      if (content) {
        const formattedContent = formatWordCode(content);
        setWordCode(formattedContent);
      }
    } catch (error) {
      console.log('Error pasting from clipboard:', error);
    }
  };

  const handleCopyExample = async (example) => {
    try {
      await Clipboard.setString(example);
      Alert.alert('Thành công', 'Đã copy mã vào clipboard');
    } catch (error) {
      console.log('Error copying to clipboard:', error);
    }
  };

  const handleGoBack = () => {
    if (navigation && typeof navigation.goBack === 'function') {
      navigation.goBack();
    } else {
      console.error('Navigation is not available');
    }
  };

  const formatWordCode = (text) => {
    if (!text || typeof text !== 'string') return '';
    
    // Cho phép dấu chấm, chữ cái, dấu gạch ngang và khoảng trắng
    const cleanedText = text.toLowerCase()
      .replace(/[^a-z\-\.\s]/g, '') // Chỉ giữ lại chữ cái, dấu gạch ngang, dấu chấm và khoảng trắng
      .replace(/\s+/g, '.') // Thay khoảng trắng bằng dấu chấm
      .replace(/\.+/g, '.') // Thay nhiều dấu chấm liên tiếp bằng một dấu chấm
      .replace(/^\.+|\.+$/g, ''); // Xóa dấu chấm ở đầu và cuối
    
    // Tách thành các từ và giới hạn 3 từ
    const words = cleanedText.split('.');
    
    if (words.length <= 3) {
      return words.join('.');
    }
    return words.slice(0, 3).join('.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView>    
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Text style={styles.backButtonText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Tìm kiếm bằng mã</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Nhập mã 3 từ</Text>
            <Text style={styles.infoDescription}>
              Nhập mã 3 từ tiếng Việt để tìm vị trí và được hướng dẫn đi bộ
            </Text>
            <Text style={styles.infoTip}>
              💡 Bạn có thể paste mã từ clipboard hoặc nhấn vào ví dụ để copy
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mã 3 từ:</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.textInput,
                  wordCode.trim() && !isValidWordCode(wordCode.trim()) && styles.textInputError
                ]}
                value={wordCode}
                onChangeText={(text) => setWordCode(formatWordCode(text))}
                placeholder="ví dụ: meo.xanh.ban"
                placeholderTextColor="#bdc3c7"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={30}
                selectTextOnFocus={true}
                contextMenuHidden={false}
                keyboardType="default"
              />
              <View style={styles.inputButtons}>
                {wordCode.length > 0 && (
                  <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                    <Text style={styles.clearButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
                  <Text style={styles.pasteButtonText}>📋</Text>
                </TouchableOpacity>
              </View>
            </View>
            {wordCode.trim() && (
              <Text style={[
                styles.validationText,
                isValidWordCode(wordCode.trim()) ? styles.validationSuccess : styles.validationError
              ]}>
                {isValidWordCode(wordCode.trim()) ? '✅ Mã hợp lệ' : '❌ Mã không hợp lệ'}
              </Text>
            )}
          </View>

          <View style={styles.exampleSection}>
            <Text style={styles.exampleTitle}>Ví dụ mã 3 từ (nhấn để copy):</Text>
            <View style={styles.examples}>
              <TouchableOpacity 
                style={styles.example} 
                onPress={() => handleCopyExample('meo.xanh.ban')}
              >
                <Text style={styles.exampleText}>meo.xanh.ban</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.example} 
                onPress={() => handleCopyExample('cho.do.nha')}
              >
                <Text style={styles.exampleText}>cho.do.nha</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.example} 
                onPress={() => handleCopyExample('ga.vang.cay')}
              >
                <Text style={styles.exampleText}>ga.vang.cay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </ScrollView>
        <TouchableOpacity
            style={[
              styles.searchButton,
              (!wordCode.trim() || isSearching) && styles.disabledButton
            ]}
            onPress={handleSearch}
            disabled={!wordCode.trim() || isSearching}
            activeOpacity={0.8}
          >
            <Text style={styles.searchButtonText}>
              {isSearching ? 'Đang tìm kiếm...' : 'Tìm kiếm vị trí'}
            </Text>
          </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  infoTip: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 10,
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 0, // Remove default padding
  },
  textInputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  validationText: {
    fontSize: 14,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  validationSuccess: {
    color: '#27ae60',
  },
  validationError: {
    color: '#e74c3c',
  },
  inputButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  clearButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#bdc3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pasteButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pasteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  exampleSection: {
    marginBottom: 30,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 12,
  },
  examples: {
    gap: 8,
  },
  example: {
    fontSize: 14,
    color: '#7f8c8d',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#ecf0f1',
    padding: 8,
    borderRadius: 6,
  },
  exampleText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  searchButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginHorizontal: 16,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
    elevation: 0,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  helpSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  helpSteps: {
    gap: 12,
  },
  helpStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpStepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3498db',
    color: 'white',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 12,
  },
  helpStepText: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
  },
  wordListSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  wordListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  wordListText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default SearchByCodeScreen; 