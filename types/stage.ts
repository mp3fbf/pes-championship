export interface Stage {
  id: number
  seasonId: number
  name: string
  month: number
  status: 'pending' | 'active' | 'completed'
  format: 'single_match' | 'home_away'
  createdAt: Date
} 