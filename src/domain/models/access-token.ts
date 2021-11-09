export class AccessToken {
  constructor (private readonly value: string) {}

  /**
   * Expiration time of token in milliseconds (30 minutes)
   *
   * @readonly
   * @static
   * @type {number}
   * @memberof AccessToken
   */
  static get expirationInMs (): number {
    return 30 * 60 * 1000
  }
}
