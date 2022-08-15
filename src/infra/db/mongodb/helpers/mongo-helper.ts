import { Collection, MongoClient } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },
  async disconnect (): Promise<void> {
    if (!this.client) {
      await this.client.close()
      this.client = null
    }
  },
  async getCollection (name: string): Promise<Collection> {
    await this.connect(this.uri)

    return this.client.db().collection(name)
  },
  map: (id: string, collection: any): any => {
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: id })
  }
}
