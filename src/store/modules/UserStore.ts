import Vue from "vue";

import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import User from "@/models/user";
import store from "@/store";

@Module({ store, dynamic: true, name: "userStore" })
export default class UserStore extends VuexModule {
  private user: User = <User>{};
  private isAuthenticated = false;
  private isStoreInitialized = false;

  @Mutation
  async fetchUserDataAsync(): Promise<void> {
    try {
      const resp = await Vue.axios.get<User>("../session/info");
      if (resp.status === 200) {
        this.user = resp.data;
        this.isAuthenticated = true;
        this.isStoreInitialized = true;
      }
    } catch (e) {
      if (Vue.axios.isAxiosError(e) && e.response) {
        const status = e.response.status;
        if (status !== 401 && status !== 403) {
          Vue.swal({
            title: "Fehler bei der Anfrage",
            text: "Bei der Anfrage nach dem Status ist etwas schiefgelaufen",
            icon: "error",
          });
        }
      } else {
        console.error(e);
      }
    }
  }

  @Mutation
  removeUserData(): void {
    this.user = <User>{};
    this.isAuthenticated = false;
    this.isStoreInitialized = false;
  }

  @Action({ commit: "fetchUserDataAsync" })
  fetchUserData(): boolean {
    return this.isAuthenticated;
  }

  get isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  get isUserAdmin(): boolean {
    return this.user.role === "ADMIN";
  }

  get isUserInitialized(): boolean {
    return this.isStoreInitialized;
  }
}
