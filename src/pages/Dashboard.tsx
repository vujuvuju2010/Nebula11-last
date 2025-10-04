import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, BookOpen, Users, Target, Search, Brain, Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHealthCheck, useAskQuestion, useSummarize, usePublicationStats } from '@/hooks/useApi';
import { useState } from 'react';

const publicationsOverTime = [
  { year: '2015', count: 45 },
  { year: '2016', count: 58 },
  { year: '2017', count: 72 },
  { year: '2018', count: 85 },
  { year: '2019', count: 94 },
  { year: '2020', count: 78 },
  { year: '2021', count: 89 },
  { year: '2022', count: 87 },
];

const researchAreas = [
  { name: 'Human Physiology', value: 180, color: 'hsl(345, 82%, 65%)' },
  { name: 'Plant Biology', value: 145, color: 'hsl(180, 65%, 55%)' },
  { name: 'Microbiology', value: 125, color: 'hsl(280, 65%, 60%)' },
  { name: 'Cell Biology', value: 98, color: 'hsl(200, 70%, 60%)' },
  { name: 'Other', value: 60, color: 'hsl(0, 0%, 40%)' },
];

const organisms = [
  { name: 'Humans', count: 180 },
  { name: 'Arabidopsis', count: 85 },
  { name: 'E. coli', count: 72 },
  { name: 'C. elegans', count: 58 },
  { name: 'Mice', count: 95 },
  { name: 'Yeast', count: 45 },
];

// Dynamic stats based on real data
const getStats = (statsData: any) => [
  { label: 'Total Publications', value: statsData?.total?.toString() || '608', icon: BookOpen, color: 'text-primary' },
  { label: 'Research Areas', value: Object.keys(statsData?.byTag || {}).length.toString(), icon: Target, color: 'text-secondary' },
  { label: 'Years Covered', value: Object.keys(statsData?.byYear || {}).length.toString(), icon: Users, color: 'text-accent' },
  { label: 'Recent Studies', value: statsData?.recent?.length?.toString() || '10', icon: TrendingUp, color: 'text-primary' },
];

export default function Dashboard() {
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  
  // Health check
  const { data: healthData, isLoading: isHealthLoading } = useHealthCheck();
  
  // Real data
  const { data: statsData, isLoading: isStatsLoading } = usePublicationStats();
  
  // AI mutations
  const askQuestionMutation = useAskQuestion();
  const summarizeMutation = useSummarize();

  const generateInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const response = await summarizeMutation.mutateAsync({
        topic: 'NASA space biology research trends and key findings',
        style: 'technical'
      });
      setAiInsight(response.summary);
    } catch (error) {
      console.error('Failed to generate insight:', error);
    } finally {
      setIsGeneratingInsight(false);
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
              <Link to="/dashboard" className="text-sm font-light text-primary">Dashboard</Link>
              <Link to="/search" className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors">Search</Link>
              <Link to="/knowledge-graph" className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors">Knowledge Graph</Link>
              <Link to="/insights" className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors">Insights</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-extralight tracking-tight text-foreground">Research Dashboard</h1>
              <p className="text-foreground/70 font-light">Explore 608 NASA bioscience publications across space biology research</p>
            </div>
            {healthData && (
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <div className={`h-2 w-2 rounded-full ${healthData.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                Backend: {healthData.status}
              </div>
            )}
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {getStats(statsData).map((stat, i) => (
            <div key={i} className="glass-strong rounded-2xl p-6 transition-all hover:bg-white/10">
              <div className="mb-4 flex items-center justify-between">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div className={`h-2 w-2 rounded-full ${stat.color === 'text-primary' ? 'bg-primary' : stat.color === 'text-secondary' ? 'bg-secondary' : 'bg-accent'}`} />
              </div>
              <div className="text-3xl font-extralight tracking-tight text-foreground">{stat.value}</div>
              <div className="mt-1 text-sm font-light text-foreground/60">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-12 glass-strong rounded-2xl p-8">
          <h2 className="mb-6 text-2xl font-extralight tracking-tight text-foreground">Publications Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={publicationsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
              <XAxis dataKey="year" stroke="hsl(0 0% 60%)" style={{ fontSize: '12px', fontWeight: 300 }} />
              <YAxis stroke="hsl(0 0% 60%)" style={{ fontSize: '12px', fontWeight: 300 }} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(0 0% 5%)',
                  border: '1px solid hsl(0 0% 15%)',
                  borderRadius: '12px',
                  color: 'hsl(0 0% 98%)',
                  fontWeight: 300,
                }}
              />
              <Line type="monotone" dataKey="count" stroke="hsl(345, 82%, 65%)" strokeWidth={2} dot={{ fill: 'hsl(345, 82%, 65%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="glass-strong rounded-2xl p-8">
            <h2 className="mb-6 text-2xl font-extralight tracking-tight text-foreground">Research Areas Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={researchAreas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {researchAreas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(0 0% 5%)',
                    border: '1px solid hsl(0 0% 15%)',
                    borderRadius: '12px',
                    color: 'hsl(0 0% 98%)',
                    fontWeight: 300,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-strong rounded-2xl p-8">
            <h2 className="mb-6 text-2xl font-extralight tracking-tight text-foreground">Most Studied Organisms</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={organisms} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
                <XAxis type="number" stroke="hsl(0 0% 60%)" style={{ fontSize: '12px', fontWeight: 300 }} />
                <YAxis dataKey="name" type="category" stroke="hsl(0 0% 60%)" style={{ fontSize: '12px', fontWeight: 300 }} width={100} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(0 0% 5%)',
                    border: '1px solid hsl(0 0% 15%)',
                    borderRadius: '12px',
                    color: 'hsl(0 0% 98%)',
                    fontWeight: 300,
                  }}
                />
                <Bar dataKey="count" fill="hsl(180, 65%, 55%)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="mt-12 glass-strong rounded-2xl p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-extralight tracking-tight text-foreground">AI-Powered Insights</h2>
            <button
              onClick={generateInsight}
              disabled={isGeneratingInsight}
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-light text-primary transition-all hover:bg-primary/20 disabled:opacity-50"
            >
              {isGeneratingInsight ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Generate Insight
                </>
              )}
            </button>
          </div>
          
          {aiInsight ? (
            <div className="rounded-lg bg-background/50 p-6">
              <p className="text-sm font-light text-foreground/80 leading-relaxed">{aiInsight}</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="mx-auto h-12 w-12 text-foreground/20 mb-4" />
              <p className="text-foreground/60 font-light">Click "Generate Insight" to get AI-powered analysis of research trends</p>
            </div>
          )}
        </div>

        <div className="mt-12 glass-strong rounded-2xl p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-extralight tracking-tight text-foreground">Recent Publications</h2>
            <Link to="/search" className="flex items-center gap-2 text-sm font-light text-primary hover:text-primary/80 transition-colors">
              <Search className="h-4 w-4" />
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {isStatsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : statsData?.recent?.length ? (
              statsData.recent.slice(0, 5).map((pub: any, i: number) => (
                <Link
                  key={pub.id}
                  to={`/publications/${pub.id}`}
                  className="block glass rounded-xl p-4 transition-all hover:bg-white/10 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 font-light text-foreground line-clamp-2 hover:text-primary transition-colors">{pub.title}</h3>
                      <p className="text-sm text-foreground/60 font-light">{pub.authors} · {pub.year}</p>
                    </div>
                    <div className="ml-2 text-primary">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-foreground/60 font-light py-8">No recent publications available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
