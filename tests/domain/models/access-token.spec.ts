import { AccessToken } from '@/domain/models'
import faker from 'faker'

describe('AccessToken', () => {
  const userId = faker.datatype.uuid()
  it('should create with a value', () => {
    const sut = new AccessToken(userId)

    expect(sut).toEqual({ value: userId })
  })

  it('should expire in 1800000 ms', () => {
    expect(AccessToken.expirationInMs).toEqual(1800000)
  })
})
