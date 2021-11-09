import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { TokenGenerator } from '@/data/contracts/crypto'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookUserApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) { }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookUserApi.loadUser(params)
    if (fbData === undefined) {
      return new AuthenticationError()
    }
    const accountData = await this.userAccountRepo.load({ email: fbData.email })
    const facebookAccount = new FacebookAccount(fbData, accountData)
    const { id } = await this.userAccountRepo.saveWithFacebook(facebookAccount)
    await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
    return null as any
  }
}
