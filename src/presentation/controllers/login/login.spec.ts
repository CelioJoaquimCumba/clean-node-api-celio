import { Authentication, HttpRequest, EmailValidator } from './login-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { LoginController } from './login'
import { Validation } from '../../helpers'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}
interface SutType {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
  validationStub: Validation
}
const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(emailValidatorStub, authenticationStub, validationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub,
    validationStub
  }
}
const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@example.com',
    password: 'any_password'
  }
})

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest: HttpRequest = makeFakeRequest()
    const { email, password } = httpRequest.body
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(email, password)
  })
  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve('')))
    const httpRequest: HttpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })
  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRequest: HttpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ acessToken: 'any_token' }))
  })
  test('Should Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
