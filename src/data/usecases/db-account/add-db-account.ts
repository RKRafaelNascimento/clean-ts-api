import { AccountModel } from '../../../domain/models/account'
import {
  AddAccount,
  AddAccountModel
} from '../../../domain/usecases/add-account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAcount implements AddAccount {
  encrypter: Encrypter
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise((resolve) => resolve(null))
  }
}
