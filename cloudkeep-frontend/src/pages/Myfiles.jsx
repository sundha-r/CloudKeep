import React, { useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { Copy, Download, Eye, FileIcon, Files, FileText, Globe, Grid, Image, List, Lock, Music, Trash, Video, X } from 'lucide-react';
import { useAuth } from '@clerk/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileCard from '../components/FileCard';
import API_ENDPOINTS from '../util/apiEndpoints';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LinkShareModal from '../components/LinkShareModal';

const Myfiles = () => {
  const[files,setFiles]=useState([]);
  const[viewMode,setViewMode]=useState('list');
  const{getToken}=useAuth();
  const navigate=useNavigate();
  const[deleteConfirmation,setDeleteConfirmation]=useState({
    isOpen:false,
    fileId:null
  });
  const[shareModal,setShareModal]=useState({
    isOpen:false,
    fileId:null,
    link:""
  });
  

  // fetches the files of the current user
  const fetchFiles=async()=>{
    try{
      const token=await getToken();
      const response=await axios.get(API_ENDPOINTS.FETCH_FILES,{headers:{Authorization:`Bearer ${token}`}});
      if(response.status === 200){
        const sortedFiles = (response.data || []).sort(
          (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );
        setFiles(sortedFiles);
      }
    }catch(error){
      console.log("Error fetching the files from server",error);
      toast.error("Failed to fetch files",error.message);
    }
  }
   useEffect(()=>{
    fetchFiles();
  },[getToken]);

  //toggles the public/private status of the file
  const togglePublic=async(fileId)=>{
    try{
      const token=await getToken();
      await axios.patch(API_ENDPOINTS.TOGGLE_PUBLIC(fileId), {}, {headers:{Authorization:`Bearer ${token}`}});
      
      setFiles(files.map((file)=> file.id===fileId ? {...file,isPublic:!file.isPublic}:file));
    }
    catch(error){
      console.error("Error toggling the public status of the file",error);
      toast.error("Failed to toggle file status",error.message);
    }

  }

  //download file
  const downloadFile=async(file)=>{
    try{
        const token=await getToken();
        const response=await axios.get(API_ENDPOINTS.DOWNLOAD_FILE(file.id),{headers:{Authorization:`Bearer ${token}`},responseType:'blob'});

        //create a blob url and trigger download
        const url=window.URL.createObjectURL(new Blob([response.data]));
        const link=document.createElement('a');
        link.href=url;
        link.setAttribute('download',file.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); //clean up the object url
        toast.success('File downloaded successfully');
    }catch(error){
      console.error("Error downloading the file",error);
      toast.error("Failed to download file",error.message);
    }
  }

  
  //open delete Confirmation pop up
  const openDeleteConfirmation=(fileId)=>{
    setDeleteConfirmation({
      isOpen:true,
      fileId:fileId
    })
  };

  // closes the delete confirmation pop up
  const closeDeleteConfirmation=()=>{
    setDeleteConfirmation({
      isOpen:false,
      fileId:null
    })
  }

  //Delete a file after confrimation
  const handleDelete=async()=>{
    const fileId=deleteConfirmation.fileId
    if (!fileId)
      return; 

    try{
        const token=await getToken();
        const response=await axios.delete(API_ENDPOINTS.DELETE_FILE(fileId),{headers:{Authorization:`Bearer ${token}`}})
        if(response.status === 204){
          setFiles(files.filter((file)=>file.id !==fileId));
          closeDeleteConfirmation();
          toast.success("File deleted successfully");
        }
        else{
          toast.error("Error deleting file");
        }
    }
    catch(error){
        console.log("Error deleting the file",error);
        toast.error("Failed to delete file",error.message);
    }

  }
  
  //open share link modal
  const openShareModal=(fileId)=>{
    const link=`${window.location.origin}/file/${fileId}`;
    setShareModal({
      isOpen:true,
      fileId:fileId,
      link:link
    })
  }

  //close share link modal
  const closeShareModal=()=>{
    setShareModal({
      isOpen:false,
      fileId:null,
      link:""
    })
  }

  const getFileIcon = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
            return <Image size={24} className="text-purple-500" />
        }

        if (['mp4', 'webm', 'avi', 'mov', 'qt', 'flv', 'mkv'].includes(extension)) {
            return <Video size={24} className="text-blue-500" />
        }

        if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(extension)) {
            return <Music size={24} className="text-green-500" />
        }

        if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(extension)) {
            return <FileText size={24} className="text-amber-600" />
        }

        return <FileIcon size={24} className="text-gray-400" />

    }
  return (
    <DashboardLayout activeMenu="My Files">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Files {files.length}</h2>
          <div className="flex items-center gap-3">
            <List 
              onClick={()=>{setViewMode('list')}}
              size={24}
              className={`cursor-pointer transition-colors ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`} />
            <Grid 
              onClick={()=>setViewMode('grid')}
              size={24}
              className={`cursor-pinter transition-colors ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}/>
          </div>
        </div>
        {files.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
           <Files
            size={60}
            className='text-purple-400 mb-4'
            />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No files uploaded yet
            </h3>
            <p className='text-gray-500 text-center max-w-md mb-6'>
              Start uploading files to see them listed here. You can upload documents,images,and other files to share and manage them securely.
            </p>
            <button 
              onClick={()=> navigate('/upload')}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
              Go to Upload
            </button>
          </div>
        ):viewMode === 'grid' ?(
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file)=>(
              <FileCard 
                  key={file.id}
                  file={file}
                  onTogglePublic={togglePublic}
                  onDownload={downloadFile}
                  onDelete={openDeleteConfirmation}
                  onShare={openShareModal}
              />
            ))}
          </div>

        ):(
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                  {files.map((file)=>(
                    <tr key={file.id} className='hover:bg-gray-50 transition-colors'>
                      <td className="px-6 py-4 whitespace-nowarp text-sm font-medium text-gray-800">
                        <div className="flex items-center gap-2">
                          {getFileIcon(file)}
                          {file.name}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowarp text-sm text-gray-500'>
                        {(file.size/1024).toFixed(1)} KB
                      </td>
                      <td className='px-6 py-4 whitespace-nowarp text-sm text-gray-500'>
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowarp text-sm text-gray-500'>
                        <div className="flex items-center gap-4">
                          <button 
                              onClick={()=>togglePublic(file.id)}
                              className="flex items-center gap-2 cursor-pointer group"
                          >
                              {file.isPublic ? (
                                <>
                                  <Globe size={16} className='text-green-500'/>
                                  <span className="group hover:underline">Public</span>
                                </>
                              ):(
                                <>
                                <Lock size={16} className='text-gray-400'/>
                                <span className="group hover:underline">Private</span>
                                </>
                              )}
                          </button>
                          {file.isPublic && (
                            <button 
                              onClick={()=>openShareModal(file.id)}
                            className="flex items-center gap-2 cursor-pointer group text-blue-600">
                              <Copy size={16}/>
                              <span className='group-hover:underline'>Share Link</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowarp text-sm font-medium'>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex justify-center">
                              <button 
                                  onClick={()=>{downloadFile(file)}}
                                  title='Download'
                                  className="text-gray-500 hover:text-blue-600">
                                <Download size={18}/> 
                              </button>
                            </div>
                            <div className="flex justify-center">
                              <button
                                onClick={()=>openDeleteConfirmation(file.id)}
                                className="text-gray-500 hover:text-red-600"
                                title='Delete'
                              >
                                <Trash size={18}/>
                              </button>
                            </div>
                            <div className="flex justify-center">
                              {file.isPublic ?(
                                <a href={`/file/${file.id}`} title="View File" target="_blank" rel="noreferrer" className='txt-gray-500 hover:text-blue-600'>
                                  <Eye size={18}/>
                                </a>
                              ):(
                                <span className='w-4.5'></span>
                              )}
                            </div>
                          </div>
                      </td>
                      
                    </tr>
                  ))

                  }
              </tbody>

            </table>
          </div>
        )}

        {/* delete confirmation dialog */}

        <ConfirmationDialog
          isOpen={deleteConfirmation.isOpen}
          onClose={closeDeleteConfirmation}
          title="Delete File"
          message="Are you sure want to delete this file? This action cannot be undone"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          confirmationButtonClass="bg-red-600 hover:bg-red-700"
        />

        {/* share link modal */}
        <LinkShareModal
          isOpen={shareModal.isOpen}
          onClose={closeShareModal}
          link={shareModal.link}
          title="Share File"
        />
      </div>
    </DashboardLayout>
  )
}

export default Myfiles