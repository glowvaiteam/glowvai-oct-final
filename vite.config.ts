import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { createRazorpayMiddleware } from './server/razorpay-api.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const linkedPrivateEnv = env.RAZORPAY_SECRET_ENV_FILE
    ? loadEnv(mode, path.dirname(env.RAZORPAY_SECRET_ENV_FILE), '')
    : {};
  const razorpayKeyId = env.VITE_RAZORPAY_KEY_ID || linkedPrivateEnv.RAZORPAY_KEY_ID || linkedPrivateEnv.RAZORPAY_KEY;
  const razorpayKeySecret = env.RAZORPAY_KEY_SECRET || linkedPrivateEnv.RAZORPAY_KEY_SECRET;
  return {
    plugins: [
      react(),
      {
        name: 'glowvai-local-payment-api',
        configureServer(server) {
          server.middlewares.use(createRazorpayMiddleware({
            keyId: razorpayKeyId,
            keySecret: razorpayKeySecret,
          }));
        },
      },
    ],
    resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
    server: { port: 5173, host: true },
  };
});
