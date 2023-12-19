import CollectPage from "./CollectPage.js";
import CreatePage from "./CreatePage.js";
import LoadingPage from "./LoadingPage.js";
import ResultPage from "./ResultPage.js";

export default (main) => {
  const collect = () => new CollectPage(main);
  const create = () => new CreatePage(main);
  const loading = () => new LoadingPage(main);
  const result = () => new ResultPage(main);

  return {
    collect,
    create,
    loading,
    result,
  };
};
