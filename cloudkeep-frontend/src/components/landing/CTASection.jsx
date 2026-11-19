
import { ArrowRight, ShieldCheck } from 'lucide-react'

const CTASection = ({ openSignUp }) => {
  return (
    <section className="relative py-24 bg-white text-slate-900 overflow-hidden border-t border-slate-100">
      {/* Decorative gradient blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-linear-to-r from-purple-600/5 to-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6">
        <div className="relative rounded-3xl border border-slate-100 bg-slate-50/80 backdrop-blur-xl py-10 px-6 sm:p-12 md:p-16 text-center shadow-lg overflow-hidden">
          {/* Inner border glow */}
          <div className="absolute -inset-px rounded-3xl bg-linear-to-br from-purple-500/5 via-purple-500/0 to-indigo-500/5 pointer-events-none"></div>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-purple-900/30">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>

          {/* Typography */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
            Ready to secure your digital footprint?
          </h2>
          
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Join thousands of individuals and teams who trust CloudKeep with their sensitive files. Start storing and sharing for free, upgrade as you grow.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={openSignUp}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-white shadow-lg shadow-purple-200/50 flex items-center justify-center gap-2 transition-all active:scale-95 group cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Small note */}
          <p className="mt-6 text-xs text-slate-500">
            No credit card required for Starter account. Upgradable anytime.
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTASection