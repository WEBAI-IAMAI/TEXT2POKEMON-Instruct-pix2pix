import Component from "../core/Component.js";

export default class LoadingPage extends Component {
  pollingInterval = 5000;
  pollingIntervalId = null;

  setup() {
    this.$state = {
      loading: true,
    };
  }

  template() {
    return `
      <div class="loading">
        <h2>포켓몬 생성중 ...</h2>
        <img src="static/img/pokeball.png" />
      </div>  
    `;
  }

  mounted() {
    this.pollLoadingState();
  }

  async pollLoadingState() {
    const checkLoading = async () => {
      try {
        const response = await fetch("/");
        const data = await response.json();
        this.$state.loading = data.loading;
        if (!this.$state.loading) {
          clearTimeout(this.pollingTimeoutId); // loading 상태가 바뀌었다면 타이머를 해제하고 result로 이동
          window.location.href = window.location.href.replace(
            "loading",
            "result"
          );
        } else {
          this.pollingTimeoutId = setTimeout(
            checkLoading,
            this.pollingInterval
          );
        }
      } catch (error) {
        alert(
          "요청이 실패하였습니다. 이전 페이지로 돌아가서 다시 시도해 주세요."
        );
      }
    };
    this.pollingTimeoutId = setTimeout(checkLoading, this.pollingInterval);
  }

  unmounted() {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
    }
  }
}
