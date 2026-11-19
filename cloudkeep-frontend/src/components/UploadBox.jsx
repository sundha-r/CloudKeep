import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  FileIcon, 
  X, 
  Loader2, 
  CreditCard 
} from 'lucide-react';

const UploadBox = ({
  files = [],
  onFileChange,
  onUpload,
  uploading = false,
  onRemoveFile,
  remainingCredits = 0,
  isUploadDisabled = false,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return <ImageIcon size={20} className="text-purple-500" />;
    }
    if (['mp4', 'webm', 'avi', 'mov', 'qt', 'flv', 'mkv'].includes(ext)) {
      return <Video size={20} className="text-blue-500" />;
    }
    if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext)) {
      return <Music size={20} className="text-emerald-500" />;
    }
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext)) {
      return <FileText size={20} className="text-amber-600" />;
    }
    return <FileIcon size={20} className="text-gray-500" />;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (uploading) return;

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0 && onFileChange) {
      onFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleInputChange = (e) => {
    if (onFileChange) {
      onFileChange(e);
    }
    // Reset value so user can select the same file again if desired
    e.target.value = '';
  };

  const totalBytes = files.reduce((acc, f) => acc + (f.size || 0), 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Box Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 transition-all">
        {/* Header / Info Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Upload Files</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select files to upload to your personal cloud.
            </p>
          </div>

          {/* Credits Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-blue-50/80 border border-blue-100 px-3.5 py-1.5 rounded-full text-blue-700 text-xs sm:text-sm font-medium">
            <CreditCard size={15} className="text-blue-600" />
            <span>Available: <strong className="font-semibold text-blue-900">{remainingCredits ?? 0}</strong> credits</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 text-xs">1 credit/file</span>
          </div>
        </div>

        {/* Dropzone Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`mt-6 relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
            isDragging
              ? 'border-blue-500 bg-blue-50/60 scale-[1.01] shadow-inner'
              : 'border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20'
          } ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            multiple
            className="hidden"
            disabled={uploading}
          />

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 transition-transform group-hover:scale-105">
            <UploadCloud size={32} className={isDragging ? 'animate-bounce' : ''} />
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            {isDragging ? 'Drop files here to add them' : 'Drag & drop your files here'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm">
            or <span className="text-blue-600 font-medium hover:underline">browse from your computer</span>
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
            <span className="bg-gray-100 px-2.5 py-1 rounded-md">Images</span>
            <span className="bg-gray-100 px-2.5 py-1 rounded-md">Documents</span>
            <span className="bg-gray-100 px-2.5 py-1 rounded-md">Videos</span>
            <span className="bg-gray-100 px-2.5 py-1 rounded-md">Audio</span>
            <span className="bg-gray-100 px-2.5 py-1 rounded-md">Any File</span>
          </div>
        </div>

        {/* Selected Files Queue */}
        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">
                  Selected Files ({files.length})
                </span>
                <span className="text-xs text-gray-400">
                  Total: {formatFileSize(totalBytes)}
                </span>
              </div>
            </div>

            {/* Scrollable File List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-50">
              {files.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50/70 hover:bg-gray-100/70 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div className="p-2 rounded-lg bg-white shadow-xs border border-gray-100 shrink-0">
                      {getFileIcon(file.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  {!uploading && onRemoveFile && (
                    <button
                      type="button"
                      onClick={() => onRemoveFile(idx)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-white transition-colors cursor-pointer shrink-0"
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                disabled={isUploadDisabled || uploading}
                onClick={onUpload}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-98"
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    <span>
                      Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default UploadBox;
