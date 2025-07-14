#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the .env file directly
const envPath = path.join(__dirname, '../.env');
const androidManifestPath = path.join(__dirname, '../android/app/src/main/AndroidManifest.xml');

try {
  // Read the .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Extract API key using regex
  const androidKeyMatch = envContent.match(/GOOGLE_MAPS_ANDROID_API_KEY=([^\n\r]+)/);
  const apiKey = androidKeyMatch ? androidKeyMatch[1].trim() : 'AIzaSyDummyKeyForDevelopmentOnly';
  
  // Read AndroidManifest.xml
  let manifestContent = fs.readFileSync(androidManifestPath, 'utf8');
  
  // Update API key in manifest (only the geo API key)
  manifestContent = manifestContent.replace(
    /android:name="com\.google\.android\.geo\.API_KEY"[^>]*android:value="[^"]*"/g,
    `android:name="com.google.android.geo.API_KEY" android:value="${apiKey}"`
  );
  
  // Write back to manifest
  fs.writeFileSync(androidManifestPath, manifestContent);
  
  console.log('✅ AndroidManifest.xml updated with API key from config');
  console.log(`🔑 Using API key: ${apiKey.substring(0, 10)}...`);
  
} catch (error) {
  console.error('❌ Error updating AndroidManifest.xml:', error.message);
  process.exit(1);
} 