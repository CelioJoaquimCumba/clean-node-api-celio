import { resolveObjectURL } from "buffer"
import { AddAccountRepository } from "../../../../data/protocols/addAccountRepository"
import { AccountModel } from "../../../../domain/models/account"
import { AddAccountModel } from "../../../../domain/usecases/add-account"
import { MongoHelper } from "../helpers/mongo-helper"

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const _id = result.insertedId.toHexString()
    return Object.assign({}, accountData, { id: _id })
  }
}
