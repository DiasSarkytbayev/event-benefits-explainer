export interface EventData {
  eventName: string
  eventType: string
  date: string
  location: string
  description: string
  organizer: string
  targetAudience: string
  cost: string
  duration: string
  additionalInfo?: string
}

export interface AnalysisResponse {
  benefits: string[]
  personalizedInsights: string
  keyTakeaways: string[]
  recommendations: string[]
  overallScore: number
}
