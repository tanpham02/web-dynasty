import { BaseModel } from './base'
import { Users } from './user'

export interface Salary extends BaseModel {
  staffId: string | Users
  value: number
  isPayment: boolean // Disable after checking. Only theADMIN role was updated after
  note?: string
}
