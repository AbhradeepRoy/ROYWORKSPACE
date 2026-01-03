
export interface StudentProfile {
  name: string;
  educationLevel: string;
  major: string;
  interests: string[];
  skills: string[];
  goals: string;
  history: string;
  language: string;
}

export interface CareerRecommendation {
  title: string;
  description: string;
  alignmentScore: number;
  salaryRange: string;
  minSalary: number; // For sorting
  location: string; // For sorting/filtering
  requiredSkills: string[];
  roadmap: string[];
  marketOutlook: string;
}

export interface SkillSuggestion {
  name: string;
  description: string;
  importance: string;
  learningResources: { title: string; type: 'video' | 'course' | 'article' }[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  trendingStatus: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
