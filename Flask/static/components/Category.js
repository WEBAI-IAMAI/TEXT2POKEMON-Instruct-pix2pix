import Component from "../core/Component.js";

export default class Category extends Component {
  setup() {
    this.$state = {
      selectedCategory: null,
    };
  }

  template() {
    const categories = [
      "전체",
      "불",
      "물",
      "풀",
      "독",
      "벌레",
      "비행",
      "드래곤",
      "악",
      "전기",
      "얼음",
      "땅",
      "강철",
      "페어리",
      "격투",
      "바위",
      "에스퍼",
      "고스트",
      "노말",
    ];

    const buttons = categories.map((category, index) => {
      const button = `<button id="btn${index}">${category}</button>`;
      const lineBreak = (index + 1) % 5 === 0 ? "<br />" : "";
      return button + lineBreak;
    });

    return `
    <p>Category</p>
    <div class="att-button">
      ${buttons.join("")}
    </div>
  `;
  }

  setEvent() {
    this.addEvent("click", ".att-button > button", ({ target }) => {
      const category = target.textContent;
      this.$state.selectedCategory = category;

      if (category === "전체") {
        location.reload();
        return;
      }

      const filteredPokemons = this.getFilteredPokemons(this.$props);

      const $pokemonItemContainer = document.getElementById("pokemonItem");
      $pokemonItemContainer.innerHTML = "";

      if (filteredPokemons.length === 0) {
        $pokemonItemContainer.innerHTML = `<p class="mt-3 text-center text-dark-emphasis fs-5 fw-bold">${category} 카테고리에 해당하는 포켓몬이 없습니다.</p>`;
      }

      const notifyEvent = new CustomEvent("notify", {
        detail: filteredPokemons,
      });
      this.$target.dispatchEvent(notifyEvent);
    });
  }

  getFilteredPokemons = (pokemons) => {
    if (this.$state.selectedCategory == null) {
      return pokemons;
    }
    return pokemons.filter((pokemon) =>
      pokemon.att.includes(this.$state.selectedCategory)
    );
  };
}
