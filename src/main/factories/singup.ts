import { DbAddAcount } from '../../data/usecases/db-account/add-db-account'
import { BcrypterAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signUp'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const emailValidatorAdataper = new EmailValidatorAdapter()
  const bycryptAdapter = new BcrypterAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAcount(bycryptAdapter, accountMongoRepository)
  return new SignUpController(emailValidatorAdataper, dbAddAccount)
}
