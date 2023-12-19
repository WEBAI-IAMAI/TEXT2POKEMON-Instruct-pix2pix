import Component from "../core/Component.js";

export default class ResultPage extends Component {
  template() {
    const name = sessionStorage.getItem("name")
      ? sessionStorage.getItem("name")
      : "";
    const id = sessionStorage.getItem("id");

    // 생성 이미지는 ../resut/result_{id}.jpg
    return `
      <div class="result py-5">
        <div class="completedImg">
          <img id="coloredImage" src='static/result/result_${id}.jpg' alt="생성된 이미지">
          <h1 id="pokemonName">${name}</h1>
          <button class="mt-2" id="homeBtn">Home</button>
        </div>
      </div>  
    `;
  }

  mounted() {
    //img download
    const coloredImage = document.querySelector("#coloredImage");

    coloredImage.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = coloredImage.src;
      a.download = "image.jpg";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    // go back home
    const backHome = document.querySelector("#homeBtn");
    backHome.addEventListener("click", () => {
      window.location.href = window.location.href.replace("result", "collect");
      sessionStorage.clear();
    });
  }
}
