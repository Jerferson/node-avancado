import { JwtTokenGenetator } from '@/infra/crypto'
import faker from 'faker'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenetator
  let fakeJwt: jest.Mocked<typeof jwt>
  let anyToken: string
  let secrete: string
  let key: string

  beforeAll(() => {
    anyToken = faker.datatype.uuid()
    secrete = faker.datatype.uuid()
    key = faker.random.word()
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => anyToken)
  })

  beforeEach(() => {
    sut = new JwtTokenGenetator(secrete)
  })

  it('should call sign with correct params', async () => {
    await sut.generateToken({ key, expirationInMs: 1000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secrete, { expiresIn: 1 })
  })

  it('should return a token', async () => {
    const token = await sut.generateToken({ key, expirationInMs: 1000 })

    expect(token).toBe(anyToken)
  })

  it('should rethrows if sign throws', async () => {
    const errorMessage = faker.random.word()
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error(errorMessage) })

    const promise = sut.generateToken({ key, expirationInMs: 1000 })

    await expect(promise).rejects.toThrowError(errorMessage)
  })
})
