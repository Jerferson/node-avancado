import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { TokenGenerator } from '@/data/contracts/crypto'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'

import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'
import faker from 'faker'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationService

  let token: string
  let userId: string
  let fbId: string
  let fbName: string
  let fbEmail: string
  let generatedToken: string

  beforeAll(() => {
    token = faker.datatype.uuid()
    userId = faker.datatype.uuid()
    fbId = faker.datatype.uuid()
    fbName = faker.name.findName()
    fbEmail = faker.internet.email()
    generatedToken = faker.datatype.uuid()

    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: fbName,
      email: fbEmail,
      facebookId: fbId
    })

    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: userId })

    crypto = mock()
    crypto.generateToken.mockResolvedValue(generatedToken)
  })

  beforeEach(() => {
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto
    )
  })

  it('shoul call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveReturnedTimes(1)
  })

  it('shoul returns AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('shoul call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: fbEmail })
    expect(userAccountRepo.load).toHaveReturnedTimes(1)
  })

  it('shoul call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(facebookAccountStub)

    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveReturnedTimes(1)
  })

  it('shoul call TokenGenerator with correct params', async () => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: userId,
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveReturnedTimes(1)
  })

  it('shoul return an AccessToken on success', async () => {
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AccessToken(generatedToken))
  })

  it('shoul rethrow if LoadFacebookUserApi throws', async () => {
    const error = faker.random.word()
    facebookApi.loadUser.mockRejectedValueOnce(new Error(error))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrowError(error)
  })

  it('shoul rethrow if LoadUserAccountRepository throws', async () => {
    const error = faker.random.word()
    userAccountRepo.load.mockRejectedValueOnce(new Error(error))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrowError(error)
  })

  it('shoul rethrow if SaveFacebookAccountRepository throws', async () => {
    const error = faker.random.word()
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error(error))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrowError(error)
  })

  it('shoul rethrow if TokenGenerator throws', async () => {
    const error = faker.random.word()
    crypto.generateToken.mockRejectedValueOnce(new Error(error))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrowError(error)
  })
})
