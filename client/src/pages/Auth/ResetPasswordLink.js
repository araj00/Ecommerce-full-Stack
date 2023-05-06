import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";

import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ResetPasswordLink = () => {
    
    const navigate = useNavigate()
    const [email,setEmail] = useState('')

     // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/passwordResetLink`, {
        email
      },
      );
      if (response && response.data.success) {
        console.log(response)
        toast.success(response.data.message)
        navigate("/login");
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
          <h4 className="title">RESET PASSWORD</h4>

          
          <div className="mb-3">
            <input
              type="email"
              name="email"
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail"
              placeholder="Enter Your Email "
              required
            />
          </div>

          
          <button type="submit" className="btn btn-primary">
            RESET
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ResetPasswordLink;
