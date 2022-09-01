import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'

export default class JwtAdapter implements Encrypter {
  constructor (
    private readonly secret: string) {}

  async encrypt (id: string): Promise<string> {
    const accessToken = await jwt.sign({ id }, this.secret)
    return accessToken
  }
}
