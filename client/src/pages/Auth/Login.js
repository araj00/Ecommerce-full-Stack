import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { instance } from "../../services/api";
import { useAuth } from "../../context/auth";
import { setLocalAccessToken } from "../../services/TokenService";

const Login = () => {
 
  const [auth,setAuth] = useAuth()
  const navigate = useNavigate();

  const [userState, setUserState] = useState({
    email: null,
    password: null,
   
  })

  const handleUserState = (event) => {
    setUserState(userState => ({ ...userState, [event.target.name]: event.target.value }))
  }

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post("/api/v1/auth/login", {
        email : userState.email,
        password : userState.password,
      },
      {withCredentials : true});
      if (response && response.data.success) {
        console.log(response)
        localStorage.setItem('auth',JSON.stringify(response.data.user))
        setLocalAccessToken(response.data.accessToken)
        setAuth({...auth,user : response.data.user})
        toast.success(response.data.message)
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container ">
        <form onSubmit={handleSubmit}>
          <h4 className="title">LOGIN FORM</h4>

          
          <div className="mb-3">
            <input
              type="email"
              name="email"
              defaultValue={userState.email}
              onChange={(e) => handleUserState(e)}
              className="form-control"
              id="exampleInputEmail"
              placeholder="Enter Your Email "
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              defaultValue={userState.password}
              onChange={(e) => handleUserState(e)}
              className="form-control"
              id="exampleInputPassword"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                navigate("/reset-password");
              }}
            >
              Forgot Password
            </button>
          </div>
          <button type="submit" className="btn btn-primary">
            LOGIN
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
