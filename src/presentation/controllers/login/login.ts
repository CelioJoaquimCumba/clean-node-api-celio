import { Authentication, Controller, HttpRequest, HttpResponse, EmailValidator } from './login-protocols'
import { InvalidParamError, MissingParamError, UnauthorizedError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { Validation } from '../../helpers'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  private readonly validation: Validation
  constructor (emailValidator: EmailValidator, authentication: Authentication, validation: Validation) {
    this.emailValidator = emailValidator
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const acess_token = await this.authentication.auth(email, password)
      if (acess_token.trim() === '') {
        return unauthorized()
      }
      return ok({ acessToken: 'any_token' })
    } catch (error) {
      return serverError(error)
    }
  }
}
