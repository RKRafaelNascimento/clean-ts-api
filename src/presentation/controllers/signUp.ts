import { AddAccount } from '../../domain/usecases/add-account'
import { InvalidParamsError, MissingParamsError } from '../erros'
import { badRequest, serverError } from '../helpers/http-helpers'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFiled = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]
      for (const field of requiredFiled) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }
      const { name, email, passwordConfirmation, password } = httpRequest.body
      if (passwordConfirmation !== password) {
        return badRequest(new InvalidParamsError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamsError('email'))
      }

      this.addAccount.add({
        name,
        email,
        password
      })
    } catch (error) {
      return serverError()
    }
  }
}
