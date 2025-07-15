import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const LocationInfo = ({ 
  currentLocation, 
  targetLocation, 
  distance, 
  wordCode, 
  isSearchMode,
  onShare,
  onClose 
}) => {
  const formatCoordinate = (coord) => {
    if (!coord || typeof coord.latitude !== 'number' || typeof coord.longitude !== 'number') return '--';
    return `${coord.latitude.toFixed(6)}, ${coord.longitude.toFixed(6)}`;
  };

  const formatDistance = (dist) => {
    console.log('Formatting distance:', dist, typeof dist);
    if (!dist || typeof dist !== 'number') return '--';
    if (dist < 1000) {
      return `${dist.toFixed(1)} mét`;
    } else {
      return `${(dist / 1000).toFixed(2)} km`;
    }
  };

  const getAccuracyText = (accuracy) => {
    if (!accuracy || typeof accuracy !== 'number') return 'Không xác định';
    if (accuracy <= 5) return 'Rất chính xác';
    if (accuracy <= 10) return 'Chính xác';
    if (accuracy <= 20) return 'Tương đối chính xác';
    return 'Kém chính xác';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isSearchMode ? 'Thông tin tìm kiếm' : 'Thông tin vị trí'}
        </Text>
        {onClose && (
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vị trí hiện tại</Text>
        <Text style={styles.coordinateText}>
          {formatCoordinate(currentLocation)}
        </Text>
        {currentLocation?.accuracy && (
          <Text style={styles.accuracyText}>
            Độ chính xác: {getAccuracyText(currentLocation.accuracy)}
          </Text>
        )}
      </View>

      {targetLocation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isSearchMode ? 'Vị trí cần tìm' : 'Vị trí đã lưu'}
          </Text>
          <Text style={styles.coordinateText}>
            {formatCoordinate(targetLocation)}
          </Text>
          {wordCode && (
            <View style={styles.wordCodeContainer}>
              <Text style={styles.wordCodeLabel}>Mã 3 từ:</Text>
              <Text style={styles.wordCodeText}>{wordCode}</Text>
              {!isSearchMode && onShare && (
                <TouchableOpacity 
                  style={styles.shareButton}
                  onPress={() => onShare(wordCode)}
                >
                  <Text style={styles.shareButtonText}>Chia sẻ</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}

      {distance !== null && distance !== undefined && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khoảng cách</Text>
          <Text style={styles.distanceText}>
            {formatDistance(distance)}
          </Text>
          {distance < 10 && (
            <Text style={styles.nearbyText}>
              🎉 Bạn đã đến gần vị trí cần tìm!
            </Text>
          )}
        </View>
      )}

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  coordinateText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  accuracyText: {
    fontSize: 12,
    color: '#95a5a6',
  },
  wordCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  wordCodeLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginRight: 8,
  },
  wordCodeText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
    fontFamily: 'monospace',
    flex: 1,
  },
  shareButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  distanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  nearbyText: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '500',
  },
  tipsSection: {
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
    lineHeight: 16,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationInfo; 