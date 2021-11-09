import { TokenGenerator } from '@/data/contracts/crypto'

import jwt from 'jsonwebtoken'

export class JwtTokenGenetator {
  constructor (private readonly secret: string) { }
  async generateToken (params: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000
    jwt.sign(
      { key: params.key },
      this.secret,
      { expiresIn: expirationInSeconds }
    )
  }
}
