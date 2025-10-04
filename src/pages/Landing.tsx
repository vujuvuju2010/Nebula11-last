import { Link } from 'react-router-dom';
import { BookOpen, Target, TrendingUp } from 'lucide-react';

export default function Landing() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(244,114,182,0.1),transparent_50%)]" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 pb-24 pt-36 sm:gap-8 sm:pt-44 md:px-10 lg:px-16">
          {/* Badge */}
          <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 animate-fade-in">
            <span className="text-[10px] font-light uppercase tracking-[0.08em] text-foreground/70">Research</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span className="text-xs font-light tracking-tight text-foreground/80">NASA Bioscience</span>
          </div>

          {/* Title */}
          <h1 className="max-w-3xl text-left text-5xl font-extralight leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Unlock NASA's Space Biology Knowledge
          </h1>

          {/* Description */}
          <p className="max-w-xl text-left text-base font-light leading-relaxed tracking-tight text-foreground/75 sm:text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Explore 608 bioscience publications with AI-powered analysis. Discover insights for Moon and Mars missions through intelligent search, knowledge graphs, and gap analysis.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/dashboard"
              className="glass-strong rounded-2xl px-5 py-3 text-sm font-light tracking-tight text-foreground transition-all duration-300 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              Explore Dashboard
            </Link>
            <Link
              to="/search"
              className="glass rounded-2xl px-5 py-3 text-sm font-light tracking-tight text-foreground/80 transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              Search Publications
            </Link>
          </div>

          {/* Micro Details */}
          <ul className="mt-8 flex flex-wrap gap-6 text-xs font-extralight tracking-tight text-foreground/60">
            <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <span className="h-1 w-1 rounded-full bg-primary/60" /> 608 Publications
            </li>
            <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <span className="h-1 w-1 rounded-full bg-primary/60" /> Space Biology
            </li>
            <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <span className="h-1 w-1 rounded-full bg-primary/60" /> AI-Powered Analysis
            </li>
          </ul>
        </div>

        {/* Bottom Gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/40 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-extralight tracking-tight text-foreground sm:text-4xl">
              Comprehensive Research Tools
            </h2>
            <p className="text-foreground/70 font-light">
              Everything you need to explore NASA's bioscience research
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="glass-strong rounded-2xl p-8 transition-all hover:bg-white/10">
              <BookOpen className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-light text-foreground">Smart Search</h3>
              <p className="text-sm font-light text-foreground/70">
                Semantic search across 608 publications with AI-powered relevance scoring and intelligent filters.
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-8 transition-all hover:bg-white/10">
              <Target className="mb-4 h-8 w-8 text-secondary" />
              <h3 className="mb-2 text-xl font-light text-foreground">Knowledge Graph</h3>
              <p className="text-sm font-light text-foreground/70">
                Interactive visualization of research connections, topics, and organisms across the entire database.
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-8 transition-all hover:bg-white/10">
              <TrendingUp className="mb-4 h-8 w-8 text-accent" />
              <h3 className="mb-2 text-xl font-light text-foreground">Gap Analysis</h3>
              <p className="text-sm font-light text-foreground/70">
                Identify under-researched areas and mission-critical insights for Moon and Mars exploration.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/dashboard"
              className="inline-block glass-strong rounded-2xl px-8 py-4 text-base font-light tracking-tight text-foreground transition-all duration-300 hover:bg-white/15"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
