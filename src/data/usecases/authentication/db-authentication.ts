import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  TokenGenerator,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer
    private readonly tokenGenerator: TokenGenerator
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    constructor (loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository, hashComparer: HashComparer, tokenGenerator: TokenGenerator, updateAccessTokenRepository: UpdateAccessTokenRepository) {
      this.loadAccountByEmailRepository = loadAccountByEmailRepositoryStub
      this.hashComparer = hashComparer
      this.tokenGenerator = tokenGenerator
      this.updateAccessTokenRepository = updateAccessTokenRepository
    }

    async auth (authentication: AuthenticationModel): Promise<string|null> {
      const { email, password } = authentication
      const account = await this.loadAccountByEmailRepository.load(email)
      if (!account) return null
      const match = await this.hashComparer.compare(password, account.password)
      if (!match) return null
      const token = await this.tokenGenerator.generate(account.id)
      if (!token) return null
      await this.updateAccessTokenRepository.update(account.id, token)
      return token
    }
}
