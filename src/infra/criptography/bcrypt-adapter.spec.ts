import { BcrypterAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }
}))

describe('BcrypterAdapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcrypterAdapter(salt)
    const hashSpy = spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  it('Should return a hash on success', async () => {
    const salt = 12
    const sut = new BcrypterAdapter(salt)
    const hashPassword = await sut.encrypt('any_value')
    expect(hashPassword).toEqual('hash')
  })
})
