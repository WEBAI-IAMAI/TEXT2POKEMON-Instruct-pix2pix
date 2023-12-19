import Component from "./core/Component.js";

export default class Router extends Component {
  setup() {
    this.$state = {
      routes: [],
    };
  }

  addRoute(fragment, component) {
    this.$state.routes.push({ fragment, component });
  }

  checkRoutes() {
    const currentRoute = this.$state.routes.find((route) => {
      return route.fragment === window.location.hash;
    });
    if (window.location.hash === "") {
      this.$state.routes[0].component();
      return;
    }
    if (!currentRoute) {
      window.location.href = "./#collect";
      return;
    }
    currentRoute.component();
  }

  start() {
    window.addEventListener("hashchange", () => this.checkRoutes());
    if (!window.location.hash) {
      window.location.hash = "#collect";
    }
    this.checkRoutes();
  }
}
