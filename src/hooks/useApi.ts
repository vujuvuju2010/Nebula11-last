import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiService,
  AskQuestionRequest,
  ChatRequest,
  SummarizeRequest,
  ExtractRequest,
  GapsRequest,
  CompareRequest,
  HealthResponse,
  Publication,
  PublicationsResponse,
  PublicationStats,
  AISummary,
} from '@/lib/api';

// Health check query
export const useHealthCheck = () => {
  return useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: () => apiService.getHealth(),
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
  });
};

// Ask question mutation
export const useAskQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AskQuestionRequest) => apiService.askQuestion(data),
    onSuccess: () => {
      // Invalidate related queries if needed
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
};

// Chat mutation
export const useChat = () => {
  return useMutation({
    mutationFn: (data: ChatRequest) => apiService.chat(data),
  });
};

// Summarize mutation
export const useSummarize = () => {
  return useMutation({
    mutationFn: (data: SummarizeRequest) => apiService.summarize(data),
  });
};

// Extract mutation
export const useExtract = () => {
  return useMutation({
    mutationFn: (data: ExtractRequest) => apiService.extract(data),
  });
};

// Find gaps mutation
export const useFindGaps = () => {
  return useMutation({
    mutationFn: (data: GapsRequest) => apiService.findGaps(data),
  });
};

// Compare mutation
export const useCompare = () => {
  return useMutation({
    mutationFn: (data: CompareRequest) => apiService.compare(data),
  });
};

// Custom hook for managing chat state
export const useChatState = () => {
  const chatMutation = useChat();
  
  const sendMessage = async (message: string, history: any[] = []) => {
    return chatMutation.mutateAsync({
      message,
      history,
    });
  };

  return {
    sendMessage,
    isLoading: chatMutation.isPending,
    error: chatMutation.error,
    data: chatMutation.data,
  };
};

// Publications hooks
export const usePublications = (params?: {
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'title' | 'year';
  sortOrder?: 'asc' | 'desc';
  yearFrom?: number;
  yearTo?: number;
  tags?: string[];
}) => {
  return useQuery<PublicationsResponse>({
    queryKey: ['publications', params],
    queryFn: () => apiService.getPublications(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePublication = (id: string | number) => {
  return useQuery<Publication>({
    queryKey: ['publication', id],
    queryFn: () => apiService.getPublication(id),
    enabled: !!id,
  });
};

export const usePublicationStats = () => {
  return useQuery<PublicationStats>({
    queryKey: ['publicationStats'],
    queryFn: () => apiService.getPublicationStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// AI Summary mutation
export const usePublicationSummary = () => {
  return useMutation<AISummary, Error, {
    title: string;
    authors: string;
    year: number;
    tags: string[];
  }>({
    mutationFn: (publication) => apiService.getPublicationSummary(publication),
  });
};
