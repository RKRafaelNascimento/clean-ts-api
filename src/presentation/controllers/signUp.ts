import { MissingParamsError } from '../erros/missing-params-error'
import { badRequest } from '../helpers/http-helpers'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFiled = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFiled) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field))
      }
    }
  }
}
