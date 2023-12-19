import Component from "../core/Component.js";

export default class PokemonItem extends Component {
  constructor($target, pokemon) {
    super($target, pokemon);
  }

  template() {
    const pokemonItems = this.$props.map(({ id, name, att }) => {
      return `
        <div class="PokemonItem" data-id="${id}">
          <a class="d-flex align-items-center position-relative">
            <img src="static/image/testB/${id}.jpg" />
            <img src="static/image/testA/${id}.jpg" />
            <div class="textContainer ms-5">
              <p>이름: ${name}</p>
              <p> 속성: ${att}</p>
            </div>
          </a>
        </div>
      `;
    });

    return pokemonItems.join("");
  }

  mounted() {
    // 스크롤 내려감 방지
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }

    this.$target.querySelectorAll(".PokemonItem").forEach((item, index) => {
      const id = this.$props[index].id;
      item.addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState(
          {
            data: this.$props[index],
          },
          null,
          `#create/${id}`
        );
        history.go(0);
      });
    });
  }
}
