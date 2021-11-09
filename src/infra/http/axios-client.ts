
import { HttpGetClient } from '@/infra/http'

import axios from 'axios'

export class AxiosHttpClient {
  async get (args: HttpGetClient.Params): Promise<void> {
    await axios.get(args.url, { params: args.params })
  }
}
