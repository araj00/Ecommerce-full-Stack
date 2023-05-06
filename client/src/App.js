import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import 'react-toastify/dist/ReactToastify.css';
import Private from "./Routes/Private";
import Dashboard from "./pages/User/Dashboard";
import ResetPasswordLink from "./pages/Auth/ResetPasswordLink";
import UpdatePassword from "./pages/Auth/UpdatePassword";
import AdminRoute from "./Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/User/Orders";
import Profile from "./pages/User/Profile";
import 'antd/dist/reset.css';
import Product from "./pages/Admin/Product";
import UpdateProduct from "./pages/Admin/UpdateProduct";


function App() {
  return (
    <>
      <Routes>
      <Route path = "/dashboard" element={<Private/>}>
          <Route path="user" element = {<Dashboard/>}/>
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profile />} />
        </Route>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        
        <Route path = "/dashboard" element={<AdminRoute/>}>
          <Route path="admin" element = {<AdminDashboard/>}/>
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/product/:slug" element={<UpdateProduct/>} />
          <Route path="admin/products" element={<Product/>} />
          <Route path="admin/users" element={<Users />} />
        </Route>
        <Route path="/passwordReset" element={<UpdatePassword/>}/>
        <Route path="/reset-password" element={<ResetPasswordLink />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
