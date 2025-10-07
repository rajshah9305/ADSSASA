‘use client’;
import { useState, useMemo, useEffect } from ‘react’;
import { Eye, RefreshCw, Copy, AlertTriangle, CheckCircle } from ‘lucide-react’;
import { Sandpack } from ‘@codesandbox/sandpack-react’;
import toast from ‘react-hot-toast’;

interface Props {
code: string;
}

const tailwindConfig = `/** @type {import('tailwindcss').Config} */ module.exports = { content: [ './**/*.{js,ts,jsx,tsx}', ], theme: { extend: {}, }, plugins: [], }`;

const postcssConfig = `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {}, }, }`;

const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
margin: 0;
padding: 0;
}`;

const indexTsx = `import React, { StrictMode } from ‘react’;
import { createRoot } from ‘react-dom/client’;
import ‘./styles.css’;
import App from ‘./App’;

const root = createRoot(document.getElementById(‘root’)!);
root.render(
<StrictMode>
<App />
</StrictMode>
);`;

const placeholderApp = `export default function App() { return ( <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}> <div style={{textAlign: 'center', padding: '2rem'}}> <div style={{fontSize: '64px', marginBottom: '1rem', opacity: 0.9}}>⚡</div> <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '0.5rem'}}> Ready to Build </h2> <p style={{fontSize: '16px', opacity: 0.8}}> Generate a component to see live preview </p> </div> </div> ); }`;

export function PreviewPanel({ code }: Props) {
const [key, setKey] = useState(0);
const [hasError, setHasError] = useState(false);
const [errorMessage, setErrorMessage] = useState(’’);
const [isReady, setIsReady] = useState(false);

// Reset error state when code changes
useEffect(() => {
if (code) {
setHasError(false);
setErrorMessage(’’);
setIsReady(false);
}
}, [code]);

const files = useMemo(() => {
let appCode = placeholderApp;

```
if (code.trim()) {
  try {
    // Clean up the code
    let cleaned = code
      .replace(/^```(?:tsx?|javascript|jsx?)?\s*\n/gm, '')
      .replace(/\n```\s*$/gm, '')
      .trim();

    // Ensure export default exists
    if (!cleaned.includes('export default')) {
      const functionMatch = cleaned.match(/function\s+([A-Z]\w+)/);
      const constMatch = cleaned.match(/const\s+([A-Z]\w+)\s*=/);
      const componentName = functionMatch?.[1] || constMatch?.[1] || 'App';
      cleaned += `\n\nexport default ${componentName};`;
    }

    appCode = cleaned;
    setIsReady(true);
  } catch (error) {
    console.error('Error processing code:', error);
    setHasError(true);
    setErrorMessage('Failed to process generated code');
  }
}

return {
  '/App.tsx': { code: appCode, active: true },
  '/index.tsx': { code: indexTsx, hidden: true },
  '/styles.css': { code: indexCss, hidden: true },
  '/tailwind.config.js': { code: tailwindConfig, hidden: true },
  '/postcss.config.js': { code: postcssConfig, hidden: true },
};
```

}, [code]);

const handleCopy = () => {
navigator.clipboard.writeText(code).then(() => {
toast.success(‘Code copied to clipboard!’);
}).catch(() => {
toast.error(‘Failed to copy code’);
});
};

const handleRefresh = () => {
setKey(prev => prev + 1);
setHasError(false);
setErrorMessage(’’);
toast.success(‘Preview refreshed!’);
};

return (
<div className="flex-1 flex flex-col bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full">
{/* Header */}
<div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
<div className="flex items-center gap-2">
<h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">
Live Preview
</h3>
{code && !hasError && isReady && (
<div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
<CheckCircle className="w-3 h-3" />
<span className="hidden sm:inline">Ready</span>
</div>
)}
{hasError && (
<div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
<AlertTriangle className="w-3 h-3" />
<span className="hidden sm:inline">Error</span>
</div>
)}
</div>

```
    <div className="flex items-center gap-1 sm:gap-2">
      {code && (
        <>
          <button 
            onClick={handleCopy}
            className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Copy code"
            aria-label="Copy code"
          >
            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button 
            onClick={handleRefresh}
            className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Refresh preview"
            aria-label="Refresh preview"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </>
      )}
      <div className="flex items-center gap-1 text-xs text-gray-500 ml-1">
        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Live</span>
      </div>
    </div>
  </div>

  {/* Error Banner */}
  {hasError && errorMessage && (
    <div className="px-2 sm:px-4 py-2 bg-red-50 border-b border-red-200 flex items-start gap-2">
      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-xs sm:text-sm text-red-700 font-medium">
          Preview Error
        </p>
        <p className="text-xs text-red-600 mt-0.5">
          {errorMessage}
        </p>
      </div>
      <button 
        onClick={handleRefresh}
        className="text-xs text-red-700 hover:text-red-900 font-medium"
      >
        Retry
      </button>
    </div>
  )}

  {/* Preview Content */}
  <div className="flex-1 p-2 sm:p-4 min-h-0 overflow-hidden">
    <div className="h-full bg-gray-50 rounded-lg overflow-hidden shadow-inner">
      {!code ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center space-y-3 p-4">
            <Eye size={48} className="mx-auto opacity-20" />
            <div className="text-sm font-medium">Live preview will appear here</div>
            <div className="text-xs opacity-75">
              Your generated component will render in real-time
            </div>
          </div>
        </div>
      ) : (
        <Sandpack
          key={key}
          template="react-ts"
          files={files}
          theme={{
            colors: {
              surface1: '#ffffff',
              surface2: '#f8fafc',
              surface3: '#e2e8f0',
              clickable: '#f97316',
              base: '#1e293b',
              disabled: '#94a3b8',
              hover: '#cbd5e1',
              accent: '#f97316',
              error: '#ef4444',
              errorSurface: '#fee2e2',
            },
            syntax: {
              plain: '#1e293b',
              comment: { color: '#64748b', fontStyle: 'italic' },
              keyword: '#7c3aed',
              tag: '#dc2626',
              punctuation: '#475569',
              definition: '#0ea5e9',
              property: '#0891b2',
              static: '#7c3aed',
              string: '#059669',
            },
            font: {
              body: 'Inter, system-ui, -apple-system, sans-serif',
              mono: 'Fira Code, Monaco, Courier New, monospace',
              size: '13px',
              lineHeight: '1.5',
            },
          }}
          options={{
            showNavigator: false,
            showTabs: false,
            showLineNumbers: false,
            editorHeight: '100%',
            editorWidthPercentage: 0,
            autorun: true,
            autoReload: true,
            recompileMode: 'delayed',
            recompileDelay: 500,
            showConsole: false,
            showConsoleButton: false,
            showRefreshButton: false,
          }}
          customSetup={{
            dependencies: {
              'lucide-react': 'latest',
              'tailwindcss': '^3.4.0',
              'postcss': '^8.4.0',
              'autoprefixer': '^10.4.0',
            },
          }}
        />
      )}
    </div>
  </div>
</div>
```

);
}
