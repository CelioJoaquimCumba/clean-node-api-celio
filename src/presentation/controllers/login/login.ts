import { MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const fields = ['email', 'password']
      for (const field of fields) {
        if (!httpRequest.body[field]) {
          return new Promise((resolve) => resolve(badRequest(new MissingParamError(field))))
        }
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
