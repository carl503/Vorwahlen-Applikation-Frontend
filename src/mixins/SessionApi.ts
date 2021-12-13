import { Component, Vue } from "vue-property-decorator";
import Api from "./Api";
import User from "@/models/user";
import ErrorHandler from "@/decorators/ErrorHandler";

@Component
export default class SessionApi extends Api<User> {
  get $sessionApi(): SessionApi {
    this.basePath = "/session";
    return this;
  }

  @ErrorHandler()
  async get(): Promise<User> {
    return (await Vue.axios.get<User>(this.basePath)).data;
  }

  @ErrorHandler()
  async isAuthenticated(): Promise<boolean> {
    return (await Vue.axios.get<boolean>(`${this.basePath}/is-authenticated`))
      .data;
  }
}