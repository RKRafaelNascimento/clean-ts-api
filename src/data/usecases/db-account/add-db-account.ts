import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Encrypter
} from './add-db-account-protocols'

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
