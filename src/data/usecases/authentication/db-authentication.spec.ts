import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparer = makeHashComparer()
  const encrypterStub = makeEncrypterStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparer, encrypterStub, updateAccessTokenRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub: hashComparer,
    encrypterStub,
    updateAccessTokenRepositoryStub: updateAccessTokenRepositoryStub
  }
}
const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return new Promise<void>(resolve => resolve())
    }
  }
  return new UpdateAccessRepositoryStub()
}
const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async generate (id: string): Promise<string> {
      const token = 'any_token'
      return new Promise(resolve => resolve(token))
    }
  }
  return new EncrypterStub()
}
const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}
const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account = makeFakeAccount()
      return new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}
const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@example.com',
  password: 'hashed_password'
})
const makeFakeAuthenticationModel = (): AuthenticationModel => ({
  email: 'any_email@example.com',
  password: 'any_password'
})

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const authModel = makeFakeAuthenticationModel()
    await sut.auth(authModel)
    expect(loadSpy).toHaveBeenCalledWith(authModel.email)
  })
  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const authModel = makeFakeAuthenticationModel()
    const promise = sut.auth(authModel)
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const authModel = makeFakeAuthenticationModel()
    const acess_token = await sut.auth(authModel)
    expect(acess_token).toBeNull()
  })
  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub: hashComparer } = makeSut()
    const compareSpy = jest.spyOn(hashComparer, 'compare')
    const authModel = makeFakeAuthenticationModel()
    await sut.auth(authModel)
    expect(compareSpy).toHaveBeenCalledWith(authModel.password, makeFakeAccount().password)
  })
  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub: hashComparer } = makeSut()
    jest.spyOn(hashComparer, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const authModel = makeFakeAuthenticationModel()
    const promise = sut.auth(authModel)
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if HashComparer returns null', async () => {
    const { sut, hashComparerStub: hashComparer } = makeSut()
    jest.spyOn(hashComparer, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const authModel = makeFakeAuthenticationModel()
    const match = await sut.auth(authModel)
    expect(match).toBeNull()
  })
  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'generate')
    const authModel = makeFakeAuthenticationModel()
    await sut.auth(authModel)
    expect(generateSpy).toHaveBeenCalledWith(makeFakeAccount().id)
  })
  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const authModel = makeFakeAuthenticationModel()
    const promise = sut.auth(authModel)
    await expect(promise).rejects.toThrow()
  })
  test('Should return a token', async () => {
    const { sut } = makeSut()
    const authModel = makeFakeAuthenticationModel()
    const acessToken = await sut.auth(authModel)
    expect(acessToken).toEqual('any_token')
  })
  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    const authModel = makeFakeAuthenticationModel()
    await sut.auth(authModel)
    expect(updateSpy).toHaveBeenCalledWith(makeFakeAccount().id, 'any_token')
  })
  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const authModel = makeFakeAuthenticationModel()
    const promise = sut.auth(authModel)
    await expect(promise).rejects.toThrow()
  })
})
