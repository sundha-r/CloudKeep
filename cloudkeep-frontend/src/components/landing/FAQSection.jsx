import  { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQSection = ({ faqs}) => {
  const [openId, setOpenId] = useState(null)

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section id="faq" className="relative py-24 bg-slate-50 text-slate-900 overflow-hidden border-t border-slate-100">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-extrabold tracking-widest text-purple-600 uppercase">Got Questions?</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </p>
          <p className="mt-4 text-base text-slate-600">
            Find answers to common questions about our security architecture, pricing options, and sharing functionality.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id
            
            return (
              <div 
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen 
                    ? 'border-purple-500/30 bg-purple-50/50 shadow-md shadow-purple-100/10' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                {/* Question Trigger */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left font-bold text-slate-800 hover:text-slate-950 transition-colors cursor-pointer select-none"
                >
                  <span className="text-base sm:text-lg pr-4">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-250/50 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-purple-100 border-purple-200 text-purple-700' : 'text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Answer Content */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 sm:px-6 sm:pb-6 text-sm sm:text-base text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQSection