import React from 'react'
import * as Icons from 'lucide-react'

const Features = ({features}) => {
  return (
    <section id="features" className="relative py-24 bg-white text-slate-900 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-extrabold tracking-widest text-purple-600 uppercase">Premium Features</h2>
          <p className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Everything you need to share & store files securely
          </p>
          <p className="mt-4 text-lg text-slate-600">
            CloudKeep combines military-grade encryption with a beautiful, user-friendly interface to provide the ultimate sharing experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            // Dynamically resolve the Lucide icon component
            const IconComponent = Icons[feature.icon] || Icons.HelpCircle;
            
            return (
              <div 
                key={feature.id}
                className="group relative rounded-2xl border border-slate-100 bg-slate-50 p-8 hover:border-purple-100 hover:bg-white transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-purple-100/30"
              >
                {/* Decorative border glow */}
                <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-purple-600/0 via-purple-600/0 to-indigo-600/0 group-hover:from-purple-600/5 group-hover:to-indigo-600/5 transition-all duration-500 pointer-events-none"></div>

                {/* Icon wrapper */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-md"
                  style={{ 
                    backgroundColor: `${feature.color}15`, // Add 15 for ~8% opacity
                    border: `1px solid ${feature.color}30` 
                  }}
                >
                  <IconComponent 
                    className="w-6 h-6" 
                    style={{ color: feature.color }} 
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features