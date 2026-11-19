import React, { useEffect } from 'react'
import HeroSection from '../components/landing/HeroSection'
import Features from '../components/landing/Features'
import PricingSection from '../components/landing/PricingSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import FAQSection from '../components/landing/FAQSection'
import CTASection from '../components/landing/CTASection'
import FooterSection from '../components/landing/FooterSection'
import { features, pricingPlans, testimonials, faqs } from '../assets/data'
import { useClerk, useUser } from '@clerk/react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const {openSignIn,openSignUp}=useClerk();
  const {isSignedIn}=useUser();
  const navigate=useNavigate();

  useEffect(()=>{
    if(isSignedIn){
      navigate("/dashboard");
    }
  },[isSignedIn,navigate]);
  
  return (
    <div>
        {/* Hero section */}
        <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} />
        {/* Features section */}
        <Features features={features} />
        {/* Pricing section */}
        <PricingSection pricingPlans={pricingPlans} openSignUp={openSignUp} />
        {/* Testimonials section */}
        <TestimonialsSection testimonials={testimonials} />
        {/* FAQ section */}
        <FAQSection faqs={faqs} />
        {/* CTA section */}
        <CTASection openSignUp={openSignUp} />
        {/* Footer */}
        <FooterSection />
    </div>
  )
}

export default Landing