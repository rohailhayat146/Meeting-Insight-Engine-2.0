
import React, { useState, useRef, useEffect } from 'react';
import { analyzeMeeting, connectToLiveMeeting } from './services/geminiService';
import { MeetingAnalysis, DecisionStatus, UrgencyLevel } from './types';
import { AnalysisResult } from './components/AnalysisResult';
import { 
  FileText, 
  Sparkles, 
  Send, 
  Loader2, 
  AlertTriangle, 
  BarChart2, 
  BrainCircuit, 
  ArrowRight,
  Target, 
  CheckCircle, 
  Clock, 
  Mic, 
  MicOff, 
  Radio, 
  Shield, 
  Lock, 
  Users, 
  Code, 
  Briefcase, 
  Play, 
  Zap, 
  ChevronRight, 
  Layers
} from 'lucide-react';

// --- Animation Components ---

const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);

  const handleReset = () => {
    setAnalysis(null);
  };

  if (analysis) {
    return (
      <div className="min-h-screen bg-slate-50 animate-fade-up">
        <AnalysisResult analysis={analysis} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-all duration-300">
        <div className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="bg-slate-900 p-2 rounded-lg text-white shadow-lg shadow-slate-200">
            <BrainCircuit size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Meeting<span className="text-indigo-600">Insight</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#demo" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
          <a href="#security" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Enterprise Security</a>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <button className="text-sm font-bold text-white bg-slate-900 px-5 py-2 rounded-lg hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Book Demo
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-32 px-4 overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140vw] h-[100vh] bg-gradient-to-b from-indigo-50/80 via-white to-white rounded-[100%] blur-[100px] -z-10 pointer-events-none animate-gradient"></div>
        
        <div className="max-w-5xl mx-auto text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wide shadow-sm animate-fade-up">
            <Sparkles size={12} className="text-indigo-500" /> Enterprise Intelligence v2.0
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight animate-fade-up delay-100">
            Stop Summarizing. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Start Executing.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-up delay-200">
            The AI engine that transforms unstructured meeting audio into <span className="text-slate-900 font-semibold">structured decision logs</span>, <span className="text-slate-900 font-semibold">risk assessments</span>, and <span className="text-slate-900 font-semibold">strategic checkpoints</span>.
          </p>

          <div className="flex justify-center gap-4 animate-fade-up delay-300">
             <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 hover:shadow-indigo-200 hover:-translate-y-1 overflow-hidden"
              >
               <span className="relative z-10 flex items-center gap-2">Try Live Demo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
             </button>
          </div>
        </div>

        {/* Live Product Simulator Component */}
        <div id="demo" className="max-w-5xl mx-auto animate-fade-up delay-500">
          <ProductSimulation onAnalysisComplete={setAnalysis} />
        </div>
      </header>

      {/* Role-Based Solutions Section */}
      <section id="solutions" className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Built for the Modern Enterprise</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                Different stakeholders need different signals. Our engine parses context to deliver relevant value across the organization.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={100}>
              <RoleCard 
                icon={<Briefcase className="text-indigo-600" />}
                role="Leadership & Strategy"
                benefit="Operational Clarity"
                desc="Bypass the noise. Get high-level decision logs, risk matrices, and execution checkpoints instantly."
              />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <RoleCard 
                icon={<Users className="text-violet-600" />}
                role="Product & Management"
                benefit="Alignment & Accountability"
                desc="Auto-generated action items with clear ownership and deadlines. No more 'who was doing that?'"
              />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <RoleCard 
                icon={<Code className="text-emerald-600" />}
                role="Engineering & Tech"
                benefit="Requirement Precision"
                desc="Capture technical nuances and dependencies. Distinguish between brainstorming and confirmed specs."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section id="security" className="bg-slate-900 py-12 px-6 border-y border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
             <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
               <Lock className="text-emerald-400" size={24} />
             </div>
             <div>
               <h3 className="text-white font-bold text-lg">Enterprise-Grade Security</h3>
               <p className="text-slate-400 text-sm">Your data is processed ephemerally and encrypted in transit.</p>
             </div>
          </div>
          <div className="flex gap-8 text-slate-400 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-indigo-400" /> SOC2 Compliant Processing
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-indigo-400" /> Zero Data Retention
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-indigo-400" /> GDPR Ready
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Beyond Simple Transcription</h2>
                <p className="text-slate-500 max-w-xl text-lg">
                  Most tools give you text. We give you <span className="text-indigo-600 font-semibold">structure</span>.
                </p>
              </div>
              <a href="#" className="text-indigo-600 font-bold flex items-center gap-2 hover:gap-3 transition-all group">
                View Technical Specs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScrollReveal delay={0}>
              <FeatureCard 
                icon={<CheckCircle className="text-emerald-500" />}
                title="Decision Intelligence"
                desc="Distinguish between 'final decisions' and 'tentative thoughts' with high-confidence classification."
              />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <FeatureCard 
                icon={<Target className="text-indigo-500" />}
                title="Smart Action Items"
                desc="Tasks are extracted with inferred ownership, priority levels, and deadline suggestions."
              />
            </ScrollReveal>
            <ScrollReveal delay={200}>
               <FeatureCard 
                icon={<Mic className="text-rose-500" />}
                title="Real-Time Analysis"
                desc="Process live audio streams to generate insights the moment the meeting ends."
              />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <FeatureCard 
                icon={<AlertTriangle className="text-amber-500" />}
                title="Risk Detection"
                desc="Identify vague commitments and unresolved dependencies before they become blockers."
              />
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <FeatureCard 
                icon={<BarChart2 className="text-blue-500" />}
                title="Meeting Hygiene"
                desc="Quantify inefficiencies like circular discussions and lack of clear outcomes."
              />
            </ScrollReveal>
            <ScrollReveal delay={500}>
              <FeatureCard 
                icon={<Clock className="text-violet-500" />}
                title="Execution Checkpoints"
                desc="Pinpoint the single most critical next milestone to maintain momentum."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 px-6 border-t border-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400">
             <BrainCircuit size={20} />
             <span className="font-bold text-slate-200">MeetingInsight</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2024 Enterprise AI Solutions. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Product Simulation Component ---

const ProductSimulation: React.FC<{ onAnalysisComplete: (data: MeetingAnalysis) => void }> = ({ onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'live'>('demo');
  const [demoState, setDemoState] = useState<'idle' | 'processing' | 'done'>('idle');
  
  // State for Live Mode
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stopLiveSessionRef = useRef<(() => void) | null>(null);

  // Sample Data for Demo Animation
  const sampleTranscript = `Sarah (VP Eng): We need to confirm the Q4 migration timeline. The legacy API is causing 20% of support tickets.
David (CTO): Agreed. But we can't pause the 'One-Click Checkout' feature. It's critical for Black Friday.
Mike (Product): What if we split the team? 2 engineers on legacy migration, rest on checkout?
Sarah: That's tight, but doable if we start Monday.
David: Okay, let's proceed with the split team. Sarah, please assign the engineers by EOD tomorrow.
Mike: I'll update the roadmap to reflect reduced capacity.`;

  const playDemoAnimation = () => {
    setDemoState('processing');
    setTimeout(() => {
      setDemoState('done');
    }, 2500);
  };

  const handleLiveAnalyze = async () => {
    if (!inputText.trim()) return;
    if (isRecording) handleToggleRecording();
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeMeeting(inputText);
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      if (stopLiveSessionRef.current) {
        stopLiveSessionRef.current();
        stopLiveSessionRef.current = null;
      }
      setIsRecording(false);
    } else {
      setError(null);
      try {
        const cleanup = await connectToLiveMeeting(
          (text) => setInputText(prev => prev + text),
          () => setIsRecording(false)
        );
        stopLiveSessionRef.current = cleanup;
        setIsRecording(true);
      } catch (err) {
        setError("Microphone access denied.");
        setIsRecording(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stopLiveSessionRef.current) stopLiveSessionRef.current();
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-indigo-900/10 border border-slate-200 overflow-hidden ring-1 ring-slate-100">
      {/* Simulation Header */}
      <div className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex gap-1 p-1 bg-slate-200/50 rounded-lg">
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'demo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Preview Output
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'live' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Try Your Own
          </button>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex gap-1.5">
             <div className="w-3 h-3 rounded-full bg-slate-300"></div>
             <div className="w-3 h-3 rounded-full bg-slate-300"></div>
             <div className="w-3 h-3 rounded-full bg-slate-300"></div>
           </div>
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col md:flex-row">
        {activeTab === 'demo' ? (
          // --- DEMO MODE ---
          <>
            {/* Left: Input */}
            <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText size={12} /> Raw Transcript
                </span>
                {demoState === 'idle' && (
                  <button 
                    onClick={playDemoAnimation}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1"
                  >
                    <Play size={10} fill="currentColor" /> Simulate Processing
                  </button>
                )}
              </div>
              <div className="text-sm font-sans leading-relaxed text-slate-600 space-y-4 relative">
                {sampleTranscript.split('\n').map((line, i) => (
                  <p key={i} className={`transition-opacity duration-500 ${demoState === 'processing' ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
                    {line}
                  </p>
                ))}
                {demoState === 'processing' && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                     <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg border border-indigo-100 flex items-center gap-2 text-indigo-600 text-sm font-bold">
                       <Loader2 size={16} className="animate-spin" /> Analyzing Context...
                     </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Output */}
            <div className="w-full md:w-1/2 p-6 bg-white relative overflow-hidden">
               <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={12} /> Structured Intelligence
                </span>
              </div>
              
              {demoState === 'idle' && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                   <Layers size={48} strokeWidth={1} />
                   <p className="text-sm font-medium">Run simulation to see extraction</p>
                </div>
              )}

              {demoState === 'done' && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
                  {/* Decision Card */}
                  <div className="p-3 bg-green-50 border border-green-100 rounded-lg animate-in fade-in slide-in-from-bottom-2 delay-100">
                    <div className="flex items-start gap-2">
                       <CheckCircle size={16} className="text-green-600 mt-0.5" />
                       <div>
                         <p className="text-xs font-bold text-green-800 uppercase mb-1">Decision Confirmed</p>
                         <p className="text-sm text-slate-800 font-medium">Split team strategy approved: 2 engineers on Legacy Migration.</p>
                       </div>
                    </div>
                  </div>

                  {/* Action Item Card */}
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg animate-in fade-in slide-in-from-bottom-2 delay-300">
                    <div className="flex items-start gap-2">
                       <Target size={16} className="text-indigo-600 mt-0.5" />
                       <div className="w-full">
                         <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-bold text-indigo-800 uppercase">Action Item</p>
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 rounded font-bold">HIGH</span>
                         </div>
                         <p className="text-sm text-slate-800 font-medium mb-1">Assign engineers to Project Phoenix</p>
                         <div className="flex justify-between text-xs text-slate-500">
                            <span>Owner: Sarah</span>
                            <span>Due: EOD Tomorrow</span>
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Risk Card */}
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg animate-in fade-in slide-in-from-bottom-2 delay-500">
                    <div className="flex items-start gap-2">
                       <AlertTriangle size={16} className="text-amber-600 mt-0.5" />
                       <div>
                         <p className="text-xs font-bold text-amber-800 uppercase mb-1">Risk Detected</p>
                         <p className="text-sm text-slate-800 font-medium">Reduced capacity may impact "One-Click Checkout" delivery.</p>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // --- LIVE MODE ---
          <div className="w-full p-6 flex flex-col h-full min-h-[400px]">
             <div className="flex-1 relative mb-4">
              <textarea
                className={`custom-scrollbar w-full h-full p-4 text-slate-700 placeholder-slate-400 bg-slate-50 rounded-xl border font-sans text-base leading-relaxed resize-none focus:outline-none transition-all ${isRecording ? 'border-red-200 ring-2 ring-red-50' : 'border-slate-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50/30'}`}
                placeholder="Paste transcript or start live capture..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isAnalyzing}
              />
               {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-white px-2 py-1 rounded-md shadow-sm border border-red-100">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-red-500">REC</span>
                </div>
              )}
             </div>

             <div className="flex items-center justify-between gap-4">
               <button
                 onClick={handleToggleRecording}
                 disabled={isAnalyzing}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all ${isRecording ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
               >
                 {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                 {isRecording ? 'Stop' : 'Live Capture'}
               </button>

               <div className="flex items-center gap-3">
                 {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
                 <button
                  onClick={handleLiveAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className={`px-6 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2 transition-all ${isAnalyzing || !inputText.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
                 >
                   {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                   Analyze Now
                 </button>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub-components for visual consistency ---

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="group bg-white p-8 rounded-2xl border border-slate-200 transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 cursor-default relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10">
      <div className="mb-6 bg-slate-50 p-3 w-fit rounded-xl border border-slate-100 shadow-sm group-hover:bg-white group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
        {title} 
        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-400" />
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const RoleCard = ({ icon, role, benefit, desc }: { icon: React.ReactNode, role: string, benefit: string, desc: string }) => (
  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative overflow-hidden group hover:bg-white hover:shadow-xl hover:shadow-slate-200 transition-all duration-500 hover:-translate-y-1">
    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity scale-150 pointer-events-none grayscale group-hover:grayscale-0">
      {icon}
    </div>
    <div className="relative z-10">
      <div className="mb-6">{icon}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{role}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </div>
  </div>
);

export default App;
