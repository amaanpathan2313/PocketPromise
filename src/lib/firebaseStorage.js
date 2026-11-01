import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize or get Firebase App safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let storageInstance = null;
try {
  storageInstance = getStorage(app);
} catch (e) {
  console.warn('Firebase Storage initialization skipped:', e);
}

/**
 * Checks whether Firebase credentials in .env are actual configured keys
 */
export function isFirebaseConfigured() {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  const bucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  return Boolean(
    key &&
    key !== 'PLACEHOLDER' &&
    bucket &&
    !bucket.includes('PLACEHOLDER')
  );
}

/**
 * Upload compressed images to Firebase Cloud Storage,
 * with fallback to compressed Data URLs for offline/demo mode.
 *
 * @param {Array<{ file: File, blob: Blob, dataUrl: string, name: string }>} compressedImages
 * @param {string} loanId
 * @returns {Promise<string[]>} Array of image URLs
 */
export async function uploadLoanImages(compressedImages, loanId = 'general') {
  if (!compressedImages || compressedImages.length === 0) {
    return [];
  }

  const isConfigured = isFirebaseConfigured();

  if (isConfigured && storageInstance) {
    try {
      const uploadPromises = compressedImages.map(async (item, index) => {
        const cleanName = item.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `loans/${loanId}/receipt_${index}_${Date.now()}_${cleanName}`;
        const imageRef = ref(storageInstance, storagePath);

        const metadata = {
          contentType: item.file.type || 'image/jpeg',
          customMetadata: {
            loanId: String(loanId),
            originalSize: String(item.originalSize || 0),
            compressedSize: String(item.compressedSize || 0),
          },
        };

        await uploadBytes(imageRef, item.blob, metadata);
        const downloadUrl = await getDownloadURL(imageRef);
        return downloadUrl;
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.warn('Firebase storage upload encountered an issue, falling back to local storage:', error);
      // Fallback to compressed Data URLs on network or auth error
      return compressedImages.map((img) => img.dataUrl);
    }
  }

  // Demo / local mode: return compressed base64 data URLs
  return compressedImages.map((img) => img.dataUrl);
}

