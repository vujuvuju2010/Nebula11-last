import { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, Download, SortAsc, Loader2, ExternalLink, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHealthCheck, usePublications } from '@/hooks/useApi';
import type { Publication } from '@/lib/api';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 15;
  
  // Sorting state
  const [sortBy, setSortBy] = useState<'relevance' | 'title' | 'year'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Filter state
  const [yearFrom, setYearFrom] = useState<number | undefined>();
  const [yearTo, setYearTo] = useState<number | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Health check
  const { data: healthData, isLoading: isHealthLoading } = useHealthCheck();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, sortBy, sortOrder, yearFrom, yearTo, selectedTags]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSort && !(event.target as Element).closest('.sort-dropdown')) {
        setShowSort(false);
      }
      if (showFilters && !(event.target as Element).closest('.filters-section')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSort, showFilters]);

  // Search publications with pagination
  const {
    data: publicationsData,
    isLoading: isSearchLoading,
    error: searchError
  } = usePublications({
    search: debouncedQuery || undefined,
    limit: articlesPerPage,
    offset: (currentPage - 1) * articlesPerPage,
    sortBy: sortBy,
    sortOrder: sortOrder,
    yearFrom: yearFrom,
    yearTo: yearTo,
    tags: selectedTags.length > 0 ? selectedTags : undefined
  });

  const publications = publicationsData?.publications || [];
  const totalPublications = publicationsData?.total || 0;
  const totalPages = Math.ceil(totalPublications / articlesPerPage);
  const hasMore = publicationsData?.hasMore || false;

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
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
              <Link to="/search" className="text-sm font-light text-primary">Search</Link>
              <Link to="/knowledge-graph" className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors">Knowledge Graph</Link>
              <Link to="/insights" className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors">Insights</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-extralight tracking-tight text-foreground">Search Publications</h1>
          <p className="text-foreground/70 font-light">
            Explore {totalPublications || 608} publications with intelligent semantic search
            {isSearchLoading && <span className="ml-2 text-primary">(Loading...)</span>}
          </p>
        </div>

        <div className="mb-8 glass-strong rounded-2xl p-6 filters-section">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
              <input
                type="text"
                placeholder="Search by publication title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/50 py-3 pl-12 pr-4 text-sm font-light text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="glass flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-light transition-all hover:bg-white/10"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <div className="relative sort-dropdown">
              <button 
                onClick={() => setShowSort(!showSort)}
                className="glass flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-light transition-all hover:bg-white/10"
              >
                <SortAsc className="h-4 w-4" />
                Sort
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showSort && (
                <div className="absolute right-0 top-full mt-2 w-64 glass-strong rounded-xl border border-border p-2 z-50">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-light text-foreground/60 mb-1">Sort by</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'relevance' | 'title' | 'year')}
                        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-light text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="title">Title</option>
                        <option value="year">Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-light text-foreground/60 mb-1">Order</label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-light text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-light text-foreground/70">Year From</label>
                <input
                  type="number"
                  placeholder="e.g. 2020"
                  value={yearFrom || ''}
                  onChange={(e) => setYearFrom(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-light text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-light text-foreground/70">Year To</label>
                <input
                  type="number"
                  placeholder="e.g. 2023"
                  value={yearTo || ''}
                  onChange={(e) => setYearTo(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-light text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="mb-2 block text-sm font-light text-foreground/70">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {['Human Physiology', 'Plant Biology', 'Microbiology', 'Cell Biology', 'Microgravity', 'Space Radiation'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(selectedTags.filter(t => t !== tag));
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      className={`rounded-lg px-3 py-1 text-xs font-light transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'glass text-foreground/70 hover:text-foreground hover:bg-white/10'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="mt-2 text-xs text-foreground/50 hover:text-foreground/70 transition-colors"
                  >
                    Clear all tags
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-light text-foreground/60">
                {isSearchLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <>
                    Showing <span className="text-primary">{publications.length}</span> of <span className="text-primary">{totalPublications}</span> publications
                    {totalPages > 1 && (
                      <span className="ml-2 text-xs text-foreground/40">
                        (Page {currentPage} of {totalPages})
                      </span>
                    )}
                    {healthData && (
                      <span className="ml-2 text-xs text-foreground/40">
                        (Backend: {healthData.status})
                      </span>
                    )}
                  </>
                )}
              </p>
          <button className="flex items-center gap-2 text-sm font-light text-foreground/70 transition-colors hover:text-foreground">
            <Download className="h-4 w-4" />
            Export Results
          </button>
        </div>

        <div className="space-y-4">
          {isSearchLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : publications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60 font-light">No publications found</p>
              <p className="text-sm text-foreground/40 mt-2">Try adjusting your search terms</p>
            </div>
          ) : (
            publications.map((pub) => (
            <Link
              key={pub.id}
              to={`/publications/${pub.id}`}
              className="glass-strong block rounded-2xl p-6 transition-all hover:bg-white/10 hover:scale-[1.02] cursor-pointer border border-transparent hover:border-primary/20 hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-light text-foreground hover:text-primary transition-colors">{pub.title}</h3>
                  <p className="text-sm text-foreground/60 font-light">
                    {pub.authors} · {pub.year}
                  </p>
                </div>
                <div className="ml-4 flex flex-col items-end gap-2">
                  <div className="glass rounded-lg px-3 py-1 text-xs font-light text-primary">
                    {pub.relevance}% match
                  </div>
                  <div className="flex items-center gap-1 text-xs font-light text-primary">
                    <ExternalLink className="h-3 w-3" />
                    View Details
                  </div>
                </div>
              </div>
              <p className="mb-4 text-sm font-light text-foreground/70 line-clamp-2">{pub.abstract}</p>
              <div className="flex flex-wrap gap-2">
                {pub.tags.map((tag, i) => (
                  <span key={i} className="glass rounded-lg px-2 py-1 text-xs font-light text-foreground/60">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && !isSearchLoading && (
              <div className="mt-12 flex items-center justify-center">
                <nav className="flex items-center gap-2" aria-label="Pagination">
                  {/* Previous button */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-light transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && goToPage(page)}
                        disabled={page === '...'}
                        className={`glass flex h-10 w-10 items-center justify-center rounded-xl text-sm font-light transition-all hover:bg-white/10 disabled:cursor-default disabled:hover:bg-transparent ${
                          page === currentPage
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'text-foreground/70'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-light transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      );
    }
