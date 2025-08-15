# KodeKit - All-in-One Developer Toolkit

🚀 **KodeKit** is a comprehensive web-based toolkit that provides **50+ essential tools** for developers, designers, and content creators. Built with **Next.js 14**, **TypeScript**, and **Material-UI**, it offers a modern, intuitive interface for various file operations, calculations, and productivity tasks.

<img width="1918" height="840" alt="KodeKit Homepage" src="https://github.com/user-attachments/assets/a4d9be8f-097e-4beb-8f67-1a66112be713" />

<img width="1918" height="857" alt="KodeKit Popular Tools" src="https://github.com/user-attachments/assets/5128b63b-0515-480b-bf2a-1df4ec7db161" />

<img width="1918" height="853" alt="KodeKit Tool Categories" src="https://github.com/user-attachments/assets/02d628b5-8a6a-470e-854f-9fe30766195c" />

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.14-0081CB?logo=mui&logoColor=white)](https://mui.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

## 🚀 Features

### 📄 PDF Tools (3 tools)

- **Image to PDF Converter**: Convert multiple images to a single PDF document
- **PDF Merger**: Combine multiple PDF files into a single document
- **PDF Splitter**: Extract specific pages from PDF files

### 📝 Text Tools (4 tools)

- **Word Count**: Count words, characters, sentences, and paragraphs
- **Text Case Converter**: Convert text between different cases (uppercase, lowercase, title case)

### 🎨 Design Tools (6 tools)

- **Color Picker**: Select and convert colors between different formats
- **Image Resizer**: Resize images while maintaining aspect ratio
- **Image Compressor**: Compress images to reduce file size
- **QR Code Generator**: Generate QR codes for text, URLs, and more
- **Gradient Generator**: Create and export CSS gradients
- **SVG Editor**: Create and edit SVG graphics

### 💻 Developer Tools (12 tools)

- **JSON Formatter**: Format and validate JSON data
- **JSON Compare**: Compare two JSON objects and highlight differences
- **Base64 Encoder/Decoder**: Encode and decode Base64 strings
- **CSS Minifier**: Minify CSS code to reduce file size
- **Regex Tester**: Test regular expressions with real-time feedback
- **JWT Decoder**: Decode and verify JSON Web Tokens
- **Hash Generator**: Generate MD5, SHA1, SHA256 hashes
- **Password Generator**: Generate secure passwords with custom options
- **URL Encoder/Decoder**: Encode and decode URLs
- **URL Shortener Pro**: Create short URLs with analytics
- **Find My IP Address**: Display your current IP address and location
- **Lorem Ipsum Generator**: Generate placeholder text with customization

### 🧮 Math Tools (9 tools)

- **Calculator**: Basic arithmetic calculator with history
- **Unit Converter**: Convert between 100+ units across 10+ categories ⭐
- **Matrix Calculator**: Perform matrix operations and calculations
- **Statistics Calculator**: Calculate statistical measures from data sets
- **Equation Solver**: Solve linear and quadratic equations step-by-step
- **Age Calculator**: Calculate exact age in years, months, and days
- **Addition Tables**: Generate addition tables for learning
- **Multiplication Tables**: Generate multiplication tables for practice
- **Percentage Calculator**: Calculate percentages, tips, discounts, and changes ⭐

### 💰 Finance Tools (7 tools)

- **Loan Calculator**: Calculate EMI, interest, and amortization schedules ⭐
- **SIP Calculator**: Calculate mutual fund SIP returns and growth ⭐
- **PPF Calculator**: Calculate Public Provident Fund maturity and returns ⭐
- **SSY Calculator**: Calculate Sukanya Samriddhi Yojana returns
- **SWP Calculator**: Calculate Systematic Withdrawal Plan projections
- **Lumpsum Calculator**: Calculate lumpsum investment returns
- **NPS Calculator**: Calculate National Pension System benefits

### 🏥 Healthcare Tools (3 tools)

- **BMI Calculator**: Calculate Body Mass Index and health status
- **Blood Pressure Calculator**: Analyze blood pressure readings
- **Calorie Calculator**: Calculate daily calorie needs and burn rates

### ⏰ Time Tools (4 tools)

- **Time Converter**: Convert between different time units
- **Timestamp Converter**: Convert Unix timestamps to readable dates
- **Stopwatch**: Online stopwatch for timing activities
- **Countdown Timer**: Set countdown timers for events and deadlines

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.5
- **UI Library**: Material-UI 5.14
- **Styling**: Tailwind CSS 3.4
- **Animation**: Framer Motion
- **Icons**: Lucide Icons + Material-UI Icons
- **PWA**: next-pwa for offline functionality
- **SEO**: Built-in Next.js SEO optimization
- **Analytics**: Google AdSense integration
- **Deployment**: Vercel
- **Package Manager**: Yarn

## ✨ Key Benefits

- **🔒 Privacy-Focused**: All processing happens in your browser - no data sent to servers
- **📱 PWA Ready**: Install as a Progressive Web App for offline access
- **🎨 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🌙 Dark/Light Mode**: Automatic theme switching with user preference
- **♿ Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **⚡ Fast Performance**: Server-side rendering with Next.js for optimal speed
- **🔍 SEO Optimized**: Structured data and meta tags for better search visibility
- **📊 Analytics Ready**: Google AdSense integration for monetization
- **🆓 Completely Free**: No registration, subscriptions, or hidden costs
- **🌐 Multi-Category**: 50+ tools across 8 different categories

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Yarn** (recommended) or npm
- **Git** for version control

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/kodekit.git
cd kodekit
```

2. **Install dependencies:**

```bash
yarn install
# or
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxxx
```

### Development

**Start the development server:**

```bash
yarn dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`.

**Other useful commands:**

```bash
yarn lint          # Run ESLint
yarn type-check    # Run TypeScript checks
yarn clean         # Clean build artifacts
```

### Building for Production

**Build the application:**

```bash
yarn build
# or
npm run build
```

**Start production server:**

```bash
yarn start
# or
npm start
```

**Generate sitemap:**

```bash
yarn postbuild    # Automatically runs after build
```

## 📂 Project Structure

```
kodekit/
├── app/                    # Next.js App Router pages
│   ├── category/          # Category pages
│   ├── tools/             # Individual tool pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   └── not-found.tsx     # 404 page
├── components/            # Reusable UI components
│   ├── tools/            # Individual tool components
│   ├── AdSense.tsx       # Google AdSense integration
│   ├── Footer.tsx        # Site footer
│   ├── Hero.tsx          # Homepage hero section
│   └── Navigation.tsx    # Site navigation
├── lib/                  # Utility libraries
│   ├── data/            # Static data and configurations
│   ├── utils/           # Utility functions
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
│   ├── icons/          # Tool and category icons
│   ├── images/         # Images and graphics
│   └── manifest.json   # PWA manifest
├── docs/               # Documentation
├── scripts/            # Build and utility scripts
├── .env.example        # Environment variables template
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** by opening an issue
- 💡 **Suggest new tools** or features
- 🔧 **Submit code improvements** via pull requests
- 📚 **Improve documentation** and examples
- 🌍 **Add translations** for internationalization

### Development Process

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/yourusername/kodekit.git
   ```
3. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-new-tool
   ```
4. **Make your changes** following our guidelines
5. **Test thoroughly** and ensure no regressions
6. **Commit with clear messages:**
   ```bash
   git commit -m "feat: add percentage calculator tool"
   ```
7. **Push** and create a Pull Request

### Development Guidelines

- ✅ **Code Style**: Follow existing TypeScript/React patterns
- ✅ **Components**: Use Material-UI components when possible
- ✅ **Responsive**: Ensure mobile-first responsive design
- ✅ **Accessibility**: Include proper ARIA labels and keyboard navigation
- ✅ **Performance**: Optimize for Core Web Vitals
- ✅ **SEO**: Add proper meta tags and structured data
- ✅ **Testing**: Test on multiple devices and browsers

### Adding New Tools

1. **Create tool component** in `components/tools/`
2. **Add tool data** to `lib/data/toolsData.ts`
3. **Add route** in `app/tools/[toolName]/page.tsx`
4. **Add icon** to `lib/utils/toolIcons.tsx`
5. **Update documentation** and README

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Pcroject Stats

- **🛠️ Total Tools**: 50+ across 8 categories
- **⭐ Popular Tools**: 12 most-used tools highlighted
- **📱 PWA Score**: 100/100 on Lighthouse
- **🚀 Performance**: Optimized for Core Web Vitals
- **🌍 SEO Score**: 100/100 with structured data
- **♿ Accessibility**: WCAG 2.1 AA compliant
- **📦 Bundle Size**: Optimized with code splitting
- **🔄 Updates**: Regular tool additions and improvements

## 🌟 Popular Tools

The most frequently used tools on KodeKit:

1. **Unit Converter** - 100+ units across 10+ categories
2. **Loan Calculator** - EMI and amortization calculations
3. **SIP Calculator** - Mutual fund investment planning
4. **PPF Calculator** - Public Provident Fund calculations
5. **Percentage Calculator** - Tips, discounts, and changes
6. **Image to PDF Converter** - Convert images to PDF
7. **PDF Merger** - Combine multiple PDFs
8. **JSON Formatter** - Format and validate JSON
9. **Password Generator** - Secure password creation
10. **QR Code Generator** - Generate QR codes

## 🙏 Acknowledgements

- **[Next.js](https://nextjs.org/)** - React framework for production
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Material-UI](https://mui.com/)** - React UI component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF generation library
- **[Vercel](https://vercel.com/)** - Deployment and hosting platform

## � Loinks

- **🌐 Live Website**: [https://kodekit.in](https://kodekit.in)
- **📱 PWA Install**: Available on all devices
- **📖 Documentation**: [https://kodekit.in/docs](https://kodekit.in/docs)
- **🗺️ Sitemap**: [https://kodekit.in/sitemap-page](https://kodekit.in/sitemap-page)
- **❓ FAQ**: [https://kodekit.in/faq](https://kodekit.in/faq)

## 📧 Contact & Support

- **📧 Email**: [kanagarajwhb@gmail.com](mailto:kanagarajwhb@gmail.com)
- **🌐 Website**: [https://kodekit.in/contact](https://kodekit.in/contact)
- **🐛 Issues**: [GitHub Issues](https://github.com/yourusername/kodekit/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/yourusername/kodekit/discussions)
- **☕ Support**: [Buy me a coffee](https://buymeacoffee.com/kanagarajwn)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [KK](https://github.com/kanagu555) | Deployed on [Vercel](https://vercel.com)

</div>
