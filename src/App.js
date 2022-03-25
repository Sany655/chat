import { Provider } from "react-redux";
import ReactRoutes from "./ReactRoutes";
import store from "./redux/Reducers";

function App() {
  return (
    <Provider store={store}>
      <ReactRoutes />
    </Provider>
  );
}

export default App;
