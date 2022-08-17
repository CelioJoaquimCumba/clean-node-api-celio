import { Authentication, Controller, HttpRequest, HttpResponse, EmailValidator } from './login-protocols'
import { InvalidParamError, MissingParamError, UnauthorizedError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const fields = ['email', 'password']
      for (const field of fields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const acess_token = await this.authentication.auth(email, password)
      if (acess_token.trim() === '') {
        return unauthorized()
      }
      return ok({
        id: 'valid_id',
        name: 'valid_name',
        password: 'valid_password'
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
