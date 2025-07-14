# Location Tracker - React Native Expo Bare Workflow

## 📱 Tổng quan dự án

Ứng dụng Location Tracker được xây dựng bằng React Native với Expo Bare Workflow, giúp người dùng đánh dấu vị trí cuối cùng của vật bị mất hoặc người bạn, sau đó hướng dẫn họ đi bộ đến gần vị trí đó nhất có thể.

## 🎯 Tính năng chính

### ✅ Đã hoàn thành

- **Lưu vị trí hiện tại**: Đánh dấu vị trí cuối cùng thấy vật/người
- **Hiển thị bản đồ**: MapView với marker tại vị trí đã lưu
- **Tính khoảng cách**: Real-time distance calculation
- **Chỉ hướng đơn giản**: Text-based direction (Bắc/Nam/Đông/Tây)
- **Navigation**: Stack navigation với màn hình Home và LocationTracker
- **Error Handling**: Xử lý lỗi permission và location services
- **UI/UX**: Giao diện đẹp, responsive và user-friendly

### 🔄 Có thể mở rộng

- **Compass Integration**: Sử dụng magnetometer để chỉ hướng chính xác hơn
- **Route Planning**: Tích hợp Google Maps Directions API
- **Offline Support**: Lưu trữ local với AsyncStorage
- **Push Notifications**: Thông báo khi đến gần điểm đã lưu
- **Multiple Locations**: Quản lý nhiều vị trí đã lưu

## 🏗️ Kiến trúc dự án

```
demo-location-expo-bare/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js          # Màn hình bắt đầu
│   │   └── LocationTrackerScreen.js # Màn hình chính
│   ├── navigation/
│   │   └── AppNavigator.js        # Navigation stack
│   └── components/                # (Để mở rộng)
├── ios/
│   └── demolocationexpobare/
│       └── Info.plist             # iOS permissions
├── android/
│   └── app/
│       └── src/main/
│           └── AndroidManifest.xml # Android permissions
├── App.js                         # Entry point
└── package.json
```

## 🛠️ Công nghệ sử dụng

### Core Dependencies

- **React Native**: 0.79.5
- **Expo SDK**: 53.0.17
- **React**: 19.0.0

### Location & Maps

- **expo-location**: ~18.1.6 - Location services
- **react-native-maps**: 1.20.1 - MapView component

### Navigation

- **@react-navigation/native**: ^6.1.9
- **@react-navigation/stack**: ^6.3.20
- **react-native-screens**: ~3.29.0
- **react-native-safe-area-context**: 4.8.2

### Sensors (Future)

- **expo-sensors**: ~14.1.4 - Magnetometer for compass

### Environment & Security

- **react-native-dotenv**: ^3.4.11 - Environment variables management

## 🔐 API Keys Setup

### 1. Setup Environment Variables

```bash
# Copy environment template
npm run setup-env

# Edit .env file with your API keys
nano .env
```

### 2. Get Google Maps API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Maps SDK for Android** and **Maps SDK for iOS**
4. Create API keys for each platform
5. Add keys to `.env` file:

```env
GOOGLE_MAPS_ANDROID_API_KEY=your_android_api_key_here
GOOGLE_MAPS_IOS_API_KEY=your_ios_api_key_here
```

### 3. Security Best Practices

- ✅ Never commit `.env` files to git
- ✅ Use different API keys for development/production
- ✅ Restrict API keys to your app's package name
- ✅ Enable billing for Google Cloud project
- ✅ Monitor API usage in Google Cloud Console

## 📋 Quy trình phát triển

### 1. Khởi tạo dự án

```bash
npx create-expo-app@latest . --template bare-minimum --yes
```

### 2. Cài đặt dependencies

```bash
npx expo install expo-location expo-sensors react-native-maps
npx expo install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context
```

### 3. Cấu hình permissions

