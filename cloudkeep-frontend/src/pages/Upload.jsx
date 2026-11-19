import React, { useState, useContext } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import UploadBox from '../components/UploadBox';
import { useAuth } from '@clerk/react';
import { UserCreditsContext } from '../context/UserCreditsContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import API_ENDPOINTS from '../util/apiEndpoints';
const Upload = () => {
  const[files,setFiles]=useState([]);
  const[uploading,setUploading]=useState(false);
  const[message,setMessage]=useState("");
  const[messageType,setMessageType]=useState(""); //success or error
  const{getToken}=useAuth();
  const{credits,setCredits}=useContext(UserCreditsContext);

  const MAX_FILE_SIZE = 5; // 5MB Spring Boot Limit

  const handleFileChange=(e)=>{
    const selectedFiles=Array.from(e.target.files);
    if(files.length + selectedFiles.length > MAX_FILE_SIZE){
      setMessage(`You can only upload ${MAX_FILE_SIZE} files at a time.`) // user validation not backend
      setMessageType("error");
      return;
    }
    // add the new files into the existing files
    setFiles((prevFiles)=> [...prevFiles, ...selectedFiles]);
    setMessage(""); // clear any previous messages
    setMessageType("");

  }

  const handleRemoveFile=(index)=>{
    setFiles((prevFiles)=>prevFiles.filter((_,idx)=>idx !==index));
    setMessage("");
    setMessageType("");
  }

  const handleUpload=async()=>{
    if(files.length === 0){
      setMessage("Please select at least one file to upload")
      setMessageType("error")
      return;
    }
    if(files.length>MAX_FILE_SIZE){
      setMessage(`You can only upload ${MAX_FILE_SIZE} files at a time`)
      setMessageType("error")
      return;
    }
    if(files.length>credits){
      setMessage(`You don't have enough credits. You have ${credits} credits and need ${files.length} credits to upload ${files.length} files.`)
      setMessageType("error")
      return;
    }
    setUploading(true);
    setMessage("Uploading files...");
    setMessageType("info");

    const formData=new FormData();
    files.forEach((file)=>formData.append("files",file));

    try{
      const token=await getToken();
      const response=await axios.post(API_ENDPOINTS.UPLOAD_FILES,formData,{
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },})
        if(response.data && response.data.remainingCredits !== undefined){
          setCredits(response.data.remainingCredits)
        }
        setMessage("Files uploaded successfully.");
        setMessageType("success");
        setFiles([]);
    }catch(error){
      console.error("File upload failed:",error);
      toast.error("Failed to upload files. Please try again.");
      setMessage(error.response?.data?.message || "Failed to upload files. Please try again.");
      setMessageType("error");
    }
    finally{
      setUploading(false);
    }

    
  }
  const isUploadDisabled=files.length === 0 || files.length > MAX_FILE_SIZE || credits<=0 || files.length>credits;
  
  
  return (
    <DashboardLayout activeMenu="Upload">
      <div className="py-6">
        {
          message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageType === 'success' ? 'bg-green-500/10 border-green-500' : messageType === 'error' ? 'bg-red-500/10 border-red-500' : 'bg-blue-500/10 border-blue-500'}`}>
              {messageType === 'success' && <CheckCircle2 size={20} className="text-green-600" />}
              {messageType === 'error' && <AlertCircle size={20} className="text-red-600" />}
              {messageType === 'info' && <Info size={20} className="text-blue-600" />}
              {message}

            </div>
          )
        }
        <UploadBox
          files={files}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          uploading={uploading}
          onRemoveFile={handleRemoveFile}
          remainingCredits={credits}
          isUploadDisabled={isUploadDisabled}
          
        >
        </UploadBox>
      </div>
    </DashboardLayout>
  )
}

export default Upload