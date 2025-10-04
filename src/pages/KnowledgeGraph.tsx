import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react';

const nodes = [
  { id: 'human', label: 'Human Physiology', size: 180, color: 'hsl(345, 82%, 65%)', x: 250, y: 200 },
  { id: 'plant', label: 'Plant Biology', size: 145, color: 'hsl(180, 65%, 55%)', x: 550, y: 200 },
  { id: 'micro', label: 'Microbiology', size: 125, color: 'hsl(280, 65%, 60%)', x: 400, y: 400 },
  { id: 'bone', label: 'Bone Health', size: 85, color: 'hsl(345, 82%, 75%)', x: 150, y: 100 },
  { id: 'cardio', label: 'Cardiovascular', size: 75, color: 'hsl(345, 82%, 70%)', x: 200, y: 300 },
  { id: 'arabidopsis', label: 'Arabidopsis', size: 70, color: 'hsl(180, 65%, 65%)', x: 650, y: 100 },
  { id: 'growth', label: 'Plant Growth', size: 65, color: 'hsl(180, 65%, 60%)', x: 600, y: 300 },
  { id: 'biofilm', label: 'Biofilm', size: 60, color: 'hsl(280, 65%, 70%)', x: 500, y: 500 },
  { id: 'ecoli', label: 'E. coli', size: 55, color: 'hsl(280, 65%, 65%)', x: 300, y: 450 },
];

const edges = [
  { from: 'human', to: 'bone' },
  { from: 'human', to: 'cardio' },
  { from: 'plant', to: 'arabidopsis' },
  { from: 'plant', to: 'growth' },
  { from: 'micro', to: 'biofilm' },
  { from: 'micro', to: 'ecoli' },
  { from: 'human', to: 'micro' },
  { from: 'plant', to: 'micro' },
];

export default function KnowledgeGraph() {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

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
              <Link to="/knowledge-graph" className="text-sm font-light text-primary">Knowledge Graph</Link>
              <Link to="/insights" className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors">Insights</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-extralight tracking-tight text-foreground">Knowledge Graph</h1>
            <p className="text-foreground/70 font-light">Explore connections between research topics and organisms</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleZoomOut} className="glass rounded-xl p-3 transition-all hover:bg-white/10">
              <ZoomOut className="h-4 w-4" />
            </button>
            <button onClick={handleZoomIn} className="glass rounded-xl p-3 transition-all hover:bg-white/10">
              <ZoomIn className="h-4 w-4" />
            </button>
            <button className="glass rounded-xl p-3 transition-all hover:bg-white/10">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="glass rounded-xl p-3 transition-all hover:bg-white/10">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="glass-strong rounded-2xl p-8 overflow-hidden" style={{ height: '600px' }}>
              <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {edges.map((edge, i) => {
                  const fromNode = nodes.find(n => n.id === edge.from)!;
                  const toNode = nodes.find(n => n.id === edge.to)!;
                  return (
                    <line
                      key={i}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="hsl(0 0% 100% / 0.1)"
                      strokeWidth="2"
                    />
                  );
                })}

                {nodes.map((node) => (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size / 3}
                      fill={node.color}
                      opacity={selectedNode === node.id ? 1 : 0.8}
                      filter={selectedNode === node.id ? 'url(#glow)' : undefined}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                    <text
                      x={node.x}
                      y={node.y + node.size / 3 + 20}
                      textAnchor="middle"
                      fill="hsl(0 0% 98%)"
                      fontSize="12"
                      fontWeight="300"
                    >
                      {node.label}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + node.size / 3 + 35}
                      textAnchor="middle"
                      fill="hsl(0 0% 60%)"
                      fontSize="10"
                      fontWeight="300"
                    >
                      {node.size} publications
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="mb-4 text-lg font-extralight tracking-tight text-foreground">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ background: 'hsl(345, 82%, 65%)' }} />
                  <span className="text-sm font-light text-foreground/70">Human Physiology</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ background: 'hsl(180, 65%, 55%)' }} />
                  <span className="text-sm font-light text-foreground/70">Plant Biology</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ background: 'hsl(280, 65%, 60%)' }} />
                  <span className="text-sm font-light text-foreground/70">Microbiology</span>
                </div>
              </div>
            </div>

            {selectedNode && (
              <div className="glass-strong rounded-2xl p-6">
                <h3 className="mb-4 text-lg font-extralight tracking-tight text-foreground">Selected Topic</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-light text-foreground/60">Name</span>
                    <p className="font-light text-foreground">{nodes.find(n => n.id === selectedNode)?.label}</p>
                  </div>
                  <div>
                    <span className="text-sm font-light text-foreground/60">Publications</span>
                    <p className="font-light text-foreground">{nodes.find(n => n.id === selectedNode)?.size}</p>
                  </div>
                  <Link
                    to="/search"
                    className="glass-strong mt-4 block rounded-xl px-4 py-2 text-center text-sm font-light transition-all hover:bg-white/15"
                  >
                    View Publications
                  </Link>
                </div>
              </div>
            )}

            <div className="glass-strong rounded-2xl p-6">
              <h3 className="mb-4 text-lg font-extralight tracking-tight text-foreground">Graph Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-light text-foreground/60">Nodes</span>
                  <span className="font-light text-foreground">{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-light text-foreground/60">Connections</span>
                  <span className="font-light text-foreground">{edges.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-light text-foreground/60">Clusters</span>
                  <span className="font-light text-foreground">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
