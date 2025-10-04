import { ArrowLeft, Download, Share2, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { usePublication, usePublicationSummary } from '@/hooks/useApi';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import { useEffect, useState } from 'react';

export default function PublicationDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: publication, isLoading, error } = usePublication(id!);
  const summaryMutation = usePublicationSummary();
  const [aiSummary, setAiSummary] = useState<{
    objective: string;
    findings: string[];
    implications: string;
  } | null>(null);
  const [summaryGeneratedAt, setSummaryGeneratedAt] = useState<Date | null>(null);

  // Generate AI summary when publication loads - always generate fresh
  useEffect(() => {
    if (publication) {
      // Reset AI summary and generate new one
      setAiSummary(null);
      // Reset the mutation state to force fresh generation
      summaryMutation.reset();
      // Add a small delay to ensure the state is reset
      setTimeout(() => {
        summaryMutation.mutate({
          title: publication.title,
          authors: publication.authors,
          year: publication.year,
          tags: publication.tags,
        });
      }, 100);
    }
  }, [publication?.id]); // Only depend on publication ID to force regeneration

  // Update AI summary when mutation completes
  useEffect(() => {
    if (summaryMutation.data) {
      setAiSummary(summaryMutation.data);
      setSummaryGeneratedAt(new Date());
    }
  }, [summaryMutation.data]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setAiSummary(null);
      summaryMutation.reset();
    };
  }, []);

  // Typing animations for each part - faster and smoother like Cursor
  const { displayedText: displayedObjective, isTyping: isTypingObjective } = useTypingAnimation(
    aiSummary?.objective || '', 
    15
  );
  const { displayedText: displayedImplications, isTyping: isTypingImplications } = useTypingAnimation(
    aiSummary?.implications || '', 
    15
  );

  // Staggered animation for findings
  const [visibleFindings, setVisibleFindings] = useState<number[]>([]);
  
  useEffect(() => {
    if (aiSummary?.findings) {
      setVisibleFindings([]);
      aiSummary.findings.forEach((_, index) => {
        setTimeout(() => {
          setVisibleFindings(prev => [...prev, index]);
        }, index * 200); // 200ms delay between each finding
      });
    }
  }, [aiSummary?.findings]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground/60 font-light">Loading publication...</p>
        </div>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60 font-light">Publication not found</p>
          <Link to="/search" className="text-primary hover:text-primary/80 transition-colors">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }


  const relatedPublications = [
    { id: 2, title: 'Muscle Atrophy in Microgravity Environments', year: 2021 },
    { id: 3, title: 'Calcium Metabolism During Spaceflight', year: 2020 },
    { id: 4, title: 'Exercise Countermeasures for Bone Loss', year: 2022 },
  ];

  return (
    <div key={publication?.id} className="min-h-screen bg-background">
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
              <Link to="/insights" className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors">Insights</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 md:px-10 lg:px-16">
        <Link to="/search" className="mb-8 inline-flex items-center gap-2 text-sm font-light text-foreground/70 transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>

        <article className="mb-12">
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-extralight leading-tight tracking-tight text-foreground">
              {publication.title}
            </h1>
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm font-light text-foreground/60">
              <span>{publication.authors}</span>
              <span>·</span>
              <span>{publication.year}</span>
              <span>·</span>
              <span>PMC{publication.pmcId}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {publication.tags.map((tag, i) => (
                <span key={i} className="glass rounded-lg px-3 py-1 text-xs font-light text-foreground/70">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8 flex gap-3">
            <button className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-light transition-all hover:bg-white/10">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-light transition-all hover:bg-white/10">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <a
              href={publication.link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-light transition-all hover:bg-white/10 hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" />
              View Original Paper
            </a>
          </div>

              <div className="glass-strong mb-8 rounded-2xl p-8">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-extralight tracking-tight text-foreground">AI Summary</h2>
            {summaryMutation.isPending && (
              <div className="ml-2 flex items-center gap-2 text-sm text-primary">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs">AI is generating fresh summary...</span>
              </div>
            )}
                  </div>
                  <div className="flex items-center gap-3">
                    {summaryGeneratedAt && (
                      <span className="text-xs text-foreground/50">
                        Generated {summaryGeneratedAt.toLocaleTimeString()}
                      </span>
                    )}
                    {aiSummary && !summaryMutation.isPending && (
                      <button
                        onClick={() => {
                          setAiSummary(null);
                          summaryMutation.mutate({
                            title: publication.title,
                            authors: publication.authors,
                            year: publication.year,
                            tags: publication.tags,
                          });
                        }}
                        className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-light transition-all hover:bg-white/10"
                      >
                        <Sparkles className="h-4 w-4" />
                        Regenerate
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-sm font-light uppercase tracking-wide text-foreground/60">Research Objective</h3>
                    <p className="font-light text-foreground/90">
                      {displayedObjective}
                      {isTypingObjective && (
                        <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse"></span>
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-light uppercase tracking-wide text-foreground/60">Key Findings</h3>
                    <ul className="space-y-2">
                      {aiSummary?.findings.map((finding, i) => (
                        <li 
                          key={i} 
                          className={`flex items-start gap-3 transition-all duration-300 ${
                            visibleFindings.includes(i) 
                              ? 'opacity-100 translate-y-0' 
                              : 'opacity-0 translate-y-2'
                          }`}
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="font-light text-foreground/90">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-light uppercase tracking-wide text-foreground/60">Implications for Space Exploration</h3>
                    <p className="font-light text-foreground/90">
                      {displayedImplications}
                      {isTypingImplications && (
                        <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse"></span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

          <div className="glass-strong mb-8 rounded-2xl p-8">
            <h2 className="mb-6 text-2xl font-extralight tracking-tight text-foreground">Publication Details</h2>
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="mb-1 text-sm font-light text-foreground/60">PMC ID</dt>
                <dd className="font-light text-primary">PMC{publication.pmcId}</dd>
              </div>
              <div>
                <dt className="mb-1 text-sm font-light text-foreground/60">Publication Year</dt>
                <dd className="font-light text-foreground">{publication.year}</dd>
              </div>
              <div>
                <dt className="mb-1 text-sm font-light text-foreground/60">Authors</dt>
                <dd className="font-light text-foreground">{publication.authors}</dd>
              </div>
              <div>
                <dt className="mb-1 text-sm font-light text-foreground/60">Relevance Score</dt>
                <dd className="font-light text-foreground">{publication.relevance}% match</dd>
              </div>
            </dl>
          </div>

        </article>

        <aside className="glass-strong rounded-2xl p-8">
          <h3 className="mb-6 text-xl font-extralight tracking-tight text-foreground">Related Publications</h3>
          <div className="space-y-3">
            {relatedPublications.map((related) => (
              <Link
                key={related.id}
                to={`/publications/${related.id}`}
                className="glass block rounded-xl p-4 transition-all hover:bg-white/10"
              >
                <h4 className="mb-1 font-light text-foreground">{related.title}</h4>
                <p className="text-sm font-light text-foreground/60">{related.year}</p>
              </Link>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
