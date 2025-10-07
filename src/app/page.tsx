‘use client’;
import { useState, useRef } from ‘react’;
import toast, { Toaster } from ‘react-hot-toast’;
import { Loader2, Sparkles, Play, Github, Menu, X } from ‘lucide-react’;
import { CodeEditor } from ‘@/components/CodeEditor’;
import { PreviewPanel } from ‘@/components/PreviewPanel’;

const EXAMPLE_PROMPTS = [
‘Create a beautiful todo list with animations and gradient design’,
‘Build a weather dashboard with cards and smooth transitions’,
‘Make an interactive pricing calculator with slider controls’,
‘Design a sleek contact form with validation and success state’,
‘Create a modern login page with animated background’,
‘Build a product card with hover effects and image carousel’,
];

export default function Home() {
const [prompt, setPrompt] = useState(’’);
const [generatedCode, setGeneratedCode] = useState(’’);
const [isGenerating, setIsGenerating] = useState(false);
const [showPreview, setShowPreview] = useState(false);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const abortControllerRef = useRef<AbortController | null>(null);

const handleGenerate = async () => {
if (!prompt.trim()) {
toast.error(‘Please enter a description’);
return;
}

```
if (prompt.length > 2000) {
  toast.error('Prompt too long (max 2000 characters)');
  return;
}

setIsGenerating(true);
setShowPreview(true);
setGeneratedCode('');

// Abort any existing request
abortControllerRef.current?.abort();
abortControllerRef.current = new AbortController();

try {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    signal: abortControllerRef.current.signal,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Generation failed');
  }
  
  if (!res.body) {
    throw new Error('No response body');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let accumulatedCode = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.startsWith('data:'));

    for (const line of lines) {
      try {
        const data = JSON.parse(line.replace('data:', '').trim());
        
        if (data.stage === 'code' && data.content) {
          accumulatedCode += data.content;
          setGeneratedCode(accumulatedCode);
        } else if (data.stage === 'complete') {
          toast.success('Component generated successfully!');
        } else if (data.stage === 'error') {
          throw new Error(data.error || 'Generation failed');
        }
      } catch (parseError) {
        console.error('Error parsing SSE data:', parseError);
      }
    }
  }
} catch (error: any) {
  if (error.name !== 'AbortError') {
    console.error('Generation error:', error);
    toast.error(error.message || 'Failed to generate component');
    setShowPreview(false);
  }
} finally {
  setIsGenerating(false);
}
```

};

const handleStop = () => {
abortControllerRef.current?.abort();
setIsGenerating(false);
toast.success(‘Generation stopped’);
};

const handleReset = () => {
setShowPreview(false);
setGeneratedCode(’’);
setPrompt(’’);
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
if ((e.metaKey || e.ctrlKey) && e.key === ‘Enter’ && prompt.trim() && !isGenerating) {
e.preventDefault();
handleGenerate();
}
};

return (
<>
<Toaster position="top-center" />
<div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
{/* Header */}
<header className=“sticky top-0 z-50 border-b border-orange-200 bg-white/95 backdrop-blur-xl
