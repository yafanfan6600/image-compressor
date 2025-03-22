import React from 'react';

interface CompressionControlsProps {
  ratio: number;
  onChange: (ratio: number) => void;
  onDownload: () => void;
  disabled: boolean;
  isCompressing?: boolean;
}

const CompressionControls: React.FC<CompressionControlsProps> = ({
  ratio,
  onChange,
  onDownload,
  disabled,
  isCompressing
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label htmlFor="compression" className="text-base font-medium text-gray-700">
            压缩质量
          </label>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              ratio > 75 ? 'bg-green-500' :
              ratio > 50 ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
            <span className="text-sm font-medium text-gray-600">{ratio}%</span>
          </div>
        </div>
        <input
          type="range"
          id="compression"
          min="1"
          max="100"
          value={ratio}
          onChange={(e) => onChange(Number(e.target.value))}
          className="input-range"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>低质量</span>
          <span>高质量</span>
        </div>
        <p className="text-sm text-gray-500 text-center">
          提示: 压缩质量越低，文件大小越小，但图片质量也会相应降低
        </p>
      </div>
      
      <button
        onClick={onDownload}
        disabled={disabled}
        className="btn-primary w-full flex items-center justify-center space-x-2"
      >
        <svg 
          className={`w-5 h-5 ${isCompressing ? 'animate-spin' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isCompressing ? (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
            />
          )}
        </svg>
        <span>{isCompressing ? '正在压缩...' : '下载压缩后的图片'}</span>
      </button>
    </div>
  );
};

export default CompressionControls; 