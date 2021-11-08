import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository
} from '../contracts/repos'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookUserApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository
  ) { }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookUserApi.loadUser(params)
    if (fbData === undefined) {
      return new AuthenticationError()
    }

    const accountData = await this.userAccountRepo.load({ email: fbData.email })
    if (accountData !== undefined) {
      await this.userAccountRepo.updateWithFacebook({
        id: accountData.id,
        name: accountData.name ?? fbData.name,
        facebookId: fbData.facebookId
      })
      return null as any
    }

    await this.userAccountRepo.createFromFacebook(fbData)
    return null as any
  }
}
