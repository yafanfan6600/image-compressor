/**
 * 压缩图片文件
 * @param file - 原始图片文件
 * @param quality - 压缩质量（1-100）
 * @returns 压缩后的图片文件
 */
export async function compressImage(file: File, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
    };

    img.onload = () => {
      try {
        // 创建Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('无法获取Canvas上下文');
        }

        // 设置Canvas尺寸
        canvas.width = img.width;
        canvas.height = img.height;

        // 在Canvas上绘制图片
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // 根据文件类型选择输出格式
        let mimeType = file.type;
        if (!mimeType.startsWith('image/')) {
          mimeType = 'image/jpeg';
        }

        // 将Canvas内容转换为Blob
        canvas.toBlob(
          (blob) => {
            try {
              if (!blob) {
                throw new Error('图片压缩失败');
              }

              // 创建新的File对象
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '') + '_compressed' + getExtensionFromMimeType(mimeType),
                {
                  type: mimeType,
                  lastModified: Date.now()
                }
              );
              
              cleanup();
              resolve(compressedFile);
            } catch (error) {
              cleanup();
              reject(error);
            }
          },
          mimeType,
          Math.max(0, Math.min(100, quality)) / 100 // 确保质量值在0-100之间
        );
      } catch (error) {
        cleanup();
        reject(error);
      }
    };

    img.onerror = () => {
      cleanup();
      reject(new Error('图片加载失败'));
    };

    img.src = objectUrl;
  });
}

/**
 * 根据MIME类型获取文件扩展名
 */
function getExtensionFromMimeType(mimeType: string): string {
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    default:
      return '.jpg';
  }
} 