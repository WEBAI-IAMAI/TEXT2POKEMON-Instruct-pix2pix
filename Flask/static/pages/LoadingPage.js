import Component from "../core/Component.js";

export default class LoadingPage extends Component {
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
    const interval = 5000; // 0.5초 간격으로 GET 요청 보내기

    const checkLoading = async () => {
      try {
        const response = await fetch("/submit");
        const data = await response.json();
        this.$state.loading = data.loading;
        if (!this.$state.loading) {
          clearInterval(pollingInterval); // loading 상태가 바뀌었다면 멈추고 result로 이동
          window.location.href = window.location.href.replace(
            "loading",
            "result"
          );
        }
      } catch (error) {
        console.error("Failed to fetch loading state:", error);
      }
    };

    const pollingInterval = setInterval(checkLoading, interval);
  }
}
