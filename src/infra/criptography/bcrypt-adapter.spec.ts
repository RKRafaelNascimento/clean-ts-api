import { BcrypterAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

describe('BcrypterAdapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcrypterAdapter(salt)
    const hashSpy = spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
