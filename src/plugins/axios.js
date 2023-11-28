import axios from 'axios'


// const uriHTTPS = 'https://app-facial-recognition-production-e81a.up.railway.app/api/'

// const uriHTTP = 'http://localhost:8004'

const uriHTTPS = 'http://localhost:8000/api' 


// http://172.30.48.1:8004/docs
const axiosIns = axios.create({
// You can add your headers here
// ================================
  // baseURL: 'http://127.0.0.1:8000/v1/api/',
  baseURL: `${uriHTTPS}`,
  
  // timeout: 1000, 
})

axiosIns.interceptors.request.use(request => {
  console.log("----------------------")
  let url_method = request.url
  if (url_method.substring(0, 1).includes("/"))
    url_method = `${request.method}: ${request.baseURL}${url_method}`
  else
    url_method = `${request.method}: ${request.baseURL}/${url_method}`


  console.log("Send: ", url_method)
  
  return request
})


axiosIns.interceptors.response.use(response => {
  // let dataStr = JSON.stringify(response.data)
  // dataStr = dataStr.replaceAll(uriHTTP, uriHTTPS)
  // response.data = JSON.parse(dataStr || '{}')
  let url_method = response.config.url
  if (url_method.substring(0, 1).includes("/"))
    url_method = `${response.config.method}: ${response.config.baseURL}${response.config.url}`
  else
    url_method = `${response.config.method} ${response.status}: ${response.config.baseURL}/${response.config.url}`

  // console.log("Resp: ", url_method)
  // console.log(JSON.stringify(response.data))
  // console.log("-------------------")
  
  return response
})
export default axiosIns
