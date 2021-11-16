import { badRequest, HttpResponse, serverError } from '@/application/helpers'
import { RequiredFildError } from '../errors'

export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse>

  async handle (httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)
    if (error !== undefined) {
      return badRequest(error)
    }

    try {
      return await this.perform(httpRequest)
    } catch (error) {
      return serverError(error as Error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    if (httpRequest.id === '' || httpRequest.id === null || httpRequest.id === undefined) {
      return new RequiredFildError('id')
    }
  }
}
