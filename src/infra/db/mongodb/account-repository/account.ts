import { resolveObjectURL } from 'buffer'
import { AddAccountRepository } from '../../../../data/protocols/db/addAccountRepository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
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
}
