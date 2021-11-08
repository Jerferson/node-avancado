import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository
} from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'
import faker from 'faker'

describe('FacebookAuthenticationService', () => {
  const token = faker.datatype.uuid()
  const fbId = faker.datatype.uuid()
  const fbName = faker.name.findName()
  const fbEmail = faker.internet.email()

  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationService

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: fbName,
      email: fbEmail,
      facebookId: fbId
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo
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

  it('shoul create account with Facebook data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      email: fbEmail,
      name: fbName,
      facebookId: fbId
    })
    expect(userAccountRepo.saveWithFacebook).toHaveReturnedTimes(1)
  })

  it('shoul not update account name', async () => {
    const id = faker.datatype.uuid()
    const name = faker.name.findName()
    userAccountRepo.load.mockResolvedValueOnce({
      id: id,
      name: name
    })

    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      id: id,
      name: name,
      email: fbEmail,
      facebookId: fbId
    })
    expect(userAccountRepo.saveWithFacebook).toHaveReturnedTimes(1)
  })

  it('shoul call update account name', async () => {
    const id = faker.random.uuid()

    userAccountRepo.load.mockResolvedValueOnce({
      id: id
    })

    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      id: id,
      name: fbName,
      email: fbEmail,
      facebookId: fbId
    })
    expect(userAccountRepo.saveWithFacebook).toHaveReturnedTimes(1)
  })
})
