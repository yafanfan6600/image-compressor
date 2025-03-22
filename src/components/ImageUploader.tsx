import React from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploaderProps {
  onUpload: (files: File[]) => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    onDrop: files => {
      if (files.length > 0) {
        onUpload(files)
      }
    }
  })

  return (
    <div
      {...getRootProps()}
      className={`upload-zone ${isDragActive ? 'upload-zone-active' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className={`p-4 rounded-full ${
            isDragActive ? 'bg-blue-100' : 'bg-gray-100'
          } transition-colors duration-200`}>
            <svg
              className={`w-10 h-10 ${
                isDragActive ? 'text-blue-500' : 'text-gray-400'
              }`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="text-center">
          {isDragActive ? (
            <p className="text-lg text-blue-500 font-medium">
              松开鼠标开始上传...
            </p>
          ) : (
            <>
              <p className="text-lg text-gray-700 font-medium">
                点击或拖放图片到这里上传
              </p>
              <p className="mt-2 text-sm text-gray-500">
                支持多张图片，格式包括 PNG、JPG、GIF、WEBP
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageUploader 