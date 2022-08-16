import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const fields = ['email', 'password']
      for (const field of fields) {
        if (!httpRequest.body[field]) {
          return new Promise((resolve) => resolve(badRequest(new MissingParamError(field))))
        }
      }
      const { email, password } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return new Promise((resolve) => resolve(badRequest(new InvalidParamError('email'))))
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
