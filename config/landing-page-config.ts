// NAVBAR
export const navbarLinks = [{
  title: "Pricing",
  url: "#pricing"
}, {
  title: "Features",
  url: "#features"
}, {
  title: "Testimonials",
  url: "#testimonials"
}, {
  title: "FAQ",
  url: "#faq"
}];

// HERO
import user1 from "@/public/landing/user_1.jpeg";
import user2 from "@/public/landing/user_2.jpeg";
import user3 from "@/public/landing/user_3.jpeg";
import user4 from "@/public/landing/user_4.jpeg";
import user5 from "@/public/landing/user_5.jpeg";
export const heroUsers = [{
  image: user1,
  alt: "user1"
}, {
  image: user2,
  alt: "user2"
}, {
  image: user3,
  alt: "user3"
}, {
  image: user4,
  alt: "user4"
}, {
  image: user5,
  alt: "user5"
}];

// FEATURES
import offline from "@/public/landing/offline.svg";
import git from "@/public/landing/git.svg";
import editor from "@/public/landing/editor.svg";
import pdf from "@/public/landing/pdf.svg";
export const features = [{
  icon: offline,
  title: "Deep Research Engine",
  description: "Access comprehensive research on any topic, from science to finance, with our powerful AI-driven search engine. [on]MMaTeX delivers accurate, in-depth information instantly."
}, {
  icon: git,
  title: "Academic Excellence",
  description: "Perfect for students and researchers tackling complex subjects in mathematics, biology, chemistry, and physics. [on]MMaTeX transforms difficult concepts into clear, concise reports."
}, {
  icon: editor,
  title: "Professional PDF Reports",
  description: "Generate publication-ready PDF documents with perfect LaTeX formatting, complete with equations, citations, and graphics\u2014no LaTeX knowledge required."
}, {
  icon: pdf,
  title: "Interactive Research Assistant",
  description: "Our AI guides your research with clarifying questions, ensuring precise results tailored to your specific needs, from market analysis to scientific inquiries."
}];

// TESTIMONIALS
export const testimonials = [{
  image: "https://i.pravatar.cc/150?img=45",
  name: "Dr. Emily Davis",
  userName: "@emily_d",
  comment: "[on]MMaTeX revolutionized my academic publishing workflow. I received a comprehensive literature review for my neuroscience paper in minutes instead of weeks!"
}, {
  image: "https://i.pravatar.cc/150?img=68",
  name: "Prof. Michael Brown",
  userName: "@mike_brown",
  comment: "As a finance professor, I'm impressed by the depth of market analysis [on]MMaTeX provides. My students now create professional-quality reports that would impress Wall Street analysts."
}, {
  image: "https://i.pravatar.cc/150?img=38",
  name: "Sophia Johnson",
  userName: "@sophia_j",
  comment: "The research capabilities of [on]MMaTeX have transformed my dissertation process. It finds connections between sources I would have missed and presents them in beautifully formatted documents."
}, {
  image: "https://i.pravatar.cc/150?img=25",
  name: "David Wilson",
  userName: "@david_w",
  comment: "As a digital marketing consultant, I rely on [on]MMaTeX to create data-driven strategy reports for clients. The AI finds insights across multiple platforms that would take my team days to compile."
}, {
  image: "https://i.pravatar.cc/150?img=15",
  name: "Olivia Martinez",
  userName: "@olivia_m",
  comment: "My high school students use [on]MMaTeX to tackle complex chemistry and physics problems. The step-by-step explanations in the generated reports have improved their understanding and grades dramatically."
}, {
  image: "https://i.pravatar.cc/150?img=29",
  name: "James Taylor",
  userName: "@james_t",
  comment: "As a stock market analyst, [on]MMaTeX gives me a competitive edge. It synthesizes financial data from multiple sources into coherent, actionable reports that my clients love."
}];

