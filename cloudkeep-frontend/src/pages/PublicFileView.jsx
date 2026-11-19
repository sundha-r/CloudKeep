import { useAuth } from "@clerk/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_ENDPOINTS from "../util/apiEndpoints";
import toast from "react-hot-toast";
import {
  Share2,
  Download,
  FileText,
  Loader2,
  AlertCircle,
  Info
} from "lucide-react";
import LinkShareModal from "../components/LinkShareModal";

const PublicFileView = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [shareModal, setShareModal] = useState({
    isOpen: false,
    link: ""
  });
  const { getToken } = useAuth();
  const { fileId } = useParams();

  useEffect(() => {
    const getFile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_ENDPOINTS.PUBLIC_FILE_VIEW(fileId));
        setFile(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching file:", err);
        setError("Could not retrieve file. The link may be invalid or the file may have been removed.");
      } finally {
        setIsLoading(false);
      }
    };
    getFile();
  }, [fileId, getToken]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await axios.get(API_ENDPOINTS.DOWNLOAD_FILE(fileId), { responseType: "blob" });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("File downloaded successfully");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Sorry, the file could not be downloaded.");
    } finally {
      setDownloading(false);
    }
  };

  const openShareModal = () => {
    setShareModal({
      isOpen: true,
      link: window.location.href
    });
  };

  const closeShareModal = () => {
    setShareModal({
      isOpen: false,
      link: ""
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 size={36} className="animate-spin text-blue-600 mb-3" />
        <p className="text-gray-600 text-sm">Loading file...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200 max-w-md w-full">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800">File Unavailable</h2>
          <p className="text-gray-600 mt-2 text-sm">{error}</p>
          <Link
            to="/"
            className="inline-block mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go to CloudShare
          </Link>
        </div>
      </div>
    );
  }

  if (!file) return null;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <header className="py-3 px-6 border-b border-gray-200 bg-white">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <Share2 className="text-blue-600" size={20} />
              <span className="font-bold text-lg text-gray-800">CloudShare</span>
            </Link>
            <button
              onClick={openShareModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 rounded-lg transition-colors cursor-pointer text-xs font-medium"
            >
              <Share2 size={13} />
              Share Link
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="container mx-auto px-4 py-10 flex flex-col items-center justify-center">
          {/* Main Card */}
          <div className="w-full max-w-xl bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs">
            {/* Top Icon */}
            <div className="w-14 h-14 rounded-full bg-blue-100/70 flex items-center justify-center mx-auto mb-4">
              <FileText size={26} className="text-blue-500" />
            </div>

            {/* Title & Metadata */}
            <h1 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-1 wrap-break-words" title={file.name}>
              {file.name}
            </h1>
            <p className="text-xs text-gray-400 text-center mb-3">
              {formatFileSize(file.size)} • Shared on {formatDate(file.uploadedAt)}
            </p>

            {/* Type Badge */}
            <div className="flex justify-center mb-5">
              <span className="text-[10px] font-medium text-gray-500 uppercase px-2.5 py-0.5 rounded-full border border-gray-200 bg-gray-50/80">
                {file.type || file.name?.split('.').pop() || 'FILE'}
              </span>
            </div>

            {/* Download Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-lg transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {downloading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download size={13} />
                    <span>Download File</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider Line */}
            <hr className="border-gray-100 mb-5" />

            {/* File Information */}
            <div className="text-left">
              <h3 className="font-bold text-xs text-gray-900 mb-3.5">File Information</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">File Name:</span>
                  <span className="text-gray-700 font-medium truncate max-w-70 sm:max-w-85" title={file.name}>
                    {file.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">File Type:</span>
                  <span className="text-gray-700 font-medium">
                    {file.type || file.name?.split('.').pop()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">File Size:</span>
                  <span className="text-gray-700 font-medium">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Shared:</span>
                  <span className="text-gray-700 font-medium">
                    {formatDate(file.uploadedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Public Notification Banner */}
          <div className="w-full max-w-xl mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100/80 text-blue-700 flex items-center gap-2.5 text-xs">
            <Info size={15} className="text-blue-500 shrink-0" />
            <span>This file has been shared publicly. Anyone with this link can view and download it.</span>
          </div>
        </main>
      </div>

      {/* Share Modal */}
      <LinkShareModal
        isOpen={shareModal.isOpen}
        onClose={closeShareModal}
        link={shareModal.link}
        title="Share File Link"
      />
    </div>
  );
};

export default PublicFileView;
