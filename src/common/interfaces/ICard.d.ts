export interface InterfaceCard {
  id: number
  title: string
  color: string
  description: string
  custom: {
    deadline: string
  }
  users: []
  created_at: number
}
