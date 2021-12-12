import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Buefy from "buefy";
import axios from "axios";
import VueAxios from "vue-axios";
import "buefy/dist/buefy.css";
import VueSweetalert2 from "vue-sweetalert2";
import "@sweetalert2/theme-bulma";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faUser,
  faEdit,
  faCogs,
  faSignOutAlt,
  faDownload,
  faChevronDown,
  faChartPie,
  faArrowUp,
  faSquare,
  faCheck,
  faPlus,
  faBell,
  faSearch,
  faFileUpload,
  faSignInAlt,
  faFileDownload,
  faInfo,
  faAngleLeft,
  faAngleRight,
  faExclamationCircle,
  faTrash,
  faPaperPlane,
  faEye,
  faEyeSlash,
  faMinus,
  faEnvelope,
  faFile,
  faVoteYea,
  faInbox,
  faFileAlt,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ModuleApi from "./mixins/ModuleApi";
import ModuleElectionApi from "./mixins/ModuleElectionApi";
import MailTemplateApi from "./mixins/MailTemplateApi";
import StudentApi from "./mixins/StudentApi";
require("@/assets/main.scss");

library.add(
  faHome,
  faUser,
  faEdit,
  faCogs,
  faSignOutAlt,
  faDownload,
  faChevronDown,
  faChartPie,
  faArrowUp,
  faSquare,
  faCheck,
  faPlus,
  faBell,
  faSearch,
  faFileUpload,
  faSignInAlt,
  faFileDownload,
  faInfo,
  faAngleLeft,
  faAngleRight,
  faExclamationCircle,
  faTrash,
  faPaperPlane,
  faEye,
  faEyeSlash,
  faMinus,
  faEnvelope,
  faFile,
  faVoteYea,
  faInbox,
  faFileAlt,
  faChevronRight
);

Vue.component("vue-fontawesome", FontAwesomeIcon);
Vue.config.productionTip = false;
Vue.use(Buefy, {
  defaultIconComponent: "vue-fontawesome",
  defaultIconPack: "fas",
});

axios.defaults.baseURL = "/api";

Vue.use(VueAxios, axios);
Vue.use(VueSweetalert2);
Vue.mixin(ModuleApi);
Vue.mixin(ModuleElectionApi);
Vue.mixin(MailTemplateApi);
Vue.mixin(StudentApi);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
