import { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom'
import { instance } from '../services/api';
import { useAuth } from '../context/auth';
import { getLocalAccessToken } from '../services/TokenService';
import Spinner from '../components/Layout/Spinner';

const Private = () => {
  const location = useLocation();
  const [ok, setOk] = useState(false)
  const [auth, setAuth] = useAuth()

  useEffect(() => {
    const authCheck = async () => {
      const response = await instance.post('api/v1/auth/isUserAuthenticated')

      if (response?.data?.ok) {
        console.log(response)
        setOk(true)
      }
      else {
        setOk(false)
      }
    }
    const isToken = getLocalAccessToken()
    if (isToken) {
       authCheck()
    }
},[auth?.user])

  return (
     ok ? <Outlet/> : <Spinner path="/"/>
  )
}

export default Private