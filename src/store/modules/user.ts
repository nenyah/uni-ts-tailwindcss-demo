import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators"
import store from "@/store"
import api from "@/api"
import { User } from "@/common/interface"
import { token } from "@/utils/token"

@Module({
  name: "user",
  dynamic: true,
  namespaced: true,
  store,
})
export default class UserStore extends VuexModule {
  public loginInfo: User = {
    token: "",
    openId: "",
    unionId: "",
    wasBuy: false,
  }

  @Mutation
  USERINFO(user: User): void {
    console.log(user)
    this.loginInfo = user
  }

  @Action
  async getUserinfo() {
    const [err, res]: any = await uni.login({
      provider: "weixin",
    })
    console.log("用户登录:::", res)
    const { openId, token: token1, unionId, wasBuy } = await api.user
      .wxMaLogin(res.code)
      .catch((err: any) => {
        console.log("获取用户信息错误", err)
      })
    token.set(token1)
    this.context.commit("USERINFO", {
      token: token1,
      openId,
      unionId,
      wasBuy,
    })
  }
}
// 使用getModule: 对类型安全的访问
export const UserStoreModule = getModule(UserStore)
