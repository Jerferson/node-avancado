import { JwtTokenGenetator } from '@/data/contracts/crypto'
import faker from 'faker'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenetator
  let fakeJwt: jest.Mocked<typeof jwt>
  let secrete: string

  beforeEach(() => {
    secrete = faker.datatype.uuid()
    sut = new JwtTokenGenetator(secrete)
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })
  it('should call sign with correct params', async () => {
    const key = faker.random.word()

    await sut.generateToken({ key, expirationInMs: 1000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secrete, { expiresIn: 1 })
  })
})
