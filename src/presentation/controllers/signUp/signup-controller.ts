// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpRequest, Controller, AddAccount } from './signUp-controller-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok, Validation } from '../../helpers'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
