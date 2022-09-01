import { resolveObjectURL } from 'buffer'
import { ObjectId } from 'mongodb'
import { AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, AccountModel, AddAccountModel } from './account-mongo-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const _id = result.insertedId.toHexString()
    return MongoHelper.map(_id, accountData)
  }

  async loadByEmail (email: string): Promise<AccountModel| null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    if (account) {
      const _id = account._id.toHexString()
      return MongoHelper.map(_id, account)
    }
    return null
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken: token } })
  }
}
