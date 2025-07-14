import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, Alert, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const LocationTrackerScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef(null);

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
  }, [location]);

  // Tính khoảng cách
  useEffect(() => {
    if (location && savedLocation) {
      const d = getDistanceFromLatLonInMeters(
        location.latitude,
        location.longitude,
        savedLocation.latitude,
        savedLocation.longitude
      );
      setDistance(d);
    }
  }, [location, savedLocation]);

  // Hàm lưu vị trí hiện tại
  const handleSaveLocation = () => {
    if (location) {
      setSavedLocation({ ...location });
      Alert.alert('Thành công', 'Đã lưu vị trí hiện tại!');
    } else {
      Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại');
    }
  };

  // Hàm tính khoảng cách giữa 2 điểm
  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
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
    const d = R * c;
    return d;
  }

  // Hàm tính hướng đơn giản
  const getDirectionText = () => {
    if (!location || !savedLocation) return '';
    
    const dLat = savedLocation.latitude - location.latitude;
    const dLon = savedLocation.longitude - location.longitude;
    
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
      {savedLocation && (
        <Text style={styles.fallbackText}>
          Vị trí đã lưu: {savedLocation.latitude.toFixed(6)}, {savedLocation.longitude.toFixed(6)}
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
              onError={(error) => {
                console.log('MapView error:', error);
                setMapError(true);
              }}
            >
              {savedLocation && (
                <Marker
                  coordinate={savedLocation}
                  title="Vị trí đã lưu"
                  description="Vị trí cuối cùng của vật/người bạn"
                  pinColor="red"
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
        <Button 
          title="Lưu vị trí hiện tại" 
          onPress={handleSaveLocation}
          disabled={!location}
        />
        
        {savedLocation && (
          <View style={styles.infoContainer}>
            <Text style={styles.distanceText}>
              Khoảng cách: {distance ? distance.toFixed(1) : '--'} mét
            </Text>
            <Text style={styles.directionText}>
              Hướng: {getDirectionText()}
            </Text>
          </View>
        )}
        
        <Button 
          title="Quay lại" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 10 }}
        />
      </View>
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
  },
});

export default LocationTrackerScreen; 