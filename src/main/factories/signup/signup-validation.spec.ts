import { Validation } from '../../../presentation/helpers'
import { CompareFieldsValidation, EmailValidation, ValidationComposite, RequiredFieldValidation } from '../../../presentation/helpers/validators/'
import { EmailValidator } from '../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    const requiredFields: string[] = ['email', 'name', 'password', 'passwordConfirmation']
    const validations: Validation[] = []
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    makeSignUpValidation()
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
