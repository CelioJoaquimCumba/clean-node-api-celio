import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    constructor (loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository) {
      this.loadAccountByEmailRepository = loadAccountByEmailRepositoryStub
    }

    async auth (authentication: AuthenticationModel): Promise<string> {
      const { email, password } = authentication
      await this.loadAccountByEmailRepository.load(email)
      return ''
    }
}
