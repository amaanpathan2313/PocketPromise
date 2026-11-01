/**
 * Client-Side High Performance Image Compression Utility
 * Compresses camera photos, screenshots, and receipts from 5MB-10MB down to ~100KB-180KB
 * without losing document readability.
 */

export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.75,
    outputType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    // If not an image, return original
    if (!file.type.startsWith('image/')) {
      resolve({
        file,
        dataUrl: null,
        originalSize: file.size,
        compressedSize: file.size,
        savedPercent: 0,
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scaling
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Fill white background for transparent PNGs converting to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Draw image smoothly
        ctx.drawImage(img, 0, 0, width, height);

        // Export compressed image
        const dataUrl = canvas.toDataURL(outputType, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Image compression failed'));
              return;
            }

            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: outputType,
              lastModified: Date.now(),
            });

            const originalSize = file.size;
            const compressedSize = blob.size;
            const savedPercent = Math.max(
              0,
              Math.round(((originalSize - compressedSize) / originalSize) * 100)
            );

            resolve({
              file: compressedFile,
              blob,
              dataUrl,
              originalSize,
              compressedSize,
              savedPercent,
              width,
              height,
            });
          },
          outputType,
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

