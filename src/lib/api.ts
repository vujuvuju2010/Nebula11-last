// API service for NASA Bioscience Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface AskQuestionRequest {
  question: string;
  context?: string;
}

export interface AskQuestionResponse {
  question: string;
  answer: string;
  model: string;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  role: 'assistant';
  timestamp: string;
}

export interface SummarizeRequest {
  topic: string;
  style?: 'concise' | 'detailed' | 'technical';
}

export interface SummarizeResponse {
  topic: string;
  summary: string;
  style: string;
  timestamp: string;
}

export interface ExtractRequest {
  text: string;
  extractType?: 'key_findings' | 'organisms' | 'methods' | 'results';
}

export interface ExtractResponse {
  extractType: string;
  extracted: string;
  timestamp: string;
}

export interface GapsRequest {
  area?: string;
}

export interface GapsResponse {
  area: string;
  gaps: string;
  timestamp: string;
}

export interface CompareRequest {
  topic1: string;
  topic2: string;
}

export interface CompareResponse {
  topic1: string;
  topic2: string;
  comparison: string;
  timestamp: string;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  model?: string;
  apiKey?: string;
  error?: string;
}

export interface Publication {
  id: string | number;
  title: string;
  link: string;
  authors: string;
  year: number;
  abstract: string;
  tags: string[];
  relevance: number;
  pmcId?: string;
}

export interface PublicationsResponse {
  publications: Publication[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface PublicationStats {
  total: number;
  byYear: Record<string, number>;
  byTag: Record<string, number>;
  recent: Publication[];
}

export interface AISummary {
  objective: string;
  findings: string[];
  implications: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Health check
  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  // Ask a question
  async askQuestion(data: AskQuestionRequest): Promise<AskQuestionResponse> {
    return this.request<AskQuestionResponse>('/api/ask', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Chat conversation
  async chat(data: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Summarize a topic
  async summarize(data: SummarizeRequest): Promise<SummarizeResponse> {
    return this.request<SummarizeResponse>('/api/summarize', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Extract information from text
  async extract(data: ExtractRequest): Promise<ExtractResponse> {
    return this.request<ExtractResponse>('/api/extract', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Find research gaps
  async findGaps(data: GapsRequest = {}): Promise<GapsResponse> {
    return this.request<GapsResponse>('/api/gaps', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Compare two topics
  async compare(data: CompareRequest): Promise<CompareResponse> {
    return this.request<CompareResponse>('/api/compare', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get publications
  async getPublications(params?: {
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'relevance' | 'title' | 'year';
    sortOrder?: 'asc' | 'desc';
    yearFrom?: number;
    yearTo?: number;
    tags?: string[];
  }): Promise<PublicationsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params?.yearFrom) searchParams.append('yearFrom', params.yearFrom.toString());
    if (params?.yearTo) searchParams.append('yearTo', params.yearTo.toString());
    if (params?.tags) {
      params.tags.forEach(tag => searchParams.append('tags', tag));
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/publications?${queryString}` : '/api/publications';
    
    return this.request<PublicationsResponse>(endpoint);
  }

  // Get specific publication
  async getPublication(id: string | number): Promise<Publication> {
    return this.request<Publication>(`/api/publications/${id}`);
  }

  // Get publication statistics
  async getPublicationStats(): Promise<PublicationStats> {
    return this.request<PublicationStats>('/api/publications/stats');
  }

  // Get AI summary for a publication
  async getPublicationSummary(publication: {
    title: string;
    authors: string;
    year: number;
    tags: string[];
  }): Promise<AISummary> {
    return this.request<AISummary>('/api/publication-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publication),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type {
  AskQuestionRequest,
  AskQuestionResponse,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  SummarizeRequest,
  SummarizeResponse,
  ExtractRequest,
  ExtractResponse,
  GapsRequest,
  GapsResponse,
  CompareRequest,
  CompareResponse,
  HealthResponse,
};
