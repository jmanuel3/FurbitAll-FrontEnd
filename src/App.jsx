import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reservas from "./pages/Reservas";
import ProductDetail from "./pages/Producto/ProductDetail";
import Cart from "./pages/Cart";
import Gracias from "./pages/Gracias";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Error404 from "./pages/Error404";
import SobreNosotros from "./pages/SobreNosotros";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
     
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
  
        <Route path="/login" element={<Login />} />
        <Route path="/gracias" element={<Gracias />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/reservas"
          element={
            <PrivateRoute>
              <Reservas />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="admin">
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
