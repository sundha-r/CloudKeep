
import { Check } from 'lucide-react'


const PricingSection = ({ pricingPlans, openSignUp }) => {
  return (
    <section id="pricing" className="relative py-24 bg-slate-50 text-slate-900 overflow-hidden border-t border-slate-100">
      {/* Decorative gradients */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-extrabold tracking-widest text-purple-600 uppercase">Pricing Tiers</h2>
          <p className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Flexible plans for any scale
          </p>
          <p className="mt-4 text-lg text-slate-600">
            Choose the plan that fits your storage needs. Enjoy premium security and secure link management on all tiers.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-xl ${
                plan.popular 
                  ? 'bg-white border-2 border-purple-500 shadow-purple-100/50 md:-translate-y-2' 
                  : 'bg-white border border-slate-100 hover:border-slate-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-linear-to-r from-purple-500 to-indigo-500 text-[10px] font-black tracking-widest uppercase text-white shadow-lg">
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed min-h-10">{plan.description}</p>
                
                {/* Price */}
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-sm text-slate-500">/{plan.period}</span>}
                </div>

                {/* Features List */}
                <div className="border-t border-slate-100 pt-6 mb-8">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">What's included:</p>
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        <span className="text-sm text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto">
                {plan.id === 'business' ? (
                  <a 
                    href="mailto:sales@cloudkeep.io?subject=CloudKeep%20Enterprise%20Inquiry"
                    className="w-full py-3.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-800 flex items-center justify-center transition-all cursor-pointer"
                  >
                    {plan.buttonText}
                  </a>
                ) : (
                  <button 
                    onClick={openSignUp}
                    className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center transition-all cursor-pointer active:scale-98 ${
                      plan.popular 
                        ? 'bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-200/50' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection