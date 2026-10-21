import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glowvai.app',
  appName: 'glowvai',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['checkout.razorpay.com', '*.razorpay.com'],
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
