import { AccountModel } from '../../../usecases/add-acount/db-add-account-protocols'

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountModel| null>
}
