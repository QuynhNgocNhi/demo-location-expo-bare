import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, Alert, SafeAreaView, Share } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { generateWordCode, parseWordCode } from '../utils/wordCodeGenerator';
import Compass from '../components/Compass';
import LocationInfo from '../components/LocationInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationTrackerScreen = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedWordCode, setSelectedWordCode] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [mapError, setMapError] = useState(false);
  const [wordCode, setWordCode] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [targetLocation, setTargetLocation] = useState(null);
  const [showLocationInfo, setShowLocationInfo] = useState(true);
  const mapRef = useRef(null);

  // Check if we're in search mode
  useEffect(() => {
    if (route.params?.searchMode) {
      setIsSearchMode(true);
      setTargetLocation(route.params.targetLocation);
      setWordCode(route.params.wordCode);
    }
  }, [route.params]);

  // Xin quyền vị trí và lấy vị trí hiện tại
  useEffect(() => {
    const getLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Cần quyền truy cập vị trí để sử dụng ứng dụng');
          return;
        }
        
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(currentLocation.coords);
      } catch (err) {
        console.log('Error getting location permission:', err);
        setError('Không thể lấy vị trí hiện tại');
      }
    };

    getLocationPermission();
  }, []);

  // Theo dõi vị trí liên tục
  useEffect(() => {
    if (!location) return;

    let locationSubscription;
    const watchLocation = async () => {
      try {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 5, // Cập nhật mỗi 5 mét
            timeInterval: 3000, // Cập nhật mỗi 3 giây
          },
          (newLocation) => {
            setLocation(newLocation.coords);
          }
        );
      } catch (err) {
        console.log('Error watching location:', err);
      }
    };

    watchLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []); // Remove location from dependency array to prevent infinite loop

  // Tính khoảng cách
  useEffect(() => {
    if (location && (savedLocation || targetLocation)) {
      const target = savedLocation || targetLocation;
      console.log('Calculating distance between:', {
        current: { lat: location.latitude, lng: location.longitude },
        target: { lat: target.latitude, lng: target.longitude }
      });
      
      const d = getDistanceFromLatLonInMeters(
        location.latitude,
        location.longitude,
        target.latitude,
        target.longitude
      );
      
      console.log('Calculated distance:', d, 'meters');
      setDistance(d);
    } else {
      setDistance(null);
    }
  }, [location, savedLocation, targetLocation]);

  // Hàm xử lý khi tap vào bản đồ
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log('Map tapped at:', { latitude, longitude });
    
    const newSelectedLocation = { latitude, longitude };
    setSelectedLocation(newSelectedLocation);
    
    // Tạo mã từ cho vị trí được chọn
    const newWordCode = generateWordCode(latitude, longitude);
    setSelectedWordCode(newWordCode);
    
    console.log('Generated word code for selected location:', newWordCode);
  };

  // Hàm lưu vị trí được chọn
  const handleSaveSelectedLocation = async () => {
    if (selectedLocation && selectedWordCode) {
      const locationData = {
        ...selectedLocation,
        wordCode: selectedWordCode,
        timestamp: Date.now(),
      };
      
      setSavedLocation({ ...selectedLocation });
      setWordCode(selectedWordCode);
      
      // Lưu vào AsyncStorage
      try {
        const existingData = await AsyncStorage.getItem('savedLocations');
        const savedLocations = existingData ? JSON.parse(existingData) : [];
        savedLocations.unshift(locationData); // Thêm vào đầu danh sách
        await AsyncStorage.setItem('savedLocations', JSON.stringify(savedLocations));
      } catch (error) {
        console.log('Error saving selected location:', error);
      }
      
      Alert.alert(
        'Thành công!', 
        `Đã lưu vị trí được chọn và tạo mã:\n\n${selectedWordCode}\n\nBạn có thể chia sẻ mã này cho người khác.`,
        [
          { text: 'Chia sẻ', onPress: () => handleShareWordCode(selectedWordCode) },
          { text: 'OK' }
        ]
      );
    } else {
      Alert.alert('Lỗi', 'Không có vị trí nào được chọn');
    }
  };

  // Hàm xóa vị trí được chọn
  const handleClearSelectedLocation = () => {
    setSelectedLocation(null);
    setSelectedWordCode(null);
  };

  // Hàm lưu vị trí hiện tại và tạo mã
  const handleSaveLocation = async () => {
    if (location && location.latitude && location.longitude) {
      const newWordCode = generateWordCode(location.latitude, location.longitude);
      const locationData = {
        ...location,
        wordCode: newWordCode,
        timestamp: Date.now(),
      };
      
      setSavedLocation({ ...location });
      setWordCode(newWordCode);
      
      // Lưu vào AsyncStorage
      try {
        const existingData = await AsyncStorage.getItem('savedLocations');
        const savedLocations = existingData ? JSON.parse(existingData) : [];
        savedLocations.unshift(locationData); // Thêm vào đầu danh sách
        await AsyncStorage.setItem('savedLocations', JSON.stringify(savedLocations));
      } catch (error) {
        console.log('Error saving location:', error);
      }
      
      Alert.alert(
        'Thành công!', 
        `Đã lưu vị trí và tạo mã:\n\n${newWordCode}\n\nBạn có thể chia sẻ mã này cho người khác.`,
        [
          { text: 'Chia sẻ', onPress: () => handleShareWordCode(newWordCode) },
          { text: 'OK' }
        ]
      );
    } else {
      Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại');
    }
  };

  const handleGoBack = () => {
    if (navigation && typeof navigation.goBack === 'function') {
      navigation.goBack();
    } else {
      console.error('Navigation is not available');
    }
  };

  // Hàm chia sẻ mã 3 từ
  const handleShareWordCode = async (code) => {
    if (!code || typeof code !== 'string') {
      console.error('Invalid code for sharing:', code);
      return;
    }
    
    try {
      await Share.share({
        message: code,
        title: 'Chia sẻ vị trí',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  // Hàm tính khoảng cách giữa 2 điểm (Haversine formula)
  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    // Validate inputs
    if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || 
        typeof lat2 !== 'number' || typeof lon2 !== 'number') {
      console.error('Invalid coordinates for distance calculation:', { lat1, lon1, lat2, lon2 });
      return 0;
    }
    
    // Check if coordinates are the same
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    }
    
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    
    const R = 6371000; // Bán kính Trái Đất (m)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    console.log('Distance calculation details:', {
      lat1, lon1, lat2, lon2,
      dLat: dLat * (180 / Math.PI), // Convert back to degrees for debugging
      dLon: dLon * (180 / Math.PI),
      distance
    });
    
    return Math.max(0, distance); // Ensure non-negative distance
  }

  // Test distance calculation on mount
  useEffect(() => {
    // Test case: Hanoi to Ho Chi Minh City (should be ~1700km)
    const hanoi = { lat: 21.0285, lng: 105.8542 };
    const hcmc = { lat: 10.8231, lng: 106.6297 };
    const testDistance = getDistanceFromLatLonInMeters(hanoi.lat, hanoi.lng, hcmc.lat, hcmc.lng);
    console.log('Test distance Hanoi to HCMC:', testDistance, 'meters (should be ~1700000m)');
    
    // Test case: Same location (should be 0)
    const sameLocation = getDistanceFromLatLonInMeters(hanoi.lat, hanoi.lng, hanoi.lat, hanoi.lng);
    console.log('Test distance same location:', sameLocation, 'meters (should be 0)');
    
    // Test word code generation and parsing
    console.log('=== Testing Word Code System ===');
    const testLat = 10.8760912;
    const testLng = 106.8087224;
    const generatedCode = generateWordCode(testLat, testLng);
    console.log('Generated code for', testLat, testLng, ':', generatedCode);
    
    const parsedCoords = parseWordCode(generatedCode);
    console.log('Parsed back to:', parsedCoords);
    
    if (parsedCoords) {
      const distance = getDistanceFromLatLonInMeters(testLat, testLng, parsedCoords.latitude, parsedCoords.longitude);
      console.log('Distance between original and parsed:', distance, 'meters');
    }
  }, []);

  // Hàm tính hướng đơn giản
  const getDirectionText = () => {
    if (!location || (!savedLocation && !targetLocation)) return '';
    
    const target = savedLocation || targetLocation;
    const dLat = target.latitude - location.latitude;
    const dLon = target.longitude - location.longitude;
    
    if (Math.abs(dLat) > Math.abs(dLon)) {
      return dLat > 0 ? 'Bắc' : 'Nam';
    } else {
      return dLon > 0 ? 'Đông' : 'Tây';
    }
  };

  // Fallback UI khi maps không hoạt động
  const renderFallbackMap = () => (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackTitle}>Bản đồ không khả dụng</Text>
      <Text style={styles.fallbackText}>
        Vị trí hiện tại: {location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 'Đang lấy...'}
      </Text>
      {(savedLocation || targetLocation) && (
        <Text style={styles.fallbackText}>
          Vị trí đích: {(savedLocation || targetLocation).latitude.toFixed(6)}, {(savedLocation || targetLocation).longitude.toFixed(6)}
        </Text>
      )}
      <Button 
        title="Thử lại bản đồ" 
        onPress={() => setMapError(false)}
        style={{ marginTop: 20 }}
      />
    </View>
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Thử lại" onPress={() => setError(null)} />
          <Button title="Quay lại" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const currentTarget = savedLocation || targetLocation;

  return (
    <SafeAreaView style={styles.container}>
      {location ? (
        mapError ? (
          renderFallbackMap()
        ) : (
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              showsUserLocation
              showsMyLocationButton
              showsCompass
              onPress={handleMapPress}
              onError={(error) => {
                console.log('MapView error:', error);
                setMapError(true);
              }}
            >
              {currentTarget && (
                <Marker
                  coordinate={currentTarget}
                  title={isSearchMode ? "Vị trí cần tìm" : "Vị trí đã lưu"}
                  description={isSearchMode ? `Mã: ${wordCode}` : `Mã: ${wordCode}`}
                  pinColor={isSearchMode ? "green" : "red"}
                />
              )}
              {selectedLocation && (
                <Marker
                  coordinate={selectedLocation}
                  title="Vị trí được chọn"
                  description={`Mã: ${selectedWordCode}`}
                  pinColor="blue"
                />
              )}
            </MapView>
          </View>
        )
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang lấy vị trí...</Text>
        </View>
      )}
      
      <View style={styles.infoBox}>
        {!isSearchMode ? (
          <View>
            <Button 
              title="Lưu vị trí hiện tại & Tạo mã" 
              onPress={handleSaveLocation}
              disabled={!location}
            />
            {selectedLocation && (
              <View style={styles.selectedLocationContainer}>
                <Text style={styles.selectedLocationText}>
                  Vị trí được chọn: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </Text>
                <Text style={styles.selectedWordCodeText}>
                  Mã: {selectedWordCode}
                </Text>
                <View style={styles.selectedLocationButtons}>
                  <Button 
                    title="Lưu vị trí này" 
                    onPress={handleSaveSelectedLocation}
                    style={{ marginRight: 10 }}
                  />
                  <Button 
                    title="Xóa" 
                    onPress={handleClearSelectedLocation}
                  />
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.searchInfo}>
            <Text style={styles.searchTitle}>Tìm kiếm: {wordCode}</Text>
          </View>
        )}
        
        <View style={styles.buttonRow}>
          {wordCode && !isSearchMode && (
            <Button 
              title="Chia sẻ mã" 
              onPress={() => handleShareWordCode(wordCode)}
              style={{ marginRight: 10 }}
            />
          )}
          {currentTarget && !showLocationInfo && (
            <Button 
              title="Hiện thông tin" 
              onPress={() => setShowLocationInfo(true)}
              style={{ marginRight: 10 }}
            />
          )}
          <Button 
            title="Quay lại" 
            onPress={handleGoBack}
          />
        </View>
      </View>
        
      {/* Location Info Panel */}
      {currentTarget && showLocationInfo && (
        <View style={styles.locationInfoContainer}>
          <LocationInfo
            currentLocation={location}
            targetLocation={currentTarget}
            distance={distance}
            wordCode={wordCode}
            isSearchMode={isSearchMode}
            onShare={handleShareWordCode}
            onClose={() => setShowLocationInfo(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  fallbackText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInfo: {
    marginBottom: 10,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  selectedLocationContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedLocationText: {
    fontSize: 12,
    color: '#2c3e50',
    marginBottom: 5,
  },
  selectedWordCodeText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  selectedLocationButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  infoContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  directionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  wordCodeText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  compassContainer: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    zIndex: 1000,
  },
  locationInfoContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
});

export default LocationTrackerScreen;