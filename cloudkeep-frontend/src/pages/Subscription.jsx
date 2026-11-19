import React, { useEffect, useContext, useRef, useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { useSearchParams } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/react';
import { UserCreditsContext } from '../context/UserCreditsContext';
import axios from 'axios';
import API_ENDPOINTS from '../util/apiEndpoints';
import { CheckCircle2, AlertCircle, Info, CreditCard, Check, Sparkles, Loader2 } from 'lucide-react';

const Subscription = () => {
  const [processingPayment,setProcessingPayment]=useState(false);
  const [message,setMessage]=useState("");
  const [messageType,setMessageType]=useState("");
  const [razorpayLoaded,setRazorpayLoaded]=useState(false);

  const {getToken}=useAuth();
  const {user}=useUser();
  const razorpayScriptRef=useRef(null);
  const {credits,setCredits,fetchUserCredits}=useContext(UserCreditsContext);

  const plans=[
    {
      id:"premium",
      name:"Premium",
      credits:500,
      price:500,
      features:[
        "Upload up to 500 files",
        "Access to all basic features",
        "priority support"

      ],
      recommended:false
    },
    {
      id:"ultimate",
      name:"Ultimate",
      credits:5000,
      price:2500,
      features:[
        "Upload up to 5000   files",
        "Access to all basic features",
        "priority support",
        "Advanced analytics"

      ],
      recommended:true
    }
  ];

  useEffect(() => {
    // If Razorpay is already available on window, update state
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    // Check if script tag already exists in DOM
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => setRazorpayLoaded(true));
      existingScript.addEventListener("error", () => setRazorpayLoaded(false));
      return;
    }

    // Dynamically load Razorpay checkout script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("Razorpay script loaded successfully.")
      setRazorpayLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      setMessage("payment gateway failed to load. Please refresh the page and try again.");
      setMessageType("error");
      setRazorpayLoaded(false);
    };

    document.body.appendChild(script);
    razorpayScriptRef.current = script;

    // Cleanup script on unmount
    return () => {
      if (razorpayScriptRef.current && document.body.contains(razorpayScriptRef.current)) {
        document.body.removeChild(razorpayScriptRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchUserCredits=async()=>{
        try{
          const token=await getToken();
          const response=await axios.get(API_ENDPOINTS.GET_USER_CREDITS,{headers:{'Authorization':`Bearer ${token}`}});
          setCredits(response.data.credits);
        }
        catch(error){
          console.error("Error fetching user credits:",error);
          setMessage("Failed to load your current credits. Please try again later.");
          setMessageType('error');
        }
    };

    fetchUserCredits();
  }, [getToken]);

  const handlePurchase = async (plan) => {
    if(!razorpayLoaded){
      setMessage("Payment gateway is stil loading. Please wait a moment and try again.");
      setMessageType('info');
      return;
    }
    setProcessingPayment(true);
    setMessage('');
    try {
      const token = await getToken();
      const response = await axios.post(
        API_ENDPOINTS.CREATE_PAYMENT_ORDER,
        {
          planId: plan.id,
          amount: plan.price * 100,
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data || !response.data.orderId) {
        throw new Error(response.data?.message || "Failed to create payment order");
      }

      const { orderId } = response.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "",
        amount: plan.price * 100,
        currency: "INR",
        name: "CloudKeep",
        description: `${plan.name} Plan - ${plan.credits} Credits`,
        order_id: orderId,
        handler: async function (paymentResponse) {
          try {
            const verificationPayload = {
              razorpay_orderId: paymentResponse.razorpay_order_id,
              razorpay_paymentId: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              planId: plan.id,
            };

            const verifyRes = await axios.post(
              API_ENDPOINTS.VERIFY_PAYMENT,
              verificationPayload,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyRes.data?.success) {
              setMessage("Payment verified and credits added successfully!");
              setMessageType("success");
              if (verifyRes.data?.credits !== undefined) {
                setCredits(verifyRes.data.credits);
              } else {
                await fetchUserCredits();
              }
            } else {
              setMessage(verifyRes.data?.message || "Payment verification failed.");
              setMessageType("error");
            }
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            setMessage(
              verifyError.response?.data?.message ||
                "Payment verification failed. Please contact support."
            );
            setMessageType("error");
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: user?.primaryPhoneNumber?.phoneNumber || "9999999999",
        },
        method: {
          netbanking: true,
          card: true,
          wallet: true,
          upi: true,
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (paymentFailedResponse) {
        console.error("Payment failed:", paymentFailedResponse.error);
        setMessage(
          `Payment failed: ${paymentFailedResponse.error?.description || "Transaction failed"}`
        );
        setMessageType("error");
        setProcessingPayment(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Error creating payment order:", error);
      setMessage(
        error.response?.data?.message || "Failed to create payment order. Please try again."
      );
      setMessageType("error");
      setProcessingPayment(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Subscription">
     <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">
          Subscription Plans
        </h1>
        <p className="text-gray-600 mb-6">Choose a plan that works for you</p>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 border ${
              messageType === 'success'
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
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between flex-1">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Balance</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-gray-900">{credits ?? 0}</span>
                <span className="text-sm text-gray-500">credits</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Available for file uploads (1 credit = 1 file)</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-purple-600 rounded-xl flex items-center justify-center">
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-200 hover:shadow-md ${
                plan.recommended
                  ? 'border-purple-600 ring-2 ring-purple-600/20 shadow-sm'
                  : 'border-gray-200'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles size={12} />
                  <span>Recommended</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    {plan.credits.toLocaleString()} Credits
                  </span>
                </div>

                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-500 text-sm"> / one-time</span>
                </div>

                <div className="mb-8">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    What's included
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                        <Check size={16} className="text-green-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(plan)}
                disabled={processingPayment || !razorpayLoaded}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.recommended
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-purple-100 hover:bg-gray-200 text-purple-900'
                }`}
              >
                {processingPayment ?(
                  <>
                    <Loader2 size={16} className='animate-spin'/>
                    <span>Processing...</span>
                  </>
                ):(
                  <span>Purchase Plan</span>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className='font-medium mb-2'>How credits work</h3>
          <p className="text-sm text-gray-600">
            Each file upload consumes 1 credits. New users start with 5 free credits.
            Credits never expire and can be used at any time. If you run out of credits,
            you can purchase more through one of our plans above.
          </p>
        </div>


        
     </div>
    </DashboardLayout>
  )
}

export default Subscription