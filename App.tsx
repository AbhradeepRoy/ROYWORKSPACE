
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Layout, Compass, User, TrendingUp, Plus, Trash2, 
  BrainCircuit, Loader2, ExternalLink, Sun, Moon, 
  Globe, Sparkles, ChevronRight, Zap, GraduationCap,
  Share2, MessageSquare, Send, X, Filter, ArrowUpDown, MapPin, Quote, LineChart,
  BookOpen, PlayCircle, Award, Flame
} from 'lucide-react';
import { StudentProfile, CareerRecommendation, GroundingSource, ChatMessage, SkillSuggestion } from './types';
import { getCareerRecommendations, searchMarketTrends, chatWithAI, getSkillSuggestions } from './services/geminiService';

const INDIAN_LANGUAGES = [
  'English', 'Hindi (हिंदी)', 'Bengali (বাংলা)', 'Marathi (मराठी)', 
  'Telugu (తెలుగు)', 'Tamil (தமிழ்)', 'Gujarati (ગુજરાતી)', 'Urdu (اردو)', 
  'Kannada (ಕನ್ನಡ)', 'Odia (ଓଡ଼ିଆ)', 'Malayalam (മലയാളം)', 'Punjabi (ਪੰਜਾਬੀ)',
  'Assamese (অসমীया)', 'Sanskrit (संस्कृतम्)'
];

const EDUCATION_LEVELS = [
  'School', 'High School', 'Undergraduate', 'Graduate', 'Post Graduation', 'Post Doc'
];

const TRANSLATIONS: Record<string, any> = {
  'English': {
    title: 'Future Path',
    subtitle: 'Personalized AI career mapping for the modern Indian workforce.',
    fullName: 'Full Name',
    language: 'Preferred Language',
    level: 'Current Education Level',
    major: 'Field of Study / Major',
    goals: 'Career Goals',
    goalsPlaceholder: 'What do you want to achieve in 5 years?',
    skills: 'Skills & Expertise',
    interests: 'Primary Interests',
    generate: 'Generate Visionary Roadmap',
    prophecy: 'Your Career Destiny',
    matchPotential: 'Match Potential',
    compensation: 'Expected Compensation',
    mastery: 'Essential Mastery',
    actionSteps: 'Actionable Steps',
    intelligence: 'Live Intelligence',
    marketTracking: 'Real-time market tracking for the Indian landscape.',
    deepDive: 'Deep Dive',
    sources: 'Verified Data Sources',
    placeholderSkill: 'Add skill (e.g. Python)',
    placeholderInterest: 'Add interest (e.g. Space)',
    placeholderName: 'e.g. Arjun Mehta',
    placeholderMajor: 'e.g. Commerce, B.Tech, Arts',
    placeholderTrends: 'e.g. AI role in Indian IT 2025',
    consulting: 'Consulting the Future...',
    loadingSub: 'Gemini AI is crafting your personalized Indian career roadmap.',
    navigator: 'Navigator',
    market: 'Market',
    profile: 'Profile',
    share: 'Share Path',
    chatPlaceholder: 'Ask me anything about your career...',
    filters: 'Filter & Sort',
    sortBy: 'Sort By',
    location: 'Location',
    salary: 'Salary',
    score: 'Alignment',
    marketOutlook: 'Market Outlook',
    skillsDiscovery: 'Skill Discovery',
    skillsSubtitle: 'High-value skills recommended for your profile and trending in India.',
    difficulty: 'Difficulty',
    resources: 'Learning Paths',
    trending: 'Trending',
    quotes: {
      profile: "The only way to do great work is to love what you do. Start by defining your core.",
      recommendations: "Your destiny is not a matter of chance; it is a matter of choice. Choose your path wisely.",
      trends: "The best way to predict the future is to create it. Stay ahead of the curve.",
      skills: "Skill is the bridge between where you are and where you want to be. Start building."
    }
  },
  'Hindi (हिंदी)': {
    title: 'भविष्य का पथ',
    subtitle: 'आधुनिक भारतीय कार्यबल के लिए व्यक्तिगत एआई करियर मैपिंग।',
    fullName: 'पूरा नाम',
    language: 'पसंदीदा भाषा',
    level: 'वर्तमान शिक्षा स्तर',
    major: 'अध्ययन का क्षेत्र / प्रमुख',
    goals: 'करियर के लक्ष्य',
    goalsPlaceholder: 'आप 5 वर्षों में क्या हासिल करना चाहते हैं?',
    skills: 'कौशल और विशेषज्ञता',
    interests: 'प्राथमिक रुचियां',
    generate: 'भविष्य का रोडमैप तैयार करें',
    prophecy: 'आपका भविष्यफल',
    matchPotential: 'मिलान क्षमता',
    compensation: 'अपेक्षित मुआवजा',
    mastery: 'आवश्यक महारत',
    actionSteps: 'कार्रवाई योग्य कदम',
    intelligence: 'लाइव इंटेलिजेंस',
    marketTracking: 'भारतीय परिदृश्य के लिए रीयल-टाइम मार्केट ट्रैकिंग।',
    deepDive: 'गहराई से जानें',
    sources: 'सत्यापित डेटा स्रोत',
    placeholderSkill: 'कौशल जोड़ें...',
    placeholderInterest: 'रुचि जोड़ें...',
    placeholderName: 'जैसे: अर्जुन मेहता',
    placeholderMajor: 'जैसे: वाणिज्य, बी.टेक, कला',
    placeholderTrends: 'जैसे: 2025 में भारतीय आईटी में एआई की भूमिका',
    consulting: 'भविष्य से परामर्श...',
    loadingSub: 'जेमिनी एआई आपका व्यक्तिगत भारतीय करियर रोडमैप तैयार कर रहा है।',
    navigator: 'नेविगेटर',
    market: 'बाज़ार',
    profile: 'प्रोफ़ाइल',
    share: 'साझा करें',
    chatPlaceholder: 'मुझसे कुछ भी पूछें...',
    filters: 'फिल्टर और सॉर्ट',
    sortBy: 'सॉर्ट करें',
    location: 'स्थान',
    salary: 'वेतन',
    score: 'मिलान',
    marketOutlook: 'बाज़ार का दृष्टिकोण',
    skillsDiscovery: 'कौशल खोज',
    skillsSubtitle: 'आपके प्रोफाइल के लिए अनुशंसित और भारत में प्रचलित उच्च-मूल्य वाले कौशल।',
    difficulty: 'कठिनाई',
    resources: 'सीखने के मार्ग',
    trending: 'प्रचलित',
    quotes: {
      profile: "महान कार्य करने का एकमात्र तरीका यह है कि आप जो करते हैं उससे प्रेम करें।",
      recommendations: "आपका भाग्य संयोग का विषय नहीं है; यह चुनाव का विषय है।",
      trends: "भविष्य की भविष्यवाणी करने का सबसे अच्छा तरीका इसे बनाना है।",
      skills: "कौशल वह पुल है जहाँ आप हैं और जहाँ आप होना चाहते हैं।"
    }
  }
};

const MotivationalBanner: React.FC<{ quote: string }> = ({ quote }) => (
  <div className="max-w-4xl mx-auto mb-8 px-4 animate-in fade-in slide-in-from-top-4 duration-1000">
    <div className="glass p-4 rounded-2xl border-l-4 border-l-indigo-500 flex items-center gap-4 shadow-sm">
      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex-shrink-0">
        <Quote className="w-4 h-4 text-indigo-500" />
      </div>
      <p className="text-sm italic font-medium text-slate-600 dark:text-slate-400 leading-tight">
        "{quote}"
      </p>
    </div>
  </div>
);

const SmartBot: React.FC<{ language: string; t: any }> = ({ language, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatWithAI(messages, input, language);
      const aiMsg: ChatMessage = { role: 'model', text: response || '...', timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-32 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] glass rounded-[2.5rem] shadow-2xl flex flex-col border border-indigo-500/20 animate-in slide-in-from-bottom-8">
          <header className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm dark:text-white">Pathweaver Bot</h4>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Ask me about career trends, skills, or your roadmap!</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input 
              className="flex-1 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl text-sm outline-none dark:text-white"
              placeholder={t.chatPlaceholder}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-90 transition-all group"
        >
          <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

const ProfileView: React.FC<{ 
  profile: StudentProfile; 
  setProfile: (p: StudentProfile) => void; 
  onSubmit: () => void;
  t: any;
}> = ({ profile, setProfile, onSubmit, t }) => {
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const addSkill = (e?: any) => {
    if (e && 'preventDefault' in e) e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile({ ...profile, skills: [...profile.skills, trimmed] });
      setNewSkill('');
    }
  };

  const addInterest = (e?: any) => {
    if (e && 'preventDefault' in e) e.preventDefault();
    const trimmed = newInterest.trim();
    if (trimmed && !profile.interests.includes(trimmed)) {
      setProfile({ ...profile, interests: [...profile.interests, trimmed] });
      setNewInterest('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <MotivationalBanner quote={t.quotes.profile} />
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> Career Intelligence
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight dark:text-white">Build your <span className="gradient-text">{t.title}</span></h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">{t.subtitle}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[2rem] shadow-xl shadow-indigo-500/5 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2"><User className="w-4 h-4"/> {t.fullName}</label>
            <input 
              className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white shadow-sm"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
              placeholder={t.placeholderName}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2"><Globe className="w-4 h-4"/> {t.language}</label>
            <select 
              className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white shadow-sm"
              value={profile.language}
              onChange={e => setProfile({...profile, language: e.target.value})}
            >
              {INDIAN_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> {t.level}</label>
            <select 
              className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white shadow-sm"
              value={profile.educationLevel}
              onChange={e => setProfile({...profile, educationLevel: e.target.value})}
            >
              {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
        </div>
        <div className="glass p-8 rounded-[2rem] shadow-xl shadow-indigo-500/5 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-300">{t.major}</label>
            <input 
              className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white shadow-sm"
              value={profile.major}
              onChange={e => setProfile({...profile, major: e.target.value})}
              placeholder={t.placeholderMajor}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-300">{t.goals}</label>
            <textarea 
              className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white h-32 resize-none shadow-sm"
              value={profile.goals}
              onChange={e => setProfile({...profile, goals: e.target.value})}
              placeholder={t.goalsPlaceholder}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[2rem] space-y-4">
          <label className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">{t.skills}</label>
          <div className="flex gap-2">
            <input className="flex-1 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none dark:text-white" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill(e)} placeholder={t.placeholderSkill} />
            <button onClick={addSkill} className="p-4 bg-indigo-600 text-white rounded-2xl hover:scale-105 transition-all"><Plus className="w-6 h-6" /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(s => <span key={s} className="animate-pop px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold">{s}</span>)}
          </div>
        </div>
        <div className="glass p-8 rounded-[2rem] space-y-4">
          <label className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">{t.interests}</label>
          <div className="flex gap-2">
            <input className="flex-1 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none dark:text-white" value={newInterest} onChange={e => setNewInterest(e.target.value)} onKeyDown={e => e.key === 'Enter' && addInterest(e)} placeholder={t.placeholderInterest} />
            <button onClick={addInterest} className="p-4 bg-emerald-600 text-white rounded-2xl hover:scale-105 transition-all"><Plus className="w-6 h-6" /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map(i => <span key={i} className="animate-pop px-4 py-2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold">{i}</span>)}
          </div>
        </div>
      </div>

      <button onClick={onSubmit} className="group w-full md:w-auto px-10 py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
        <Compass className="w-6 h-6 group-hover:rotate-45 transition-transform" /> <span className="text-lg uppercase tracking-tighter">{t.generate}</span>
      </button>
    </div>
  );
};

const RecommendationsView: React.FC<{ 
  recommendations: CareerRecommendation[]; 
  loading: boolean;
  t: any;
}> = ({ recommendations, loading, t }) => {
  const [sortKey, setSortKey] = useState<'alignment' | 'salary' | 'location'>('alignment');
  const [filterText, setFilterText] = useState('');

  const filteredAndSorted = useMemo(() => {
    let list = [...recommendations];
    if (filterText) {
      list = list.filter(r => 
        r.title.toLowerCase().includes(filterText.toLowerCase()) || 
        r.location.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    list.sort((a, b) => {
      if (sortKey === 'salary') return b.minSalary - a.minSalary;
      if (sortKey === 'location') return a.location.localeCompare(b.location);
      return b.alignmentScore - a.alignmentScore;
    });
    return list;
  }, [recommendations, sortKey, filterText]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          <BrainCircuit className="absolute inset-0 m-auto w-12 h-12 text-indigo-600 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-2xl font-black gradient-text animate-pulse">{t.consulting}</p>
          <p className="text-slate-400 text-sm">{t.loadingSub}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-10 animate-in fade-in duration-700 pb-20">
      <MotivationalBanner quote={t.quotes.recommendations} />
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.prophecy}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Top {filteredAndSorted.length} high-impact paths for you.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center glass p-3 rounded-2xl">
          <div className="flex items-center gap-2 px-3 border-r border-slate-200 dark:border-slate-800">
            <Filter className="w-4 h-4 text-slate-400" />
            <input 
              className="bg-transparent text-sm outline-none dark:text-white w-32" 
              placeholder="Search..." 
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select 
              className="bg-transparent font-bold outline-none dark:text-white cursor-pointer"
              value={sortKey}
              onChange={e => setSortKey(e.target.value as any)}
            >
              <option value="alignment">{t.score}</option>
              <option value="salary">{t.salary}</option>
              <option value="location">{t.location}</option>
            </select>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {filteredAndSorted.map((rec, idx) => (
          <div key={idx} className="group glass rounded-[3rem] p-8 shadow-2xl hover:shadow-indigo-500/20 transition-all flex flex-col border border-white/40 dark:border-slate-800/50 hover:scale-[1.02] animate-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 150}ms` }}>
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-indigo-600 rounded-[1.5rem] shadow-lg group-hover:rotate-12 transition-transform">
                <BrainCircuit className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.matchPotential}</span>
                <span className="text-lg font-black gradient-text">{rec.alignmentScore}%</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{rec.title}</h3>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5" /> {rec.location}
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed line-clamp-4">{rec.description}</p>
            
            <div className="mb-6 animate-in fade-in duration-1000">
              <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> {t.marketOutlook}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-indigo-200 dark:border-indigo-800/40 pl-3">
                {rec.marketOutlook}
              </p>
            </div>

            <div className="space-y-6 flex-grow">
              <div className="p-5 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2rem] border border-indigo-100 dark:border-indigo-800/30">
                <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1 block">{t.compensation}</span>
                <p className="text-xl font-black text-indigo-900 dark:text-white">{rec.salaryRange}</p>
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> {t.actionSteps}
                </h4>
                <div className="space-y-3">
                  {rec.roadmap.map((step, sIdx) => (
                    <div key={sIdx} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-black flex-shrink-0">{sIdx + 1}</div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillsView: React.FC<{ 
  profile: StudentProfile; 
  suggestions: SkillSuggestion[]; 
  loading: boolean;
  t: any;
}> = ({ suggestions, loading, t }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
        <p className="text-2xl font-black gradient-text">{t.consulting}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-10 animate-in fade-in duration-700 pb-20">
      <MotivationalBanner quote={t.quotes.skills} />
      <header className="text-center space-y-3">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.skillsDiscovery}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">{t.skillsSubtitle}</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((skill, idx) => (
          <div key={idx} className="glass rounded-[2.5rem] p-8 flex flex-col border border-white/40 dark:border-slate-800/50 hover:border-indigo-500/50 transition-all hover:-translate-y-1 group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              {skill.trendingStatus && (
                <div className="px-3 py-1 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5">
                  <Flame className="w-3 h-3" /> {t.trending}
                </div>
              )}
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{skill.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow">{skill.description}</p>

            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-widest">{t.difficulty}</span>
                <span className={`px-2 py-1 rounded-lg font-black ${
                  skill.difficulty === 'Beginner' ? 'text-emerald-500 bg-emerald-50' :
                  skill.difficulty === 'Intermediate' ? 'text-amber-500 bg-amber-50' :
                  'text-red-500 bg-red-50'
                }`}>{skill.difficulty}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">{t.resources}</span>
                <div className="space-y-2">
                  {skill.learningResources.map((res, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-50 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 cursor-pointer transition-all">
                      {res.type === 'video' ? <PlayCircle className="w-4 h-4 text-red-500" /> : <BookOpen className="w-4 h-4 text-indigo-500" />}
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{res.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrendsView: React.FC<{ language: string; t: any }> = ({ language, t }) => {
  const [query, setQuery] = useState('');
  const [report, setReport] = useState<{text: string; sources: GroundingSource[]} | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTrends = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await searchMarketTrends(query, language);
      setReport(res);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-12 pb-24">
      <MotivationalBanner quote={t.quotes.trends} />
      <header className="text-center space-y-3">
        <h2 className="text-5xl font-black tracking-tighter dark:text-white">{t.intelligence}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">{t.marketTracking}</p>
      </header>
      <div className="flex gap-3 max-w-2xl mx-auto p-2 glass rounded-[2.5rem] shadow-2xl">
        <input className="flex-1 px-6 py-4 rounded-[1.8rem] bg-transparent outline-none dark:text-white" placeholder={t.placeholderTrends} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchTrends()} />
        <button onClick={fetchTrends} disabled={loading} className="px-8 py-4 bg-slate-900 dark:bg-white dark:text-black text-white font-black rounded-[1.8rem] hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />} {t.deepDive}</button>
      </div>
      {report && (
        <div className="glass rounded-[3rem] p-10 space-y-8 animate-in fade-in slide-in-from-bottom-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {report.text.split('\n').map((para, i) => <p key={i} className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{para}</p>)}
          </div>
        </div>
      )}
    </div>
  );
};

const IntroScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10"></div>
      <div className="relative">
        <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_0_80px_rgba(79,70,229,0.5)] animate-bounce">
          <Layout className="w-16 h-16" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-indigo-500/20 rounded-full animate-ping"></div>
      </div>
      <div className="mt-12 text-center space-y-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <h1 className="text-5xl font-black text-white tracking-tighter">PATHWEAVER</h1>
        <p className="text-indigo-400 font-black tracking-[0.4em] uppercase text-xs">AI Career Intelligence</p>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showIntro, setShowIntro] = useState(true);
  const [profile, setProfile] = useState<StudentProfile>({
    name: '', educationLevel: 'Undergraduate', major: '', interests: [], skills: [], goals: '', history: '', language: 'English'
  });
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [skillSuggestions, setSkillSuggestionsList] = useState<SkillSuggestion[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);

  const t = useMemo(() => TRANSLATIONS[profile.language] || TRANSLATIONS['English'], [profile.language]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const handleGenerateRecs = async () => {
    if (!profile.name.trim() || !profile.major.trim()) { alert("Please enter your name and field of study."); return; }
    setActiveTab('recommendations');
    setLoadingRecs(true);
    setLoadingSkills(true);
    try {
      const [recs, skills] = await Promise.all([
        getCareerRecommendations(profile),
        getSkillSuggestions(profile)
      ]);
      setRecommendations(recs);
      setSkillSuggestionsList(skills);
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoadingRecs(false);
      setLoadingSkills(false);
    }
  };

  if (showIntro) return <IntroScreen onFinish={() => setShowIntro(false)} />;

  return (
    <div className="min-h-screen selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      <header className="px-6 py-5 flex items-center justify-between sticky top-0 glass z-50 border-b border-white/20 dark:border-slate-800/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <Layout className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">PATHWEAVER</h1>
            <span className="text-[10px] font-black tracking-[0.3em] text-indigo-600 dark:text-indigo-400 uppercase">AI Navigator</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-3 glass rounded-2xl text-slate-600 dark:text-slate-300 border border-transparent active:scale-90">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-black px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg uppercase">v2.5 Hybrid</span>
          </div>
        </div>
      </header>

      <main className="pt-6 relative z-10 pb-32">
        {activeTab === 'profile' && <ProfileView profile={profile} setProfile={setProfile} onSubmit={handleGenerateRecs} t={t} />}
        {activeTab === 'recommendations' && <RecommendationsView recommendations={recommendations} loading={loadingRecs} t={t} />}
        {activeTab === 'skills' && <SkillsView profile={profile} suggestions={skillSuggestions} loading={loadingSkills} t={t} />}
        {activeTab === 'trends' && <TrendsView language={profile.language} t={t} />}
      </main>

      <SmartBot language={profile.language} t={t} />

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 glass px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-10 z-[60] border border-white/50 dark:border-slate-800 backdrop-blur-xl">
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1.5 transition-all group ${activeTab === 'profile' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <User className={`w-6 h-6 ${activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
          <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === 'profile' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{t.profile}</span>
        </button>
        <button onClick={() => setActiveTab('recommendations')} className={`flex flex-col items-center gap-1.5 transition-all group ${activeTab === 'recommendations' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <Compass className={`w-6 h-6 ${activeTab === 'recommendations' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
          <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === 'recommendations' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{t.navigator}</span>
        </button>
        <button onClick={() => setActiveTab('skills')} className={`flex flex-col items-center gap-1.5 transition-all group ${activeTab === 'skills' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <Award className={`w-6 h-6 ${activeTab === 'skills' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
          <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === 'skills' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>Skills</span>
        </button>
        <button onClick={() => setActiveTab('trends')} className={`flex flex-col items-center gap-1.5 transition-all group ${activeTab === 'trends' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <TrendingUp className={`w-6 h-6 ${activeTab === 'trends' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
          <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === 'trends' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{t.market}</span>
        </button>
      </nav>
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}
