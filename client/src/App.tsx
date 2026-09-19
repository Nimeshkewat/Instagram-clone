import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
