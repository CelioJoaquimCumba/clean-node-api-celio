import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer
    private readonly encrypter: Encrypter
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    constructor (loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository, hashComparer: HashComparer, encrypter: Encrypter, updateAccessTokenRepository: UpdateAccessTokenRepository) {
      this.loadAccountByEmailRepository = loadAccountByEmailRepositoryStub
      this.hashComparer = hashComparer
      this.encrypter = encrypter
      this.updateAccessTokenRepository = updateAccessTokenRepository
    }

    async auth (authentication: AuthenticationModel): Promise<string|null> {
      const { email, password } = authentication
      const account = await this.loadAccountByEmailRepository.loadByEmail(email)
      if (!account) return null
      const match = await this.hashComparer.compare(password, account.password)
      if (!match) return null
      const token = await this.encrypter.encrypt(account.id)
      if (!token) return null
      await this.updateAccessTokenRepository.updateAccessToken(account.id, token)
      return token
    }
}
