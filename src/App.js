import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
export const API_URL='https://backend-smtp.onrender.com/'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
