‘use client’;
import { useEffect, useRef } from ‘react’;
import { Copy, Download } from ‘lucide-react’;
import toast from ‘react-hot-toast’;

interface Props {
code: string;
isStreaming: boolean;
onCodeChange: (code: string) => void;
}

export function CodeEditor({ code, isStreaming, onCodeChange }: Props) {
const ref = useRef<HTMLTextAreaElement>(null);

// Auto-scroll to bottom during streaming
useEffect(() => {
if (ref.current && isStreaming) {
ref.current.scrollTop = ref.current.scrollHeight;
}
}, [code, isStreaming]);

const handleCopy = () => {
if (!code) {
toast.error(‘No code to copy’);
return;
}

```
navigator.clipboard.writeText(code)
  .then(() => toast.success('Code copied to clipboard!'))
  .catch(() => toast.error('Failed to copy code'));
```

};

const handleDownload = () => {
if (!code) {
toast.error(‘No code to download’);
return;
}

```
try {
  const blob = new Blob([code], { type: 'text/typescript' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'GeneratedComponent.tsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success('Component downloaded!');
} catch (error) {
  console.error('Download error:', error);
  toast.error('Failed to download component');
}
```

};

return (
<div className="flex-1 flex flex-col bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full">
{/* Header */}
<div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
<div className="flex items-center gap-2">
<h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">
Generated Code
</h3>
{isStreaming && (
<div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
<div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
<span className="hidden sm:inline">Streaming</span>
</div>
)}
</div>

```
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        onClick={handleCopy}
        disabled={!code}
        className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Copy code to clipboard"
      >
        <Copy className="w-4 h-4" />
        <span className="hidden sm:inline">Copy</span>
      </button>
      <button
        onClick={handleDownload}
        disabled={!code}
        className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Download as .tsx file"
      >
        <Download className="w-4 h-4" />
        <span className="hidden md:inline">Download</span>
      </button>
    </div>
  </div>

  {/* Code Editor Area */}
  <div className="flex-1 relative min-h-0">
    <textarea
      ref={ref}
      value={code}
      onChange={(e) => onCodeChange(e.target.value)}
      className={`w-full h-full p-2 sm:p-3 md:p-4 font-mono text-xs sm:text-sm bg-gray-900 text-gray-100 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 ${
        isStreaming ? 'streaming-cursor' : ''
      }`}
      placeholder="Generated React component code will appear here..."
      spellCheck={false}
      style={{
        fontFamily: 'Fira Code, Monaco, Courier New, monospace',
        lineHeight: '1.6',
        tabSize: 2,
      }}
    />
    
    {/* Empty State */}
    {!code && !isStreaming && (
      <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
        <div className="text-center space-y-2 p-4">
          <div className="text-4xl opacity-20">{'</>'}</div>
          <div className="text-sm">Generated code will stream here in real-time</div>
          <div className="text-xs opacity-75">
            Watch as AI writes your React component character by character
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Footer Info */}
  {code && !isStreaming && (
    <div className="px-2 sm:px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
      <span className="flex items-center gap-1">
        <span className="font-medium">{code.split('\n').length}</span> lines
      </span>
      <span className="flex items-center gap-1">
        <span className="font-medium">{code.length}</span> characters
      </span>
    </div>
  )}
</div>
```

);
}
