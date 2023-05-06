import axios from "axios";
import { getLocalAccessToken, setLocalAccessToken } from "./TokenService";
import Cookies from "js-cookie";

let isRetry = false;
export const instance = axios.create(
    {
        baseURL: `${process.env.REACT_APP_API}`,
        withCredentials : true
    }
)

instance.defaults.headers.common['Content-Type'] = ['application/json','multipart/form-data']

instance.interceptors.request.use(
    (config) => {
        console.log(isRetry)
        const token = getLocalAccessToken()
        if (token) {
            config.headers['x-access-token'] = token
            config.headers['Authorization'] = 'Bearer ' + token

        }
        return config
    },
    (err) => Promise.reject(err)
)

instance.interceptors.response.use((res) => {

    return res
},
async (err) => {
     const originalConfig = err.config;
     console.log(isRetry)
     if(originalConfig?.url !== '/api/v1/auth/login' && err.response){
        if( err.response.status === 401 && !isRetry){
            
           isRetry = true
            
            try{
              const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/refresh`,{
                headers : {
                    'Cookie' : Cookies.get('refreshToken')
                }
              },
              {
                withCredentials : true
              })
              console.log('err with originalConfig._retry true',response)
              setLocalAccessToken(response.data.accessToken)
              instance.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.accessToken
              instance.defaults.headers.common['x-access-token'] = response.data.accessToken

              isRetry = false;

              return instance(originalConfig)
            }
            catch(error){
              if(error.response && error.response.data){
                  console.log('rejecting the promise based on error.response.data')
                  return Promise.reject(error.response.data)
              }
              console.log('error',error)
              return Promise.reject(error)
            }
        }
    
            if (err.response.status === 403 && err.response.data) {
                return Promise.reject(err.response.data);
              }
            }
            isRetry = false;
            
            return Promise.reject(err);
          }
        
)