'use client';
import { useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Sparkles, Play, Github, Menu, X } from 'lucide-react';
import { CodeEditor } from '@/components/CodeEditor';
import { PreviewPanel } from '@/components/PreviewPanel';

const EXAMPLE_PROMPTS = [
  'Create a beautiful todo list with animations and gradient design',
  'Build a weather dashboard with cards and smooth transitions',
  'Make an interactive pricing calculator with slider controls',
  'Design a sleek contact form with validation and success state',
  'Create a modern login page with animated background',
  'Build a product card with hover effects and image carousel',
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error('Please enter a description');
    if (prompt.length > 2000) return toast.error('Prompt too long (max 2000)');
    setIsGenerating(true);
    setShowPreview(true);
    setGeneratedCode('');
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Generation failed');
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data:'));
        for (const line of lines) {
          const data = JSON.parse(line.replace('data:', '').trim());
          if (data.stage === 'code' && data.content) {
            acc += data.content;
            setGeneratedCode(acc);
          } else if (data.stage === 'error') {
            throw new Error(data.error);
          }
        }
      }
      toast.success('App generated!');
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        toast.error(e.message);
        console.error(e);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsGenerating(false);
    toast.success('Generation stopped');
  };

  const handleReset = () => {
    setShowPreview(false);
    setGeneratedCode('');
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <header className="sticky top-0 z-50 border-b border-orange-200 bg-white/95 backdrop-blur-xl shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-pink-600 p-2.5 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                RAJ AI APP BUILDER
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200 text-sm text-gray-700">
                Powered by Cerebras AI
              </div>
              <a
                href="https://github.com/rajshah9305/NLPCEREBRAS"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-shadow hover:shadow-lg"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            </div>
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileMenuOpen(p => !p)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden px-4 pb-4 border-t border-orange-200">
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200 text-sm text-gray-700">
                  Powered by Cerebras AI
                </div>
                <a
                  href="https://github.com/rajshah9305/NLPCEREBRAS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold w-fit"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </div>
            </div>
          )}
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-68px)] overflow-y-auto">
          {!showPreview ? (
            <div className="max-w-5xl mx-auto flex flex-col">
              <div className="text-center mb-6 space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-b from-orange-900 via-orange-600 to-orange-400 bg-clip-text text-transparent">
                    Think It. Build It.
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
                  Transform natural language into production-ready AI applications
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-6">
                <div className="p-6 sm:p-8">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Describe your app</label>
                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="E.g. Create a modern todo list with drag and drop, animations, and a beautiful gradient design..."
                    className="w-full h-24 sm:h-28 px-4 py-3 text-gray-900 placeholder-gray-400 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 resize-none outline-none"
                    onKeyDown={e => {
                      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && prompt.trim() && !isGenerating) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                  />
                  <div className="mt-3 flex justify-between items-center text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">⌘</kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd>
                      <span className="hidden sm:inline">to generate</span>
                    </span>
                    <span className="font-semibold">{prompt.length} / 2000</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 sm:px-8 py-4 border-t border-orange-200">
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating your app...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate App</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  <p className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-widest">Try Examples</p>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {EXAMPLE_PROMPTS.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(ex)}
                      className="text-left p-3.5 sm:p-4 bg-white rounded-xl border-2 border-orange-200 hover:border-orange-500 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 p-1.5 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                          <Play className="w-3.5 h-3.5 text-orange-600" />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-2 group-hover:text-gray-900">
                          {ex}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col xl:grid xl:grid-cols-2 gap-2 sm:gap-3">
              {/* Mobile-only prompt bar */}
              <div className="xl:hidden bg-white rounded-lg shadow-lg border border-gray-200 p-2 sm:p-3 flex-shrink-0">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Your Prompt</h3>
                  <button onClick={handleReset} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors">
                    New App
                  </button>
                </div>
                <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">{prompt}</p>
              </div>

              {/* Desktop left column */}
              <div className="hidden xl:flex xl:flex-col xl:space-y-2 xl:h-full">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Your Prompt</h3>
                    <button onClick={handleReset} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors">
                      New App
                    </button>
                  </div>
                  <p className="text-gray-700 text-xs line-clamp-3">{prompt}</p>
                </div>
                <div className="flex-1 min-h-0">
                  <CodeEditor code={generatedCode} isStreaming={isGenerating} onCodeChange={setGeneratedCode} />
                </div>
              </div>

              {/* Preview */}
              <div className="flex-1 min-h-0">
                <PreviewPanel code={generatedCode} />
              </div>

              {/* Mobile code editor */}
              <div className="xl:hidden flex-1 min-h-0">
                <CodeEditor code={generatedCode} isStreaming={isGenerating} onCodeChange={setGeneratedCode} />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
