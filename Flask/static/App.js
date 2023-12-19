import Router from "./Router.js";
import Component from "./core/Component.js";
import createPages from "./pages/index.js";

export default class App extends Component {
  template() {
    return `
    <main>
    
    </main>
    `;
  }

  mounted() {
    const $main = this.$target.querySelector("main");
    const pages = createPages($main);
    const id = Array.from({ length: 72 }, (_, index) =>
      index.toString().padStart(4, "0")
    );

    const router = new Router($main);
    router.addRoute("#collect", pages.collect);
    id.forEach((item) => router.addRoute(`#create/${item}`, pages.create));
    router.addRoute("#loading", pages.loading);
    router.addRoute("#result", pages.result);

    router.start();
  }
}