// PRICING
export const packages = [{
  title: "Explorer",
  popular: 0,
  price: 0,
  priceId: "",
  mode: "free",
  description: "Perfect for students and individuals seeking research assistance. Access our AI-powered research engine for academic and personal projects.",
  button: "Start Writing",
  services: [{
    support: 1,
    name: "Basic Research Capabilities"
  }, {
    support: 1,
    name: "10 Reports Monthly"
  }, {
    support: 0,
    name: "PDF Export"
  }, {
    support: 0,
    name: "Standard Research Depth"
  }, {
    support: 0,
    name: "Email Support"
  }]
}, {
  title: "Scholar",
  popular: 1,
  price: 5,
  priceId: process.env.NODE_ENV === "development" ? "price_1R6MKeBO3RpV9ttz4eVvnxZT" : process.env.PRICE_ID_ACADEMIC,
  mode: "subscription",
  description: "Designed for academics and professionals requiring in-depth research capabilities for papers, reports, and analysis.",
  button: "Get Started",
  services: [{
    support: 1,
    name: "Advanced Research Engine"
  }, {
    support: 1,
    name: "50 Reports Monthly"
  }, {
    support: 1,
    name: "Enhanced PDF Formatting"
  }, {
    support: 1,
    name: "Deep Research Capabilities"
  }, {
    support: 0,
    name: "Priority Support"
  }]
}, {
  title: "Research Pro",
  popular: 0,
  price: 29,
  priceId: process.env.NODE_ENV === "development" ? "price_1R6MJbBO3RpV9ttz9pk7lVjR" : process.env.PRICE_ID_RESEARCH_PRO,
  mode: "subscription",
  description: "For research teams, businesses, and institutions requiring the most comprehensive research capabilities and premium features.",
  button: "Contact US",
  services: [{
    support: 1,
    name: "Enterprise-Grade Research"
  }, {
    support: 1,
    name: "Unlimited Reports"
  }, {
    support: 1,
    name: "Custom Branding Options"
  }, {
    support: 1,
    name: "Maximum Research Depth"
  }, {
    support: 1,
    name: "Dedicated Account Manager"
  }]
}];

// FAQs
export const FAQs = [{
  question: "How does [on]MMaTeX conduct its research?",
  answer: "[on]MMaTeX uses advanced AI to search and analyze information from multiple reliable sources across the internet, synthesizing findings into coherent, well-structured reports tailored to your specific query.",
  value: "item-1"
}, {
  question: "Do I need to know LaTeX to use [on]MMaTeX?",
  answer: "Not at all! [on]MMaTeX handles all the LaTeX formatting automatically. You simply enter your research question, and the system generates beautifully formatted PDF documents with proper equations, citations, and formatting.",
  value: "item-2"
}, {
  question: "What types of topics can [on]MMaTeX research?",
  answer: "[on]MMaTeX excels at researching a wide range of topics, from academic subjects like mathematics, biology, chemistry, and physics to professional fields such as digital marketing, stock market analysis, and business strategy.",
  value: "item-3"
}, {
  question: "How detailed are the reports generated by [on]MMaTeX?",
  answer: "Reports are typically 1-2 pages of concentrated, high-quality information. The Scholar and Research Pro plans offer deeper research capabilities for more comprehensive analysis, with options to request additional detail on specific sections.",
  value: "item-4"
}, {
  question: "Can I edit the reports after they're generated?",
  answer: "Absolutely! You can request specific changes through our interactive chat interface. Ask to add sections, remove content, or refocus the research, and [on]MMaTeX will regenerate your PDF with the requested modifications.",
  value: "item-5"
}];

// FOOTER
export const footer = [{
  title: "Links",
  links: [{
    url: "/#pricing",
    name: "Pricing"
  }
  //      { url: "/documentation", name: "Documentation" },
  //      { url: "/support", name: "Support" },
  //      { url: "/roadmap", name: "Roadmap" },
  ]
}, {
  title: "Social Media",
  links: [{
    url: "https://github.com/josemramirez/mmatex",
    name: "GitHub"
  }, {
    url: "https://x.com/mmatex_",
    name: "X.com"
  }
  //      { url: "#", name: "LinkedIn" },
  ]
}
//  {
//    title: "Legal",
//    links: [
//      { url: "/terms", name: "Terms and Conditions" },
//      { url: "/policy", name: "Privacy Policy" },
//    ],
//  },
//  {
//    title: "Contribute",
//    links: [
//      { url: "/contribute", name: "Contribute" },
//      { url: "/issues", name: "Report Issues" },
//    ],
//  },
];

// En @/config/landing-page-config.js o directamente en Hero.js
export const metrics = [{
  title: "Total Revenue",
  value: "$250.00",
  change: "+12.5%",
  trend: "Trending up this month",
  description: "Visitors for the last 6 months"
}, {
  title: "New Customers",
  value: "234",
  change: "-20%",
  trend: "Down 20% this period",
  description: "Acquisition needs attention"
}, {
  title: "Active Accounts",
  value: "678",
  change: "+12.5%",
  trend: "Strong user retention",
  description: "Engagement exceeds targets"
}, {
  title: "Growth Rate",
  value: "2.5%",
  change: "+1.5%",
  trend: "Steady performance",
  description: "Meets growth projections"
}];