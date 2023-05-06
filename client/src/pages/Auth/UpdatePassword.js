import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'

const UpdatePassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
   

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async(event) => {
    event.preventDefault(); 
    
    try {
      if(password !== confirmPassword){
        throw new Error('not confirmed password')
      }
      const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/resetPassword${location.search}`,{newPassword : password},
      {withCredentials : true});
        if (response && response.data.success) {
          console.log(response)
          toast.success(response.data.message)
          navigate("/login");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
  };

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Layout title="Register - Ecommer App">
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className='form-control'
              value={password}
              onChange={handlePasswordChange}
              placeholder='Enter Your Reset Password'
              required
            />

            <button type="button" onClick={handleShowPasswordToggle}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className='mb-3'>
            
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirm-password"
              value={confirmPassword}
              className='form-control'
              onChange={handleConfirmPasswordChange}
              placeholder='Confirm Password'
              required
            />
          </div>
          <button type="submit">Update Password</button>
        </form>
      </div>

    </Layout>

  );
};

export default UpdatePassword;