'use client';
import { useState, useMemo } from 'react';
import { Eye, RefreshCw, Copy, AlertTriangle } from 'lucide-react';
import { Sandpack } from '@codesandbox/sandpack-react';
import toast from 'react-hot-toast';

interface Props {
  code: string;
}

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.{js,ts,jsx,tsx}',
    './components/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

const indexTsx = `import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`;

const placeholderApp = `export default function App() {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'Inter, sans-serif',color:'#64748b'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'48px',marginBottom:'16px',opacity:.3}}>⚡</div>
        <div style={{fontSize:'14px'}}>Generate a component to see live preview</div>
      </div>
    </div>
  );
}`;

export function PreviewPanel({ code }: Props) {
  const [key, setKey] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const files = useMemo(() => {
    let appCode = placeholderApp;
    if (code.trim()) {
      let cleaned = code
        .replace(/^```(tsx?|javascript|jsx?)?\s*\n/gm, '')
        .replace(/\n```\s*$/gm, '')
        .trim();

      if (!cleaned.includes('export default')) {
        const fn = cleaned.match(/function\s+(\w+)/) || cleaned.match(/const\s+(\w+)\s*=/);
        if (fn?.[1]) cleaned += `\n\nexport default ${fn[1]};`;
      }
      appCode = cleaned;
    }

    setHasError(false);
    return {
      '/App.tsx': appCode,
      '/index.tsx': { code: indexTsx, hidden: true },
      '/styles.css': { code: indexCss, hidden: true },
      '/tailwind.config.js': { code: tailwindConfig, hidden: true },
      '/postcss.config.js': { code: postcssConfig, hidden: true },
    };
  }, [code]);

  const copy = () => navigator.clipboard.writeText(code).then(() => toast.success('Copied'));
  const refresh = () => { setKey(k => k + 1); setHasError(false); toast.success('Preview refreshed'); };
  const fallback = () => { setUseFallback(true); toast('Switched to fallback preview'); };

  const Fallback = () => (
    <div className="p-6 text-center text-gray-500">
      <div className="space-y-4">
        <div className="text-4xl opacity-30">📝</div>
        <div className="text-sm">Code Preview (static mode)</div>
        <pre className="text-left bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-64"><code>{code}</code></pre>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full">
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">Live Preview</h3>
          {code && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${hasError ? 'bg-red-100 text-red-700' : useFallback ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
              <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-500' : useFallback ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
              <span className="hidden sm:inline">{hasError ? 'Error' : useFallback ? 'Static' : 'Live'}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {code && (
            <>
              <button onClick={copy} className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Copy code">
                <Copy size={12} className="sm:w-4 sm:h-4" />
              </button>
              <button onClick={refresh} className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Refresh preview">
                <RefreshCw size={12} className="sm:w-4 sm:h-4" />
              </button>
              {!useFallback && (
                <button onClick={fallback} className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Switch to fallback mode">
                  <AlertTriangle size={12} className="sm:w-4 sm:h-4" />
                </button>
              )}
            </>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye size={12} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{useFallback ? 'Static' : 'Interactive'}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 p-2 sm:p-4 min-h-0">
        {hasError && (
          <div className="mb-2 sm:mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertTriangle size={14} className="sm:w-4 sm:h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-red-700">There was an issue parsing the generated code. Try refreshing or generating a new component.</div>
          </div>
        )}
        <div className="h-full bg-gray-50 rounded-lg overflow-hidden">
          {!code ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center space-y-3">
                <Eye size={48} className="mx-auto opacity-20" />
                <div className="text-sm">Live preview will appear here</div>
                <div className="text-xs opacity-75">Interactive component rendering</div>
              </div>
            </div>
          ) : useFallback ? (
            <Fallback />
          ) : (
            <Sandpack
              key={key}
              template="react-ts"
              files={files}
              theme={{
                colors: { surface1: '#ffffff', surface2: '#f8fafc', accent: '#f97316', error: '#ef4444' },
                syntax: { plain: '#1e293b', keyword: '#7c3aed', tag: '#dc2626', string: '#059669' },
                font: { body: 'Inter, sans-serif', mono: 'Fira Code, monospace', size: '13px', lineHeight: '1.4' },
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
                recompileDelay: 300,
                showConsole: false,
              }}
              customSetup={{
                files: files,
                dependencies: {
                  'lucide-react': 'latest',
                  'tailwindcss': 'latest',
                  'postcss': 'latest',
                  'autoprefixer': 'latest'
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
