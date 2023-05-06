import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import  toast  from 'react-hot-toast'
import "../../styles/AuthStyles.css";
import { removeLocalAccessToken } from "../../services/TokenService";

const Register = () => {

  const [userState, setUserState] = useState({
    name: null,
    email: null,
    password: null,
    phone: null,
    address: null
  })

  const handleUserState = (event) => {
    setUserState(userState => ({ ...userState, [event.target.name]: event.target.value }))
  }

  const navigate = useNavigate();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('env variables',process.env.REACT_APP_API)
      const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`,{
          name: userState.name,
          email: userState.email,
          phone: userState.phone,
          address: userState.address,
          password: userState.password,
        },{
          headers : {
            "Content-Type" : "application/json"
          }
        },
       )

      if (response.data.success) {
        console.log(response)
        toast.success(response.data.data.message)
        navigate('/login')
      }
      else {
        console.log('error from server',response.data.error)
        localStorage.removeItem('auth')
        removeLocalAccessToken()
        throw new Error(response.data.error)
      }
    } catch (error) {
      console.log('err', error.response.data)
      toast.error(error.response.data.error);
    }
  };

  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container ">
        <form onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              defaultValue={userState.name}
              onChange={(e) => handleUserState(e)}
              className="form-control"
              id="exampleInputName"
              placeholder="Enter Your Name"
              required
              autoFocus
            />
          </div>
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
            <input
              type="number"
              name="phone"
              defaultValue={userState.phone}
              onChange={(e) => handleUserState(e)}
              className="form-control"
              id="exampleInputMobile"
              placeholder="Enter Your Phone"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="address"
              defaultValue={userState.address}
              onChange={(e) => handleUserState(e)}
              className="form-control"
              id="exampleInputAddress"
              placeholder="Enter Your Address"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
