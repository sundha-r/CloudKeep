
import { CloudLightning, Shield, Lock, UploadCloud, FileText, CheckCircle2, HardDrive } from 'lucide-react'

const HeroSection = ({ openSignIn, openSignUp }) => {
  return (
    <div className="relative bg-slate-50 text-slate-900 overflow-hidden min-h-screen flex flex-col justify-between">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-125 h-125 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-pink-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-image-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between border-b border-slate-200/80 backdrop-blur-md bg-white/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/30">
            <CloudLightning className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl md:text-2xl tracking-tight text-slate-900">
            Cloud<span className="text-purple-600">Keep</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-purple-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-purple-600 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-purple-600 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={openSignIn} className="text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
            Sign In
          </button>
          <button onClick={openSignUp} className="px-3 py-2 md:px-5 md:py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 text-xs md:text-sm font-semibold text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md shadow-purple-200/50 active:scale-95 cursor-pointer">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 pt-10 pb-16 md:pt-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Side: Copy and CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
          <div className="inline-flex items-center gap-2 self-center lg:self-start px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700 mb-6 backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>Military-Grade Zero-Knowledge Storage</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-none">
            Share Files Securely With <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-pink-600">
              CloudKeep
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Encrypted client-side. Shared globally. CloudKeep ensures your private files stay private. Share secure links with password protection and expiry trackers.
          </p>


        </div>

        {/* Right Side: Interactive Mockup */}
        <div className="lg:col-span-6 relative w-full max-w-xl mx-auto lg:max-w-none">
          <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-purple-600 to-indigo-600 opacity-10 blur-xl"></div>
          
          <div className="relative rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-xl p-4 sm:p-6 shadow-xl">
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="text-xs text-slate-500 font-mono ml-2">cloudkeep_vault v1.0</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-semibold border border-emerald-200">
                <Lock className="w-2.5 h-2.5" />
                <span>E2EE ACTIVE</span>
              </div>
            </div>

            {/* Dropzone mock */}
            <div className="border border-dashed border-slate-200 rounded-xl p-6 sm:p-8 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-purple-500/60 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Drag & drop files here to encrypt</p>
              <p className="text-xs text-slate-500 mt-1">Or click to browse from device (Max 10GB)</p>
            </div>

            {/* Files list mock */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-purple-50 text-purple-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800">project_proposal.pdf</p>
                    <p className="text-[10px] text-slate-500">4.2 MB • Encrypted</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-600">2d expiry</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-purple-50 text-purple-600">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800">design_assets_v2.zip</p>
                    <p className="text-[10px] text-slate-500">128.5 MB • Encrypted</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-mono">Password Set</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HeroSection