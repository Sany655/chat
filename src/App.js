import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inbox from "./components/Inbox";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route to='/' element={<Inbox />} />
        <Route to='/login' element={<Login />} />
        <Route to='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
