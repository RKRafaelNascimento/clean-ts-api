import { Encrypter } from '../../data/protocols/encrypter'

import bcrypt from 'bcrypt'

export class BcrypterAdapter implements Encrypter {
  constructor (private readonly salt: number) {}
  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
