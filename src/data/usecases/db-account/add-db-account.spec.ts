import { Encrypter } from '../../protocols/encrypter'
import { DbAddAcount } from './add-db-account'

interface SutTypes {
  sut: DbAddAcount
  encrypterSub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncryterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed_password'))
    }
  }

  return new EncryterStub()
}

const makeSut = (): SutTypes => {
  const encrypterSub = makeEncrypter()
  const sut = new DbAddAcount(encrypterSub)

  return {
    sut,
    encrypterSub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterSub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterSub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await sut.add(accountData)
    expect(encryptSpy).toBeCalledWith('valid_password')
  })
})
