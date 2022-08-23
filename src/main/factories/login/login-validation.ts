import { Validation } from '../../../presentation/helpers'
import { RequiredFieldValidation, ValidationComposite, EmailValidation } from '../../../presentation/helpers/validators/'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const requiredFields: string[] = ['email', 'password']
  const validations: Validation[] = []
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
