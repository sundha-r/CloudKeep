import React from 'react'
import { Star } from 'lucide-react'

const TestimonialsSection = ({ testimonials}) => {
  return (
    <section className="relative py-24 bg-white text-slate-900 overflow-hidden border-t border-slate-100">
      {/* Background glow effects */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-extrabold tracking-widest text-purple-600 uppercase">Testimonials</h2>
          <p className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trusted by innovators & creators
          </p>
          <p className="mt-4 text-lg text-slate-600">
            Hear from our global users who rely on CloudKeep to secure their sensitive files and maintain complete data ownership.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="relative rounded-2xl border border-slate-100 bg-slate-50 p-8 hover:border-slate-200 hover:bg-slate-100/50 transition-all duration-300 shadow-md flex flex-col justify-between"
            >
              {/* Card content */}
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 text-sm leading-relaxed italic mb-8">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* User profile */}
              <div className="flex items-center gap-4 border-t border-slate-200/50 pt-6 mt-auto">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/20"
                />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection