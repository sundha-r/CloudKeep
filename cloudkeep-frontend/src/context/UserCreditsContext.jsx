import { useAuth } from "@clerk/react";
import {createContext, useCallback, useEffect, useState } from "react";
import API_ENDPOINTS from "../util/apiEndpoints";
import axios from "axios";
import toast from "react-hot-toast";

export const UserCreditsContext=createContext();

export const UserCreditsProvider=({children})=>{

    const[credits,setCredits]=useState(5);
    const[loading,setLoading]=useState(false);
   const {getToken,isSignedIn}= useAuth();

   //Fuction to fetch the user credits that can be called from anywhere

   const fetchUserCredits=useCallback(async()=>{
    if(!isSignedIn) return;
    setLoading(true);
    try {
        const token=await getToken();
        const response=await axios.get(API_ENDPOINTS.GET_USER_CREDITS,{headers:{Authorization:`Bearer ${token}`}});
        if(response.status === 200){
            const userCredits = response.data?.credits ?? response.data?.Credits ?? 0;
            setCredits(userCredits);
        }else{
            toast.error("Failed to fetch user credits");
        }
        
    } catch (error) {
        console.error("Failed to fetch user credits",error);
        
    }
    finally{
        setLoading(false);  
    }
   },[getToken,isSignedIn]);

   useEffect(()=>{
    if(isSignedIn) fetchUserCredits();
   },[fetchUserCredits,isSignedIn]);

   const updateCredits=useCallback((newCredits)=>{
    console.log("updating the credits",newCredits);
    setCredits(newCredits);
   },[]);

    const contextValue={
    credits,
    setCredits,
    fetchUserCredits,
    updateCredits
    }
    return(
        <UserCreditsContext.Provider value={contextValue}>
            {children}
        </UserCreditsContext.Provider>
    )
}
