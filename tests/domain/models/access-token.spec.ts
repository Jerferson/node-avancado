import { AccessToken } from '@/domain/models'
import faker from 'faker'

describe('AccessToken', () => {
  const userId = faker.datatype.uuid()
  it('should create with a value', () => {
    const sut = new AccessToken(userId)

    expect(sut).toEqual({ value: userId })
  })
})
