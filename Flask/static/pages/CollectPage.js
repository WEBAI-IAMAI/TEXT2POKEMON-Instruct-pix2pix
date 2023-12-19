import Component from "../core/Component.js";
import pokemons from "../image/pokemons.js";
import Search from "../components/Search.js";
import Category from "../components/Category.js";
import PokemonItem from "../components/PokemonItem.js";
import Pagination from "../components/Pagination.js";

export default class CollectPage extends Component {
  setup() {
    this.$state = {
      pokemons,
      currentPage: 1,
      filteredPokemons: pokemons,
    };
    this.paginationComponent = null;
  }

  template() {
    return `
      <header class="collectHeader text-center w-100 h-100 pb-2 position-relative">
        <h1 class="m-0 pt-4 position-relative">Make Your Pokemon</h1>
        <div id="search"></div>
        <div id="category"></div>
      </header>
      <main class="pokemon-list p-5 position-relative">
        <div id="pokemonItem"></div>
      </main>
      <div id="pagination"></div>
      `;
  }

  mounted() {
    const $search = this.$target.querySelector("#search");
    const $category = this.$target.querySelector("#category");
    const $pokemonItem = this.$target.querySelector("#pokemonItem");
    const $pagination = this.$target.querySelector("#pagination");

    const searchComponent = new Search($search, this.$state.pokemons);
    const categoryComponent = new Category($category, this.$state.pokemons);
    const pokemonItemComponent = new PokemonItem(
      $pokemonItem,
      this.$state.pokemons
    );

    // pagination
    this.paginationComponent = new Pagination($pagination, {
      totalItems: this.$state.pokemons.length,
      currentPage: this.$state.currentPage,
    });
    this.paginationComponent.setTotalItemsAndPage(this.$state.pokemons.length);

    $pagination.addEventListener("notify", (event) => {
      const newPage = event.detail;
      this.changePage(newPage);
    });

    // category
    $category.addEventListener("notify", (event) => {
      const categoriedPokemons = event.detail;
      this.$state.filteredPokemons = categoriedPokemons;
      this.$state.currentPage = 1;
      if (categoriedPokemons.length === 0) {
        this.paginationComponent.setTotalItemsAndPage(1);
      } else {
        this.paginationComponent.setTotalItemsAndPage(
          categoriedPokemons.length
        );
      }
      this.renderPokemonList(categoriedPokemons);
    });

    // search
    $search.addEventListener("search", (event) => {
      const searchedPokemons = event.detail;
      this.$state.filteredPokemons = searchedPokemons;
      this.$state.currentPage = 1;
      if (searchedPokemons.length === 0) {
        this.paginationComponent.setTotalItemsAndPage(1);
      } else {
        this.paginationComponent.setTotalItemsAndPage(searchedPokemons.length);
      }
      this.renderPokemonList(searchedPokemons);
    });

    this.renderPokemonList(this.$state.pokemons);
  }

  renderPokemonList(pokemons) {
    const currentPage = this.$state.currentPage;
    const itemsPerPage = 5;

    // 현재 페이지에 해당하는 데이터만 추출
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pokemonsToShow = pokemons.slice(startIndex, endIndex);

    if (pokemonsToShow.length === 0) {
      return;
    }

    // PokemonItem 컴포넌트의 포켓몬 데이터를 업데이트하고 다시 렌더링
    this.$target.querySelector("#pokemonItem").innerHTML = "";
    const pokemonItemComponent = new PokemonItem(
      this.$target.querySelector("#pokemonItem"),
      pokemonsToShow
    );
  }

  changePage(newPage) {
    this.$state.currentPage = newPage;
    this.renderPokemonList(this.$state.filteredPokemons);
  }
}
