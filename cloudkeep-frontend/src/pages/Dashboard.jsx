import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '@clerk/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserCreditsContext } from '../context/UserCreditsContext';
import UploadBox from '../components/UploadBox';
import API_ENDPOINTS from '../util/apiEndpoints';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  Loader2,
  Files,
  Globe,
  Lock,
  FileIcon,
  FileText,
  Image as ImageIcon,
  Music,
  Video
} from 'lucide-react';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { getToken } = useAuth();
  const { credits, setCredits, fetchUserCredits } = useContext(UserCreditsContext);
  const MAX_FILE_SIZE = 5;

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(API_ENDPOINTS.FETCH_FILES, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        const sortedFiles = (response.data || []).sort(
          (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );
        setFiles(sortedFiles);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchUserCredits();
  }, [getToken]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (uploadFiles.length + selectedFiles.length > MAX_FILE_SIZE) {
      setMessage(`You can only upload ${MAX_FILE_SIZE} files at a time.`);
      setMessageType('error');
      return;
    }
    setUploadFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setMessage('');
    setMessageType('');
  };

  const handleRemoveFile = (index) => {
    setUploadFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
    setMessage('');
    setMessageType('');
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      setMessage('Please select at least one file to upload');
      setMessageType('error');
      return;
    }
    if (uploadFiles.length > MAX_FILE_SIZE) {
      setMessage(`You can only upload ${MAX_FILE_SIZE} files at a time`);
      setMessageType('error');
      return;
    }
    if (uploadFiles.length > (credits ?? 0)) {
      setMessage(
        `You don't have enough credits. You have ${credits ?? 0} credits and need ${uploadFiles.length} credits.`
      );
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('Uploading files...');
    setMessageType('info');

    const formData = new FormData();
    uploadFiles.forEach((file) => formData.append('files', file));

    try {
      const token = await getToken();
      const response = await axios.post(API_ENDPOINTS.UPLOAD_FILES, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.remainingCredits !== undefined) {
        setCredits(response.data.remainingCredits);
      } else {
        fetchUserCredits();
      }

      setMessage('Files uploaded successfully.');
      setMessageType('success');
      setUploadFiles([]);
      fetchFiles();
      toast.success('Files uploaded successfully');
    } catch (error) {
      console.error('File upload failed:', error);
      const errMsg = error.response?.data?.message || 'Failed to upload files. Please try again.';
      setMessage(errMsg);
      setMessageType('error');
      toast.error(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return <ImageIcon size={18} className="text-purple-500 shrink-0" />;
    }
    if (['mp4', 'webm', 'avi', 'mov', 'qt', 'flv', 'mkv'].includes(ext)) {
      return <Video size={18} className="text-blue-500 shrink-0" />;
    }
    if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext)) {
      return <Music size={18} className="text-emerald-500 shrink-0" />;
    }
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext)) {
      return <FileText size={18} className="text-amber-600 shrink-0" />;
    }
    return <FileIcon size={18} className="text-gray-400 shrink-0" />;
  };

  const isUploadDisabled =
    uploadFiles.length === 0 ||
    uploadFiles.length > MAX_FILE_SIZE ||
    (credits ?? 0) <= 0 ||
    uploadFiles.length > (credits ?? 0);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="p-6 space-y-6">
        {/* Status Notification Message */}
        {message && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 border ${messageType === 'success'
                ? 'bg-green-500/10 border-green-500 text-green-700'
                : messageType === 'error'
                  ? 'bg-red-500/10 border-red-500 text-red-700'
                  : 'bg-blue-500/10 border-blue-500 text-blue-700'
              }`}
          >
            {messageType === 'success' && <CheckCircle2 size={20} className="text-green-600 shrink-0" />}
            {messageType === 'error' && <AlertCircle size={20} className="text-red-600 shrink-0" />}
            {messageType === 'info' && <Info size={20} className="text-blue-600 shrink-0" />}
            <span>{message}</span>
          </div>
        )}

        {/* Horizontal Layout: UploadBox and Recent 5 Files Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Upload Box Column */}
          <div className="w-full">
            <UploadBox
              files={uploadFiles}
              onFileChange={handleFileChange}
              onUpload={handleUpload}
              uploading={uploading}
              onRemoveFile={handleRemoveFile}
              remainingCredits={credits}
              isUploadDisabled={isUploadDisabled}
            />
          </div>

          {/* Recent Files Table Column */}
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recent Files</h2>
                <p className="text-sm text-gray-500 mt-1">Your latest 5 uploaded files</p>
              </div>
              {files.length > 0 && (
                <Link
                  to="/myfiles"
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
                >
                  <span>View all</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <Loader2 size={32} className="animate-spin text-blue-600 mb-2" />
                <p className="text-sm text-gray-500">Loading files...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <Files size={40} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No files uploaded yet.</p>
                <p className="text-xs text-gray-400 mt-1">Use the upload box on the left to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="pb-3 pr-3">Name</th>
                      <th className="pb-3 px-3">Size</th>
                      <th className="pb-3 px-3">Uploaded</th>
                      <th className="pb-3 pl-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {files
                      .slice()
                      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
                      .slice(0, 5)
                      .map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 pr-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            {getFileIcon(file.name)}
                            <span
                              className="font-medium text-gray-900 truncate max-w-32.5 sm:max-w-42.5"
                              title={file.name}
                            >
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap text-xs text-gray-500">
                          {formatDate(file.uploadedAt)}
                        </td>
                        <td className="py-3.5 pl-3 whitespace-nowrap text-right">
                          {file.isPublic ? (
                            <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full text-xs font-medium border border-green-200/50">
                              <Globe size={11} className="text-green-600" /> Public
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200/50">
                              <Lock size={11} className="text-gray-500" /> Private
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
