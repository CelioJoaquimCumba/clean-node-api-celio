import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer
    constructor (loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository, hashComparer: HashComparer) {
      this.loadAccountByEmailRepository = loadAccountByEmailRepositoryStub
      this.hashComparer = hashComparer
    }

    async auth (authentication: AuthenticationModel): Promise<string|null> {
      const { email, password } = authentication
      const account = await this.loadAccountByEmailRepository.load(email)
      if (!account) return null
      await this.hashComparer.compare(password, account.password)
      return null
    }
}
