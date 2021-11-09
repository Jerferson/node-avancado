import { FacebookAccount } from '@/domain/models'
import faker from 'faker'

describe('FacebookAccount', () => {
  const fbData = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    facebookId: faker.datatype.uuid()
  }

  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(fbData)

    expect(sut).toEqual({
      name: fbData.name,
      email: fbData.email,
      facebookId: fbData.facebookId
    })
  })

  it('should update name if its empty with facebook data only', () => {
    const id = faker.datatype.uuid()
    const accountData = { id: id }

    const sut = new FacebookAccount(fbData, accountData)

    expect(sut).toEqual({
      id: accountData.id,
      name: fbData.name,
      email: fbData.email,
      facebookId: fbData.facebookId
    })
  })

  it('should not update name if its not empty', () => {
    const accountData = { id: faker.datatype.uuid(), name: 'any_name' }

    const sut = new FacebookAccount(fbData, accountData)

    expect(sut).toEqual({
      id: accountData.id,
      name: accountData.name,
      email: fbData.email,
      facebookId: fbData.facebookId
    })
  })
})
