import { useSelector } from "react-redux";

function App() {
  const count = useSelector(store => store.call).count
  return (
    <div className="container">
      <h1>Hello world {count}</h1>
    </div>
  );
}

export default App;
