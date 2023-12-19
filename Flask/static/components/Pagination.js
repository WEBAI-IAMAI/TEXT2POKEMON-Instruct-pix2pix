import pokemons from "../image/pokemons.js";
import Component from "../core/Component.js";

export default class Pagination extends Component {
  setup() {
    this.$state = {
      currentPage: this.$props.currentPage,
      itemsPerPage: 5,
      totalItems: this.$props.totalItems,
    };
  }

  template() {
    return `
      <button class="pagination-button" id="prev-button" aria-label="Previous page" title="Previous page">&lt;</button>
      <div id="pagination-numbers"></div>
      <button class="pagination-button" id="next-button" aria-label="Next page" title="Next page">&gt;</button>
    `;
  }
  mounted() {
    const paginationNumbers = this.$target.querySelector("#pagination-numbers");
    const prevButton = this.$target.querySelector("#prev-button");
    const nextButton = this.$target.querySelector("#next-button");

    prevButton.addEventListener("click", () => {
      const newPage = this.$state.currentPage - 1;
      if (newPage >= 1) {
        this.changePage(newPage);
      }
    });

    nextButton.addEventListener("click", () => {
      const pageCount = this.calculatePageCount();
      const newPage = this.$state.currentPage + 1;
      if (newPage <= pageCount) {
        this.changePage(newPage);
      }
    });

    paginationNumbers.addEventListener("click", (e) => {
      if (e.target.classList.contains("pagination-number")) {
        const pageNumber = parseInt(e.target.textContent, 10);
        this.changePage(pageNumber);
      }
    });
  }

  updatePaginationNumbers() {
    const paginationNumbers = this.$target.querySelector("#pagination-numbers");
    paginationNumbers.innerHTML = "";
    const pageCount = this.calculatePageCount();

    let startPage = Math.max(this.$state.currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, pageCount);

    if (this.$state.currentPage - 2 < 1) {
      endPage = Math.min(5, pageCount);
    }

    if (this.$state.currentPage + 2 > pageCount) {
      startPage = Math.max(pageCount - 4, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageNumber = document.createElement("button");
      pageNumber.classList.add("pagination-number");

      if (i === this.$state.currentPage) {
        const pokemonBallImage = document.createElement("img");
        pokemonBallImage.src = "static/img/pokeball.png";
        pokemonBallImage.alt = `Page ${i}`;
        pokemonBallImage.width = 30;
        pokemonBallImage.height = 30;
        pageNumber.appendChild(pokemonBallImage);
      } else {
        pageNumber.textContent = i;
      }
      paginationNumbers.appendChild(pageNumber);
    }

    this.updatePageButtons();
  }

  calculatePageCount() {
    return Math.ceil(this.$state.totalItems / this.$state.itemsPerPage);
  }

  changePage(newPage) {
    const pageCount = this.calculatePageCount();

    if (newPage < 1) {
      newPage = 1;
    } else if (newPage > pageCount) {
      newPage = pageCount;
    }

    this.$state.currentPage = newPage;
    this.updatePageButtons();
    this.updatePaginationNumbers();

    const notifyEvent = new CustomEvent("notify", { detail: newPage });
    this.$target.dispatchEvent(notifyEvent);
  }

  updatePageButtons() {
    const $prevButton = this.$target.querySelector("#prev-button");
    const $nextButton = this.$target.querySelector("#next-button");
    $prevButton.disabled = this.$state.currentPage === 1;
    $nextButton.disabled =
      this.$state.currentPage === this.calculatePageCount();
  }

  getCurrentPage() {
    return this.$state.currentPage;
  }

  // 총 아이템 수와 현재 페이지를 설정하는 메서드
  setTotalItemsAndPage(totalItems, currentPage = 1) {
    this.$state.totalItems = totalItems;
    this.$state.currentPage = currentPage;
    this.updatePaginationNumbers();
  }
}
