import { InvalidParamsError, MissingParamsError, ServerError } from '../../erros'
import { AccountModel, AddAccount, AddAccountModel, EmailValidator } from './signup-protocols'
import { SignUpController } from './signUp'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }

      return fakeAccount
    }
  }

  return new AddAccountStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makesut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const { sut } = makesut()
    const httpRequest = {
      body: {
        email: 'any_@any.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('name'))
  })
  it('Should return 400 if no email is provided', () => {
    const { sut } = makesut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('email'))
  })
  it('Should return 400 if no password is provided', () => {
    const { sut } = makesut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_@any.com',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))
  })
  it('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makesut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_@any.com',
        password: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamsError('passwordConfirmation')
    )
  })

  it('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makesut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_@any.com',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamsError('passwordConfirmation')
    )
  })

  it('Should return 400 if an email is provided', () => {
    const { sut, emailValidatorStub } = makesut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_@any.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamsError('email')
    )
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makesut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@any.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@any.com')
  })

  it('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makesut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_@any.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(
      new ServerError()
    )
  })

  it('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makesut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@any.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@any.com',
      password: 'any_password'
    })
  })

  it('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makesut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_@any.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(
      new ServerError()
    )
  })
})