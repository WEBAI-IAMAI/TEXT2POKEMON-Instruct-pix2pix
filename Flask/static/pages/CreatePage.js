import Component from "../core/Component.js";
import ColorText from "../components/ColorText.js";

export default class CreatePage extends Component {
  setup() {
    this.$state = {
      imageId: history.state.data.id,
      pokemonName: "",
    };
  }

  template() {
    return `
      <div class="create">
        <header class="createHeader">
          <h1>Coloring your pokemon</h1>
        </header>
        <main class="createContainer">
          <div class="content w-100 p-4 text-center">
            <div class="writeName p-3 rounded-5">
              <label for="name">Name : </label>
              <input type="text" id="name" name="name" placeholder="나의 포켓몬 이름"/>
            </div>
            <div class="drawing p-4">
              <img class="w-75 h-100" src='static/image/testA/${this.$state.imageId}.jpg'>
              <div class="py-4" id="colorText"></div>
            </div>
          </div>
        </main>
      </div>  
    `;
  }

  mounted() {
    const nameBox = document.getElementById("name");

    nameBox.addEventListener("blur", (event) => {
      this.$state.pokemonName = event.target.value;
      sessionStorage.setItem("name", this.$state.pokemonName);
    });

    sessionStorage.setItem("id", this.$state.imageId);

    const $colorText = this.$target.querySelector("#colorText");
    new ColorText($colorText, this.$state);
  }
}
