import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = ({ navigation }) => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedLocations();
  }, []);

  const loadSavedLocations = async () => {
    try {
      const savedData = await AsyncStorage.getItem('savedLocations');
      if (savedData) {
        const locations = JSON.parse(savedData);
        if (Array.isArray(locations)) {
          setSavedLocations(locations);
        } else {
          console.error('Invalid saved locations data:', locations);
          setSavedLocations([]);
        }
      } else {
        setSavedLocations([]);
      }
    } catch (error) {
      console.log('Error loading saved locations:', error);
      setSavedLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (index) => {
    if (typeof index !== 'number' || index < 0 || index >= savedLocations.length) {
      console.error('Invalid index for deletion:', index);
      return;
    }
    
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa vị trí này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const newLocations = savedLocations.filter((_, i) => i !== index);
              await AsyncStorage.setItem('savedLocations', JSON.stringify(newLocations));
              setSavedLocations(newLocations);
            } catch (error) {
              console.log('Error deleting location:', error);
            }
          },
        },
      ]
    );
  };

  const shareLocation = async (location) => {
    if (!location || !location.wordCode || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      console.error('Invalid location data for sharing:', location);
      return;
    }
    
    try {
      await Share.share({
        message: `Tìm tôi tại vị trí này: ${location.wordCode}\n\nTọa độ: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}\n\nSử dụng ứng dụng Lost & Found Buddy để tìm kiếm vị trí này.`,
        title: 'Chia sẻ vị trí',
      });
    } catch (error) {
      console.log('Error sharing location:', error);
    }
  };

  const navigateToLocation = (location) => {
    if (!location || !location.wordCode || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      console.error('Invalid location data for navigation:', location);
      return;
    }
    
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('LocationTracker', {
        searchMode: true,
        targetLocation: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        wordCode: location.wordCode,
      });
    } else {
      console.error('Navigation is not available');
    }
  };

  const handleGoBack = () => {
    if (navigation && typeof navigation.goBack === 'function') {
      navigation.goBack();
    } else {
      console.error('Navigation is not available');
    }
  };

  const handleNavigateToTracker = () => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('LocationTracker');
    } else {
      console.error('Navigation is not available');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || typeof timestamp !== 'number') {
      return 'Không xác định';
    }
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Không xác định';
      }
      return date.toLocaleString('vi-VN');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Không xác định';
    }
  };

  const renderLocationItem = ({ item, index }) => {
    if (!item || !item.wordCode || typeof item.latitude !== 'number' || typeof item.longitude !== 'number') {
      return null; // Skip invalid items
    }
    
    return (
      <View style={styles.locationItem}>
        <View style={styles.locationHeader}>
          <Text style={styles.wordCode}>{item.wordCode}</Text>
          <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
        </View>
        
        <Text style={styles.coordinates}>
          {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.navigateButton]}
            onPress={() => navigateToLocation(item)}
          >
            <Text style={styles.actionButtonText}>Đi đến</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={() => shareLocation(item)}
          >
            <Text style={styles.actionButtonText}>Chia sẻ</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteLocation(index)}
          >
            <Text style={styles.actionButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const clearAllLocations = async () => {
    if (!Array.isArray(savedLocations) || savedLocations.length === 0) {
      return;
    }
    
    Alert.alert(
      'Xác nhận xóa tất cả',
      'Bạn có chắc muốn xóa tất cả vị trí đã lưu?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa tất cả',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('savedLocations');
              setSavedLocations([]);
            } catch (error) {
              console.log('Error clearing locations:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Lịch sử vị trí</Text>
      </View>

      {savedLocations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Chưa có vị trí nào được lưu</Text>
          <Text style={styles.emptyText}>
            Lưu vị trí đầu tiên để bắt đầu sử dụng ứng dụng
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleNavigateToTracker}
          >
            <Text style={styles.startButtonText}>Lưu vị trí đầu tiên</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Đã lưu {savedLocations.length} vị trí
            </Text>
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={clearAllLocations}
            >
              <Text style={styles.clearAllButtonText}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={savedLocations}
            renderItem={renderLocationItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearAllButtonText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    fontFamily: 'monospace',
  },
  timestamp: {
    fontSize: 12,
    color: '#95a5a6',
  },
  coordinates: {
    fontSize: 12,
    color: '#7f8c8d',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  navigateButton: {
    backgroundColor: '#2ecc71',
  },
  shareButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default HistoryScreen; 