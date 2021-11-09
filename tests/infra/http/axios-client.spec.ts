import { AxiosHttpClient } from '@/infra/http'

import axios from 'axios'
import faker from 'faker'

jest.mock('axios')

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let params: object

  beforeAll(() => {
    url = faker.image.imageUrl()
    params = { any: faker.random.word() }

    fakeAxios = axios as jest.Mocked<typeof axios>
  })

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })
  describe('get', () => {
    it('should call get with correct params', async () => {
      await sut.get({ url, params })

      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
      expect(fakeAxios.get).toHaveReturnedTimes(1)
    })
  })
})
