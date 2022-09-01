import { Validation } from '../../../presentation/helpers'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../presentation/helpers/validators'
import { EmailValidator } from '../../../presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../presentation/helpers/validators/validation-composite')
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    const requiredFields: string[] = ['email', 'password']
    const validations: Validation[] = []
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    makeLoginValidation()
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
