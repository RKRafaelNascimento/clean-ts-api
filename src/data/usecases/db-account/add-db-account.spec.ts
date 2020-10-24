import { Encrypter } from '../../protocols/encrypter'
import { DbAddAcount } from './add-db-account'

interface SutTypes {
  sut: DbAddAcount
  encrypterSub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncryterStub {
    async encrypt (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed_password'))
    }
  }

  const encrypterSub = new EncryterStub()
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
