
export enum SentimentLabel {
  Positive = 'Positive',
  Neutral = 'Neutral',
  Tense = 'Tense',
  Conflicted = 'Conflicted'
}

export enum DecisionStatus {
  Final = 'Final decision',
  Tentative = 'Tentative decision',
  NeedsApproval = 'Needs further approval'
}

export enum UrgencyLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export enum ConfidenceLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface Decision {
  text: string;
  status: DecisionStatus;
  confidence: ConfidenceLevel;
}

export interface ActionItem {
  task: string;
  owner: string;
  priority: UrgencyLevel;
  deadline: string;
}

export interface Risk {
  issue: string;
  explanation: string;
}

export interface ProductivityInsight {
  inefficiency: string;
  suggestion: string;
}

export interface MeetingAnalysis {
  meetingType: string;
  overallSentiment: {
    label: SentimentLabel;
    explanation: string;
  };
  executiveSummary: string;
  decisions: Decision[];
  actionItems: ActionItem[];
  ambiguitiesAndRisks: Risk[];
  productivityInsights: string[];
  suggestedImprovements: string[];
  participants: { name: string; role: string }[];
  nextExecutionCheckpoint: {
    description: string;
    deadline: string;
  };
}
