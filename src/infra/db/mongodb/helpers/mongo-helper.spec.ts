import { MongoHelper as sut } from './mongo-helper'
beforeAll(async () => {
  await sut.connect(process.env.MONGO_URL as string)
})
afterAll(async () => {
  await sut.disconnect()
})
describe('Mongo Helper', () => {
  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
