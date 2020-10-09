import { InvalidParamsError } from '../erros/invalid-params-error'
import { MissingParamsError } from '../erros/missing-params-error'
import { badRequest } from '../helpers/http-helpers'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFiled = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFiled) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field))
      }
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!isValid) {
      return badRequest(new InvalidParamsError('email'))
    }
  }
}
