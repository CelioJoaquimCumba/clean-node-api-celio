import { Collection, MongoClient } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect (uri: string): Promise<void> {
    console.log(uri)
    console.log('-------------------------------------------------------------------------------------------------------------------------------------------')
    this.client = await MongoClient.connect(uri)
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  },
  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },
  map: (_id: string, collection: any): any => {
    return Object.assign({}, collection, { id: _id })
  }
}
