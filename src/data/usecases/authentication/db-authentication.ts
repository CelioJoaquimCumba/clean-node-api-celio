import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer
    private readonly tokenGenerator: TokenGenerator
    constructor (loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository, hashComparer: HashComparer, tokenGenerator: TokenGenerator) {
      this.loadAccountByEmailRepository = loadAccountByEmailRepositoryStub
      this.hashComparer = hashComparer
      this.tokenGenerator = tokenGenerator
    }

    async auth (authentication: AuthenticationModel): Promise<string|null> {
      const { email, password } = authentication
      const account = await this.loadAccountByEmailRepository.load(email)
      if (!account) return null
      const match = await this.hashComparer.compare(password, account.password)
      if (!match) return null
      const token = await this.tokenGenerator.generate(account.id)
      if (!token) return null
      return null
    }
}
