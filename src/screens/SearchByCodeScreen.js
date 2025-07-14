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

    if (!isValidWordCode(wordCode.trim())) {
      Alert.alert('Lỗi', 'Mã 3 từ không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    setIsSearching(true);

    try {
      const coordinates = parseWordCode(wordCode.trim());
      
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        // Navigate to LocationTracker with the found coordinates
        if (navigation && typeof navigation.navigate === 'function') {
          navigation.navigate('LocationTracker', {
            searchMode: true,
            targetLocation: coordinates,
            wordCode: wordCode.trim(),
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

  const handleGoBack = () => {
    if (navigation && typeof navigation.goBack === 'function') {
      navigation.goBack();
    } else {
      console.error('Navigation is not available');
    }
  };

  const formatWordCode = (text) => {
    if (!text || typeof text !== 'string') return '';
    // Auto-format: add dots after each word
    const words = text.toLowerCase().replace(/[^a-z-]/g, '').split('.');
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
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mã 3 từ:</Text>
            <TextInput
              style={styles.textInput}
              value={wordCode}
              onChangeText={(text) => setWordCode(formatWordCode(text))}
              placeholder="ví dụ: meo.xanh.ban"
              placeholderTextColor="#bdc3c7"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
            />
            {wordCode.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.exampleSection}>
            <Text style={styles.exampleTitle}>Ví dụ mã 3 từ:</Text>
            <View style={styles.examples}>
              <Text style={styles.example}>meo.xanh.ban</Text>
              <Text style={styles.example}>cho.do.nha</Text>
              <Text style={styles.example}>ga.vang.cay</Text>
            </View>
          </View>

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

          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Cách sử dụng:</Text>
            <View style={styles.helpSteps}>
              <View style={styles.helpStep}>
                <Text style={styles.helpStepNumber}>1</Text>
                <Text style={styles.helpStepText}>Nhập mã 3 từ tiếng Việt</Text>
              </View>
              <View style={styles.helpStep}>
                <Text style={styles.helpStepNumber}>2</Text>
                <Text style={styles.helpStepText}>Nhấn "Tìm kiếm vị trí"</Text>
              </View>
              <View style={styles.helpStep}>
                <Text style={styles.helpStepNumber}>3</Text>
                <Text style={styles.helpStepText}>Được hướng dẫn đi bộ đến vị trí</Text>
              </View>
            </View>
          </View>
        </View>
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
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    position: 'relative',
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#bdc3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
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
  searchButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
});

export default SearchByCodeScreen; 