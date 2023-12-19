import Component from "../core/Component.js";
import PokemonItem from "./PokemonItem.js";

export default class Search extends Component {
  constructor($target, pokemon) {
    super($target, pokemon);
  }

  template() {
    return `
    <input
      type="text"
      class="searchBox"
      placeholder="포켓몬 이름을 입력해주세요!"
    />
    <img
      src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png"
    />
    `;
  }

  setEvent() {
    // 검색 버튼을 눌렀을 때
    this.addEvent("click", "img", (e) => {
      this.filter();
    });

    // 엔터 키를 눌렀을 때
    this.addEvent("keydown", "input", (e) => {
      const code = e.code;
      if (code === "Enter") {
        this.filter();
      }
    });
  }

  filter() {
    const searchValue = this.$target.querySelector("input").value.toLowerCase();

    if (searchValue === "") {
      location.reload();
      return;
    }

    const matchedData = this.$props.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchValue) ||
        pokemon.att.toLowerCase().includes(searchValue)
    );

    const $pokemonItemContainer = document.getElementById("pokemonItem");
    $pokemonItemContainer.innerHTML = "";

    if (matchedData.length === 0) {
      $pokemonItemContainer.innerHTML =
        '<p class="mt-3 text-center text-dark-emphasis fs-5 fw-bold">검색 결과가 없습니다.</p>';
    } else {
      matchedData.forEach((pokemon) => {
        const $pokemonItem = document.createElement("div");
        $pokemonItemContainer.appendChild($pokemonItem);
        new PokemonItem($pokemonItem, [pokemon]);
      });
    }

    const searchEvent = new CustomEvent("search", { detail: matchedData });
    this.$target.dispatchEvent(searchEvent);
  }
}
