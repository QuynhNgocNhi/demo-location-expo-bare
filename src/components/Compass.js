import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Magnetometer } from 'expo-sensors';

const Compass = ({ targetLocation, currentLocation }) => {
  const [heading, setHeading] = useState(0);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener(data => {
        setHeading(data.heading || 0);
      })
    );
    Magnetometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // Tính góc đến mục tiêu
  const getBearingToTarget = () => {
    if (!targetLocation || !currentLocation) return 0;
    
    const dLat = targetLocation.latitude - currentLocation.latitude;
    const dLon = targetLocation.longitude - currentLocation.longitude;
    
    const y = Math.sin(dLon * Math.PI / 180) * Math.cos(targetLocation.latitude * Math.PI / 180);
    const x = Math.cos(currentLocation.latitude * Math.PI / 180) * Math.sin(targetLocation.latitude * Math.PI / 180) -
              Math.sin(currentLocation.latitude * Math.PI / 180) * Math.cos(targetLocation.latitude * Math.PI / 180) * Math.cos(dLon * Math.PI / 180);
    
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;
    
    return bearing;
  };

  // Tính góc cần quay
  const getRotationAngle = () => {
    const bearing = getBearingToTarget();
    const currentHeading = heading || 0;
    const rotation = bearing - currentHeading;
    return (rotation + 360) % 360;
  };

  // Lấy hướng bằng tiếng Việt
  const getDirectionText = (angle) => {
    if (angle >= 337.5 || angle < 22.5) return 'Bắc';
    if (angle >= 22.5 && angle < 67.5) return 'Đông Bắc';
    if (angle >= 67.5 && angle < 112.5) return 'Đông';
    if (angle >= 112.5 && angle < 157.5) return 'Đông Nam';
    if (angle >= 157.5 && angle < 202.5) return 'Nam';
    if (angle >= 202.5 && angle < 247.5) return 'Tây Nam';
    if (angle >= 247.5 && angle < 292.5) return 'Tây';
    if (angle >= 292.5 && angle < 337.5) return 'Tây Bắc';
    return 'Bắc';
  };

  const rotationAngle = getRotationAngle();
  const directionText = getDirectionText(rotationAngle);
  const currentHeading = heading || 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>La bàn</Text>
      
      <View style={styles.compassContainer}>
        <View style={styles.compassRing}>
          <View style={[styles.arrow, { transform: [{ rotate: `${rotationAngle}deg` }] }]}>
            <View style={styles.arrowHead} />
            <View style={styles.arrowBody} />
          </View>
          
          <View style={styles.directionMarkers}>
            <Text style={[styles.marker, styles.north]}>N</Text>
            <Text style={[styles.marker, styles.east]}>E</Text>
            <Text style={[styles.marker, styles.south]}>S</Text>
            <Text style={[styles.marker, styles.west]}>W</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.directionText}>Hướng: {directionText}</Text>
        <Text style={styles.angleText}>Góc: {rotationAngle.toFixed(1)}°</Text>
        <Text style={styles.headingText}>La bàn: {currentHeading.toFixed(1)}°</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    margin: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  compassContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#3498db',
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  arrow: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowHead: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#e74c3c',
  },
  arrowBody: {
    width: 2,
    height: 30,
    backgroundColor: '#e74c3c',
    marginTop: -2,
  },
  directionMarkers: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  marker: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  north: {
    top: 5,
    left: '50%',
    transform: [{ translateX: -6 }],
  },
  east: {
    right: 5,
    top: '50%',
    transform: [{ translateY: -6 }],
  },
  south: {
    bottom: 5,
    left: '50%',
    transform: [{ translateX: -6 }],
  },
  west: {
    left: 5,
    top: '50%',
    transform: [{ translateY: -6 }],
  },
  infoContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  directionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  angleText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  headingText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});

export default Compass; 