import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('first_field', 'second_field')
}

describe('CompareFieldsValidation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ first_field: 'value', second_field: 'different_value' })
    expect(error).toEqual(new InvalidParamError('second_field'))
  })
  test('Should return null if validation suceeds', () => {
    const sut = makeSut()
    const error = sut.validate({ first_field: 'value', second_field: 'value' })
    expect(error).toBeFalsy()
  })
})
