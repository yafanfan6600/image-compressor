import React from 'react'

interface ImagePreviewProps {
  title: string
  image?: string
  size?: number
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ title, image, size }) => {
  const formatSize = (bytes?: number) => {
    if (!bytes) return '0 KB'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium text-gray-700 truncate" title={title}>
          {title}
        </h3>
        {size && (
          <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-600">
            {formatSize(size)}
          </span>
        )}
      </div>
      <div className="image-preview">
        {image ? (
          <img
            src={image}
            alt={title}
            className="rounded-lg"
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <span className="mt-2">暂无图片</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImagePreview 