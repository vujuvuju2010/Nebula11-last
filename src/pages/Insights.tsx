import { TrendingUp, AlertTriangle, CheckCircle, Lightbulb, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useChatState, useHealthCheck } from '@/hooks/useApi';
import type { ChatMessage } from '@/lib/api';

const trends = [
  { title: 'Human Physiology Research', count: 180, change: '+12%', period: 'last 3 years' },
  { title: 'Plant Biology Studies', count: 145, change: '+8%', period: 'last 3 years' },
  { title: 'Microbiology Focus', count: 125, change: '+15%', period: 'last 3 years' },
];

const gaps = [
  { area: 'Long-Duration Radiation Effects', severity: 'high', publications: 12, needed: 50 },
  { area: 'Mars Soil Microbiology', severity: 'high', publications: 8, needed: 40 },
  { area: 'Deep Space Plant Growth', severity: 'medium', publications: 25, needed: 60 },
  { area: 'Lunar Dust Impact on Biology', severity: 'medium', publications: 18, needed: 45 },
];

const consensus = [
  { topic: 'Bone Density Loss', agreement: 95, studies: 48 },
  { topic: 'Muscle Atrophy Patterns', agreement: 92, studies: 42 },
  { topic: 'Plant Growth Orientation', agreement: 88, studies: 35 },
  { topic: 'Microbial Behavior Changes', agreement: 85, studies: 38 },
];

const actionable = [
  {
    title: 'Critical Countermeasure Gap',
    description: 'Exercise protocols show 60% effectiveness but Mars missions require 90%+. Enhanced countermeasures needed.',
    priority: 'high',
    publications: 32,
  },
  {
    title: 'Radiation Shielding Research',
    description: 'Limited data on biological effects of deep space radiation. Critical for crew safety on Mars missions.',
    priority: 'high',
    publications: 15,
  },
  {
    title: 'Closed-Loop Life Support',
    description: 'Plant growth systems show promise but require optimization for long-duration missions.',
    priority: 'medium',
    publications: 28,
  },
];

export default function Insights() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
  
  const { sendMessage, isLoading } = useChatState();
  const { data: healthData } = useHealthCheck();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setMessage('');

    try {
      const response = await sendMessage(message, newHistory);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp,
      };
      setChatHistory([...newHistory, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-strong sticky top-0 z-50 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-4 md:px-10 lg:px-16">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-extralight tracking-tight text-foreground">
              NASA <span className="text-gradient-primary">BioScience</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/search" className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors">Search</Link>
              <Link to="/knowledge-graph" className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors">Knowledge Graph</Link>
              <Link to="/insights" className="text-sm font-light text-primary">Insights</Link>
              <button
                onClick={() => setShowChat(!showChat)}
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-light text-primary transition-all hover:bg-primary/20"
              >
                <MessageCircle className="h-4 w-4" />
                AI Chat
                {healthData && (
                  <div className={`h-2 w-2 rounded-full ${healthData.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16">
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-extralight tracking-tight text-foreground">Research Insights</h1>
          <p className="text-foreground/70 font-light">AI-powered analysis of trends, gaps, and mission-critical findings</p>
        </div>

        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-extralight tracking-tight text-foreground">Research Trends</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {trends.map((trend, i) => (
              <div key={i} className="glass-strong rounded-2xl p-6">
                <div className="mb-2 text-3xl font-extralight tracking-tight text-foreground">{trend.count}</div>
                <div className="mb-2 font-light text-foreground/80">{trend.title}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-light text-primary">{trend.change}</span>
                  <span className="text-sm font-light text-foreground/60">{trend.period}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-extralight tracking-tight text-foreground">Knowledge Gaps</h2>
          </div>
          <div className="glass-strong rounded-2xl p-8">
            <div className="space-y-4">
              {gaps.map((gap, i) => (
                <div key={i} className="glass rounded-xl p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-light text-foreground">{gap.area}</h3>
                    <span className={`glass rounded-lg px-3 py-1 text-xs font-light ${gap.severity === 'high' ? 'text-primary' : 'text-secondary'}`}>
                      {gap.severity === 'high' ? 'High Priority' : 'Medium Priority'}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-4 text-sm font-light text-foreground/60">
                    <span>{gap.publications} current publications</span>
                    <span>·</span>
                    <span>{gap.needed} needed for comprehensive coverage</span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(gap.publications / gap.needed) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-secondary" />
            <h2 className="text-2xl font-extralight tracking-tight text-foreground">Areas of Scientific Consensus</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {consensus.map((item, i) => (
              <div key={i} className="glass-strong rounded-2xl p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-light text-foreground">{item.topic}</h3>
                  <span className="text-2xl font-extralight text-secondary">{item.agreement}%</span>
                </div>
                <p className="text-sm font-light text-foreground/60">{item.studies} supporting studies</p>
                <div className="mt-4 relative h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-secondary"
                    style={{ width: `${item.agreement}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-extralight tracking-tight text-foreground">Mission-Critical Insights</h2>
          </div>
          <div className="space-y-6">
            {actionable.map((insight, i) => (
              <div key={i} className="glass-strong rounded-2xl p-8">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-xl font-light text-foreground">{insight.title}</h3>
                  <span className={`glass rounded-lg px-3 py-1 text-xs font-light ${insight.priority === 'high' ? 'text-primary' : 'text-secondary'}`}>
                    {insight.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                  </span>
                </div>
                <p className="mb-4 font-light text-foreground/80">{insight.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-light text-foreground/60">
                    Based on {insight.publications} publications
                  </span>
                  <Link
                    to="/search"
                    className="text-sm font-light text-primary hover:text-primary/80 transition-colors"
                  >
                    View Research →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* AI Chat Interface */}
      {showChat && (
        <div className="fixed bottom-0 right-0 z-50 w-full max-w-md p-4">
          <div className="glass-strong rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="text-lg font-light text-foreground">AI Research Assistant</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="h-80 overflow-y-auto p-4">
              {chatHistory.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="mx-auto h-12 w-12 text-foreground/20 mb-4" />
                  <p className="text-foreground/60 font-light">Ask me anything about NASA space biology research!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 text-sm font-light ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2 text-sm font-light text-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about research trends, gaps, or findings..."
                  className="flex-1 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-light text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-light text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
