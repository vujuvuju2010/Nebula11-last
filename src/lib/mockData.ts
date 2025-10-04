// Mock data for development - can be replaced with real API calls
export interface Publication {
  id: number;
  title: string;
  authors: string;
  year: number;
  abstract: string;
  tags: string[];
  relevance: number;
}

export const mockPublications: Publication[] = [
  {
    id: 1,
    title: 'Effects of Microgravity on Bone Density in Long-Duration Spaceflight',
    authors: 'Smith, J., Anderson, K., Martinez, R.',
    year: 2022,
    abstract: 'This study examines the effects of prolonged exposure to microgravity on bone mineral density in astronauts during extended missions aboard the International Space Station...',
    tags: ['Human Physiology', 'Bone Health', 'ISS', 'Long-Duration'],
    relevance: 98,
  },
  {
    id: 2,
    title: 'Plant Growth Responses to Reduced Gravity Environments: Arabidopsis Studies',
    authors: 'Chen, L., Wilson, P., Thompson, M.',
    year: 2022,
    abstract: 'Investigation of plant morphology, gene expression, and growth patterns in Arabidopsis thaliana under simulated and actual microgravity conditions...',
    tags: ['Plant Biology', 'Arabidopsis', 'Gene Expression', 'Microgravity'],
    relevance: 95,
  },
  {
    id: 3,
    title: 'Microbial Behavior and Biofilm Formation in Space Station Environments',
    authors: 'Johnson, R., Davis, A., Kumar, S.',
    year: 2021,
    abstract: 'Analysis of bacterial growth patterns, antibiotic resistance, and biofilm formation in the ISS environment, with implications for crew health and hardware maintenance...',
    tags: ['Microbiology', 'Biofilm', 'ISS', 'Crew Health'],
    relevance: 92,
  },
  {
    id: 4,
    title: 'Cardiovascular Adaptations During Spaceflight: A Longitudinal Study',
    authors: 'Lee, H., Brown, T., Garcia, F.',
    year: 2021,
    abstract: 'Comprehensive examination of cardiovascular system changes including cardiac output, blood pressure regulation, and vascular remodeling during and after spaceflight...',
    tags: ['Human Physiology', 'Cardiovascular', 'Adaptation', 'ISS'],
    relevance: 89,
  },
  {
    id: 5,
    title: 'Circadian Rhythm Disruption in Space: Molecular Mechanisms',
    authors: 'Wang, X., Rodriguez, M., Taylor, S.',
    year: 2020,
    abstract: 'Study of molecular clock gene expression and melatonin production in astronauts, examining the effects of altered light-dark cycles on sleep patterns...',
    tags: ['Human Physiology', 'Circadian Rhythm', 'Gene Expression', 'Sleep'],
    relevance: 87,
  },
];

// Mock search function - in real implementation, this would call the backend
export const searchPublications = async (query: string, filters?: any): Promise<Publication[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query.trim()) {
    return mockPublications;
  }
  
  const searchTerm = query.toLowerCase();
  return mockPublications.filter(pub => 
    pub.title.toLowerCase().includes(searchTerm) ||
    pub.abstract.toLowerCase().includes(searchTerm) ||
    pub.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    pub.authors.toLowerCase().includes(searchTerm)
  );
};
