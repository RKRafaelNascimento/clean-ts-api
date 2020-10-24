import { DbAddAcount } from './add-db-account'

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncryterStub {
      async encrypt (value: string): Promise<string> {
        return await new Promise((resolve) => resolve('hashed_password'))
      }
    }

    const encryptStub = new EncryterStub()
    const sut = new DbAddAcount(encryptStub)
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await sut.add(accountData)
    expect(encryptSpy).toBeCalledWith('valid_password')
  })
})