#### iOS (Info.plist)

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Ứng dụng cần quyền truy cập vị trí để hiển thị vị trí hiện tại và tính toán khoảng cách đến điểm đã lưu.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Ứng dụng cần quyền truy cập vị trí để theo dõi vị trí liên tục và tính toán khoảng cách đến điểm đã lưu.</string>
```

#### Android (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

### 4. Tạo cấu trúc thư mục

```bash
mkdir -p src/screens src/components src/navigation
```

## 🔧 Các vấn đề đã giải quyết

### 1. Modal Error (NSInvalidArgumentException)

**Vấn đề**: Lỗi `Application tried to present modally a view controller that is already being presented`

**Giải pháp**:

- Loại bỏ Magnetometer tạm thời để tránh lỗi JavaScript
- Cải thiện error handling với try-catch
- Sử dụng state để kiểm soát Alert display
- Thêm SafeAreaView để tránh layout issues

### 2. Location Permissions

**Vấn đề**: `NSLocation*UsageDescription` missing

**Giải pháp**:

- Thêm đầy đủ permission descriptions trong Info.plist
- Cấu hình Android permissions trong AndroidManifest.xml
- Implement proper permission request flow

### 3. Performance Optimization

**Vấn đề**: Location tracking quá tần suất cao

**Giải pháp**:

- Giảm update frequency (5m distance, 3s interval)
- Sử dụng Location.Accuracy.Balanced thay vì High
- Implement proper cleanup trong useEffect

## 📱 Cách sử dụng

### Chạy ứng dụng

```bash
# iOS
npm run ios

# Android
npm run android

# Web (nếu cần)
npm run web
```

### Workflow người dùng

1. **Màn hình Home**: Xem tổng quan tính năng
2. **Bắt đầu tìm kiếm**: Navigate đến LocationTracker
3. **Lưu vị trí**: Nhấn "Lưu vị trí hiện tại"
4. **Theo dõi**: Xem khoảng cách và hướng real-time
5. **Quay lại**: Navigate về Home screen

## 🧪 Testing

### Manual Testing Checklist

- [ ] Permission request flow
- [ ] Location accuracy
- [ ] Distance calculation
- [ ] Direction display
- [ ] Navigation between screens
- [ ] Error handling
- [ ] UI responsiveness

### Device Testing

- [ ] iOS Simulator (iPhone 15 Pro)
- [ ] Android Emulator (nếu có)
- [ ] Physical device testing (recommended)

## 🚀 Deployment

### iOS

```bash
# Build for production
expo build:ios

# Or use EAS Build
eas build --platform ios
```

### Android

```bash
# Build for production
expo build:android

# Or use EAS Build
eas build --platform android
```

## 📈 Performance Metrics

### Current Performance

- **Location Update**: 3 seconds interval
- **Distance Calculation**: Real-time
- **Memory Usage**: Optimized with proper cleanup
- **Battery Impact**: Minimal (balanced accuracy)

### Optimization Opportunities

- Implement location caching
- Add background location updates
- Optimize map rendering
- Implement lazy loading

## 🔮 Roadmap

### Phase 1 (Current) ✅

- Basic location tracking
- Distance calculation
- Simple direction display
- Navigation structure

### Phase 2 (Next)

- [ ] Compass integration
- [ ] Route planning
- [ ] Offline support
- [ ] Multiple locations

### Phase 3 (Future)

- [ ] Push notifications
- [ ] Social features
- [ ] Advanced analytics
- [ ] Cloud sync

## 🐛 Known Issues

1. **Magnetometer**: Tạm thời disabled để tránh modal errors
2. **Background Location**: Chưa implement
3. **Offline Maps**: Chưa support
4. **Battery Optimization**: Cần cải thiện

## 📚 Resources

- [Expo Location Documentation](https://docs.expo.dev/versions/latest/sdk/location/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [React Navigation](https://reactnavigation.org/)
- [Expo Bare Workflow](https://docs.expo.dev/guides/bare-workflow/)

## 👨‍💻 Development Notes

### Code Quality

- Sử dụng functional components với hooks
- Proper error boundaries
- Clean code principles
- Consistent naming conventions

### Best Practices

- Proper permission handling
- Memory leak prevention
- Performance optimization
- User experience focus

---

**Developer**: Senior React Native Developer  
**Last Updated**: December 2024  
**Version**: 1.0.0
