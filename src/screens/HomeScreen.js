import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  const handleNavigation = (screenName) => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate(screenName);
    } else {
      console.error('Navigation is not available');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Lost & Found Buddy</Text>
            <Text style={styles.subtitle}>
              Tìm kiếm và chia sẻ vị trí bằng mã 3 từ tiếng Việt
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📍</Text>
              <Text style={styles.featureTitle}>Lưu vị trí & Tạo mã</Text>
              <Text style={styles.featureDescription}>
                Lưu vị trí hiện tại và tạo mã 3 từ tiếng Việt để chia sẻ
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔍</Text>
              <Text style={styles.featureTitle}>Tìm kiếm bằng mã</Text>
              <Text style={styles.featureDescription}>
                Nhập mã 3 từ để tìm vị trí và được hướng dẫn đi bộ
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🗺️</Text>
              <Text style={styles.featureTitle}>Bản đồ thông minh</Text>
              <Text style={styles.featureDescription}>
                Hiển thị vị trí trên bản đồ với marker và thông tin chi tiết
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🧭</Text>
              <Text style={styles.featureTitle}>Hướng dẫn chính xác</Text>
              <Text style={styles.featureDescription}>
                La bàn và mũi tên chỉ hướng đến vị trí cần tìm
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📏</Text>
              <Text style={styles.featureTitle}>Khoảng cách real-time</Text>
              <Text style={styles.featureDescription}>
                Theo dõi khoảng cách từ vị trí hiện tại đến điểm đích
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🤝</Text>
              <Text style={styles.featureTitle}>Chia sẻ dễ dàng</Text>
              <Text style={styles.featureDescription}>
                Chia sẻ mã 3 từ đơn giản cho bạn bè và người thân
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleNavigation('LocationTracker')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Lưu vị trí & Tạo mã</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => handleNavigation('SearchByCode')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Tìm kiếm bằng mã</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.tertiaryButton]}
              onPress={() => handleNavigation('History')}
              activeOpacity={0.8}
            >
              <Text style={styles.tertiaryButtonText}>Lịch sử vị trí</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Cách sử dụng:</Text>
            <View style={styles.infoSteps}>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>Lưu vị trí hiện tại để tạo mã 3 từ</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>Chia sẻ mã cho người cần tìm</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>Người tìm nhập mã và được hướng dẫn</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  actionButtons: {
    marginBottom: 30,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
  },
  tertiaryButton: {
    backgroundColor: '#9b59b6',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  tertiaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
    marginBottom: 16,
    textAlign: 'center',
  },
  infoSteps: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3498db',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
  },
});

export default HomeScreen; 