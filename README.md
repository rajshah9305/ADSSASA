# 🚀 RAJ AI APP BUILDER

Build beautiful React applications instantly using AI-powered code generation. Transform natural language into production-ready components with live preview and seamless deployment.

![RAJ AI APP BUILDER](https://via.placeholder.com/800x400/18181B/FFFFFF?text=RAJ+AI+APP+BUILDER)

## ✨ Features

- **🤖 AI-Powered Generation**: Generate React components using Cerebras AI (gpt-oss-120b model)
- **⚡ Real-time Streaming**: Watch code being generated live, character by character
- **📱 Interactive Preview**: Live component preview with Sandpack sandbox
- **🎨 Beautiful UI**: Modern design with Tailwind CSS, fully responsive
- **🔧 Professional Development**: Full TypeScript support, ESLint, and production-ready code
- **💾 Code Management**: Copy, download, and edit generated components
- **🚀 Easy Deployment**: Instant deployment to Vercel with one click
- **🔄 Hot Reloading**: Edit components and see changes instantly

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- A Cerebras AI API key (free to get)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/raj-ai-app-builder.git
   cd raj-ai-app-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env.local

   # Edit .env.local and add your Cerebras API key
   # Get your free API key from: https://cloud.cerebras.ai/
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Start generating your first React component!

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2.33 (App Router)
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.18
- **State Management**: React useState/useRef hooks
- **Icons**: Lucide React 0.263.1

### AI & APIs
- **AI Model**: Cerebras AI (gpt-oss-120b)
- **SDK**: Cerebras Cloud SDK 1.5.0
- **Code Preview**: Sandpack React 2.20.0

### Development & Quality
- **Linting**: ESLint 8.56.0
- **Formatting**: Prettier (via VS Code)
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Next.js built-in bundler (SWC)

### Infrastructure
- **Hosting**: Vercel (recommended)
- **CI/CD**: GitHub Actions (optional)
- **Security**: Security headers, CSP, HTTPS

## 📁 Project Structure

```
raj-ai-app-builder/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout component
│   │   ├── page.tsx            # Main application page
│   │   ├── globals.css         # Global styles and utilities
│   │   └── api/
│   │       └── generate/
│   │           └── route.ts     # Cerebras AI API integration
│   ├── components/
│   │   ├── CodeEditor.tsx      # Code editor with copy/download
│   │   └── PreviewPanel.tsx    # Sandpack-based live preview
│   └── constants/
│       └── index.ts            # Application constants
├── .env.local                  # Environment variables (gitignored)
├── .env.example                # Environment variables template
├── package.json                # Dependencies and scripts
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🧪 Testing & Development

### Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build application for production
npm run start        # Start production server locally
npm run lint         # Run ESLint with auto-fix
npm run type-check   # Run TypeScript compiler check
```

### Testing the Application

1. **Start the dev server**: `npm run dev`
2. **Open the app**: Visit `http://localhost:3000`
3. **Test AI generation**:
   - Try the example prompts
   - Or enter custom descriptions like:
     - "Create a modern todo list with drag and drop"
     - "Build a weather dashboard with cards"
     - "Make an interactive pricing calculator"
4. **Check preview**: Components render in real-time
5. **Copy/download code**: Use the buttons in the code editor
6. **Mobile responsiveness**: Test on different screen sizes

### Quality Assurance
```bash
# Run all checks
npm run lint && npm run type-check && npm run build

# Or use the convenience script (if available)
npm run validate
```

## 🚀 Deployment

### Option 1: Vercel (Recommended) - 1-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/raj-ai-app-builder)

1. **Fork this repository** on GitHub
2. **Click the Vercel button** above
3. **Connect your Vercel account** to GitHub
4. **Add environment variable**:
   - Name: `CEREBRAS_API_KEY`
   - Value: `your-api-key-here`
5. **Deploy automatically**

### Option 2: Manual Vercel Deploy

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Connect to Vercel**
   ```bash
   vercel
   ```

3. **Add environment variable**
   ```bash
   vercel env add CEREBRAS_API_KEY
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 3: Other Platforms

The app is framework-agnostic and can be deployed to:
- Netlify: `npm run build && netlify deploy --dir=out --prod`
- GitHub Pages: Update package.json scripts for export
- Docker: See Docker deployment guide (if needed)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `CEREBRAS_API_KEY` | Your Cerebras AI API key | Yes | - |

### Getting API Keys

1. **Cerebras AI**:
   - Visit [https://cloud.cerebras.ai/](https://cloud.cerebras.ai/)
   - Sign up for a free account
   - Generate an API key
   - Copy it to `.env.local`

## 📖 Usage Guide

### Generating Components

1. **Describe your component** using natural language
   - "Create a beautiful todo app with animations"
   - "Build a weather dashboard with cards and gradients"
   - "Make an interactive calculator with sliders"

2. **Watch real-time generation**
   - Code appears character by character
   - Preview updates automatically

3. **Copy or download**
   - Click "Copy" to copy to clipboard
   - Click "Download" to save as .tsx file

### Advanced Usage

- **Custom prompts**: Be specific about styling, interactions, and functionality
- **Framework agnostic**: Code is compatible with React, Next.js, Vite, etc.
- **Responsive design**: All components are mobile-first and responsive
- **Tailwind CSS**: Uses utility-first CSS classes

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/raj-ai-app-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/raj-ai-app-builder/discussions)
- **Documentation**: This README and inline code comments

## 🌟 Acknowledgments

- **Cerebras AI** for powering the code generation
- **Sandpack** for the interactive code preview
- **Next.js** and **Vercel** for the amazing developer experience
- **Open source community** for the incredible tools and libraries

---

**Built with ❤️ by RAJ**

[🔗 Live Demo](https://raj-ai-app-builder.vercel.app) • [📚 Documentation](https://github.com/yourusername/raj-ai-app-builder) • [🛠️ GitHub](https://github.com/yourusername/raj-ai-app-builder)
