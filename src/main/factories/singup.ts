import { DbAddAcount } from '../../data/usecases/db-account/add-db-account'
import { BcrypterAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signUp'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LoggerControllerDecorator } from '../decorator/log'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdataper = new EmailValidatorAdapter()
  const bycryptAdapter = new BcrypterAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAcount(bycryptAdapter, accountMongoRepository)
  return new LoggerControllerDecorator(new SignUpController(emailValidatorAdataper, dbAddAccount))
}
