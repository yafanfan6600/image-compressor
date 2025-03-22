import React, { useState, useCallback, useEffect } from 'react'
import ImageUploader from './components/ImageUploader'
import ImagePreview from './components/ImagePreview'
import CompressionControls from './components/CompressionControls'
import { compressImage } from './utils/imageCompression'

interface ImageData {
  id: string
  file: File
  preview: string
  size: number
  compressedFile?: File
  compressedPreview?: string
  compressedSize?: number
  status: 'pending' | 'processing' | 'done' | 'error'
  error?: string
}

function App() {
  const [images, setImages] = useState<ImageData[]>([])
  const [compressionRatio, setCompressionRatio] = useState(80)
  const [isCompressing, setIsCompressing] = useState(false)

  // 压缩单个图片
  const compressImageFile = useCallback(async (image: ImageData, ratio: number) => {
    if (image.status === 'processing') return; // 避免重复处理

    try {
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, status: 'processing' } : img
      ))

      const compressed = await compressImage(image.file, ratio)
      const compressedPreview = URL.createObjectURL(compressed)

      setImages(prev => prev.map(img =>
        img.id === image.id ? {
          ...img,
          compressedFile: compressed,
          compressedPreview,
          compressedSize: compressed.size,
          status: 'done'
        } : img
      ))
    } catch (error) {
      console.error('压缩失败:', error)
      setImages(prev => prev.map(img =>
        img.id === image.id ? {
          ...img,
          status: 'error',
          error: error instanceof Error ? error.message : '压缩失败'
        } : img
      ))
    }
  }, [])

  // 压缩所有图片
  const compressAllImages = useCallback(async (ratio: number) => {
    if (images.length === 0) return
    
    setIsCompressing(true)
    try {
      await Promise.all(
        images.map(image => compressImageFile(image, ratio))
      )
    } catch (error) {
      console.error('批量压缩失败:', error)
    } finally {
      setIsCompressing(false)
    }
  }, [images, compressImageFile])

  const handleImageUpload = useCallback(async (files: File[]) => {
    const newImages: ImageData[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      size: file.size,
      status: 'pending'
    }))

    setImages(prev => [...prev, ...newImages])
    // 立即压缩新上传的图片
    compressAllImages(compressionRatio)
  }, [compressionRatio, compressAllImages])

  const handleCompressionChange = useCallback((ratio: number) => {
    setCompressionRatio(ratio)
    // 立即开始压缩
    compressAllImages(ratio)
  }, [compressAllImages])

  const handleDownloadAll = useCallback(() => {
    images.forEach(image => {
      if (image.compressedFile && image.status === 'done') {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(image.compressedFile)
        link.download = image.compressedFile.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
      }
    })
  }, [images])

  const handleClearAll = useCallback(() => {
    images.forEach(image => {
      URL.revokeObjectURL(image.preview)
      if (image.compressedPreview) {
        URL.revokeObjectURL(image.compressedPreview)
      }
    })
    setImages([])
  }, [images])

  // 清理资源
  useEffect(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.preview)
        if (image.compressedPreview) {
          URL.revokeObjectURL(image.compressedPreview)
        }
      })
    }
  }, [images])

  return (
    <div className="min-h-screen bg-apple-gray p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-apple-dark">
          图片批量压缩工具
        </h1>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="card">
            <ImageUploader onUpload={handleImageUpload} />
          </div>
          
          {images.length > 0 && (
            <div className="card">
              <div className="space-y-6">
                <CompressionControls
                  ratio={compressionRatio}
                  onChange={handleCompressionChange}
                  onDownload={handleDownloadAll}
                  disabled={!images.some(img => img.status === 'done')}
                  isCompressing={isCompressing}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    共 {images.length} 张图片
                    {images.filter(img => img.status === 'done').length > 0 && 
                      `，${images.filter(img => img.status === 'done').length} 张已完成`}
                    {isCompressing && '，正在压缩...'}
                  </span>
                  <button
                    onClick={handleClearAll}
                    className="text-red-500 hover:text-red-600 text-sm"
                    disabled={isCompressing}
                  >
                    清除全部
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {images.map(image => (
              <div key={image.id} className="card">
                <div className="space-y-4">
                  <ImagePreview
                    title={image.file.name}
                    image={image.preview}
                    size={image.size}
                  />
                  <div className="border-t border-gray-200 pt-4">
                    {image.status === 'pending' && (
                      <p className="text-gray-500 text-center">等待处理...</p>
                    )}
                    {image.status === 'processing' && (
                      <p className="text-blue-500 text-center">处理中...</p>
                    )}
                    {image.status === 'error' && (
                      <p className="text-red-500 text-center">{image.error}</p>
                    )}
                    {image.status === 'done' && image.compressedPreview && (
                      <ImagePreview
                        title="压缩后"
                        image={image.compressedPreview}
                        size={image.compressedSize}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App 