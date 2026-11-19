import React from 'react'
import { CloudLightning } from 'lucide-react'

const GithubIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const TwitterIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const LinkedinIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const FooterSection = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-slate-100 text-slate-500 border-t border-slate-200 py-8 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Logo and copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-200/20">
              <CloudLightning className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              Cloud<span className="text-purple-600">Keep</span>
            </span>
          </div>
          <span className="hidden sm:inline text-slate-200">|</span>
          <span className="text-xs text-slate-400">
            © {currentYear} CloudKeep. All rights reserved.
          </span>
        </div>

        {/* Right: Social icons */}
        <div className="flex items-center gap-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition-all">
            <TwitterIcon className="w-4 h-4" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition-all">
            <GithubIcon className="w-4 h-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition-all">
            <LinkedinIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
