import { CreditCard, Files, LayoutDashboard, Receipt, Upload } from "lucide-react";

export const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Freelance Photographer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    quote: "CloudKeep has completely revolutionized how I share high-res galleries with my clients. It's lightning-fast, and the link expiration feature gives me absolute peace of mind.",
    rating: 5
  },
  {
    id: 2,
    name: "Alex Rivera",
    role: "Tech Lead at Innovate.io",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    quote: "We migrated our team sharing to CloudKeep. The end-to-end encryption combined with the sleek UI is unmatched. It is by far the best cloud security service on the market.",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    quote: "The interface is gorgeous and incredibly intuitive. Uploading gigabytes of video takes seconds, and my clients love the custom-branded public file view pages.",
    rating: 5
  }
];

export const pricingPlans = [
  {
    id: "starter",
    name: "Free",
    price: "₹0",
    period: "",
    description: "Perfect for getting started",
    features: [
      "5 file uploads",
      "Basic file sharing",
      "7-day file retention",
      "Email support"
    ],
    buttonText: "Get Started",
    popular: false
  },
  {
    id: "pro",
    name: "Premium",
    price: "₹500",
    period: "",
    description: "For individuals with larger needs",
    features: [
      "500 file uploads",
      "Advanced file sharing",
      "30-day file retention",
      "Priority email support",
      "File analytics"
    ],
    buttonText: "Go Premium",
    popular: true
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: "₹2500",
    period: "",
    description: "For teams and businesses",
    features: [
      "5000 file uploads",
      "Team sharing capabilities",
      "Unlimited file retention",
      "24/7 priority support",
      "Advanced analytics",
      "API access"
    ],
    buttonText: "Go Ultimate",
    popular: false
  }
];

export const features = [
  {
    id: "security",
    title: "Zero-Knowledge Encryption",
    description: "Your files are encrypted client-side before they ever touch our servers. Only you hold the keys.",
    icon: "Shield",
    color: "#10b981",
    tailwindColor: "text-emerald-500"
  },
  {
    id: "speed",
    title: "Lightning-Fast Uploads",
    description: "Powered by a global edge network to ensure your files upload and download at maximum speed.",
    icon: "Zap",
    color: "#f59e0b",
    tailwindColor: "text-amber-500"
  },
  {
    id: "sharing",
    title: "Secure Public Links",
    description: "Share files with friends or clients via sleek public links. Password protection and expiration times included.",
    icon: "Share2",
    color: "#6366f1",
    tailwindColor: "text-indigo-500"
  },
  {
    id: "dashboard",
    title: "Intuitive File Manager",
    description: "Easily organize, search, filter, and preview your uploaded files in our state-of-the-art dashboard.",
    icon: "FolderOpen",
    color: "#0ea5e9",
    tailwindColor: "text-sky-500"
  },
  {
    id: "collab",
    title: "Team Collaboration Vaults",
    description: "Create shared secure vaults with granular access permissions for your entire team.",
    icon: "Users",
    color: "#8b5cf6",
    tailwindColor: "text-violet-500"
  },
  {
    id: "analytics",
    title: "Download Analytics",
    description: "Track how many times your shared files have been downloaded, and from which regions.",
    icon: "BarChart3",
    color: "#f43f5e",
    tailwindColor: "text-rose-500"
  }
];

export const faqs = [
  {
    id: 1,
    question: "How does zero-knowledge encryption work?",
    answer: "Your files are encrypted directly in your browser using a cryptographic key derived from your credentials before being uploaded. We do not store or transmit your unencrypted data or keys, meaning only you can access or share them."
  },
  {
    id: 2,
    question: "What happens when a shared link expires?",
    answer: "Once the expiration date or time set by you is reached, the shareable link becomes completely invalid. Public access to the file is locked instantly, ensuring your files are only accessible for as long as you intend."
  },
  {
    id: 3,
    question: "Can I password protect my shared files?",
    answer: "Yes! With our Pro Explorer and CloudKeep Team plans, you can set custom password parameters on any shared link. Visitors will be prompted to enter the correct password before they can preview or download your file."
  },
  {
    id: 4,
    question: "Is there a limit to the size of files I can upload?",
    answer: "Our Starter tier supports files up to 100 MB per file. Upgrading to the Pro Explorer tier increases the limit to 5 GB per file, and the CloudKeep Team plan permits files up to 10 GB."
  },
  {
    id: 5,
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. You can upgrade, downgrade, or cancel your subscription plan at any time through your dashboard. If you cancel, you will retain access to your premium features until the end of your current billing cycle."
  }
];

//side menubar options
export const sideMenuItems = [
  {
    id: "01",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    id: "02",
    label: "Upload",
    path: "/upload",
    icon: Upload
  },
  {
    id: "03",
    label: "My Files",
    path: "/myfiles",
    icon:Files
  },
  {
    id: "04",
    label: "Subscription",
    path: "/subscription",
    icon: CreditCard
  },
  {
    id: "05",
    label: "Transactions",
    path: "/transactions",
    icon: Receipt
  }
];



