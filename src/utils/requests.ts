import { token } from "./token"
import { appConfig } from "@/common/config"

interface IParams {
  url: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  base_url?: boolean
  data?: any
}

interface Config {
  "Content-Type": string
  [x: string]: string
}

function send(params: IParams): Promise<any> {
  // 加载中
  uni.showLoading({
    title: "加载中",
  })
  return new Promise((resolve, reject) => {
    let defaultParams = {
      timeout: 10000,
      ...params,
      url: (params.base_url ? params.base_url : appConfig.apiUrl) + params.url,
    }
    console.log(`正在请求：${defaultParams.url}`)
    uni.request({
      ...defaultParams,
      header: (() => {
        const tokenValue = token.get()
        let config: Config = {
          "Content-Type": "application/json",
        }
        if (tokenValue) {
          config[appConfig.tokenKey] = "Bearer " + tokenValue
        }
        return config
      })(),
      success(res) {
        console.log("返回数据:::", res)
        if (res.statusCode !== 200) {
          reject(res.data)
        }
        resolve(res.data)
      },
      fail(err) {
        reject(err)
      },
      complete() {
        uni.hideLoading()
      },
    })
  })
}

export default {
  post: (url: string, data: any) => {
    return send({ url, data, method: "POST" })
  },
  get: (url: string, data: any) => {
    return send({ url, data, method: "GET" })
  },
  delete(url: string, data: any) {
    return send({ url, data, method: "DELETE" })
  },
}
