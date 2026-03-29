/**
 * Compresses and resizes an image using the HTML5 Canvas API.
 * This is crucial for minimizing the payload size before sending to the AI model,
 * optimizing for latency and costs while preserving enough detail for chart analysis.
 *
 * @param file - The original image file (from camera or gallery)
 * @param maxWidth - The maximum width allowed (default: 768px for LLM Vision API limits/efficiency)
 * @param quality - JPEG quality from 0 to 1 (default: 0.8)
 * @returns A promise that resolves to a Base64 encoded JPEG string
 */
export async function compressImage(
  file: File,
  maxWidth: number = 768,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Read the file as a Data URL
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (event) => {
      // 2. Load the data URL into an image element
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // 3. Calculate new dimensions preserving aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        // 4. Create a canvas element
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        // 5. Draw the resized image onto the canvas
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas 2d context"));
          return;
        }

        // Fill background with white (in case of transparent PNGs)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        
        // Draw the image
        ctx.drawImage(img, 0, 0, width, height);

        // 6. Output the compressed image as a JPEG base64 string
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };

      img.onerror = (error) => {
        reject(new Error(`Failed to load image for compression: ${error}`));
      };
    };

    reader.onerror = (error) => {
      reject(new Error(`Failed to read file: ${error}`));
    };
  });
}
