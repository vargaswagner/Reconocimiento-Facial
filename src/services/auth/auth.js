import ApiClass from '@/services/api'
import axios from '@axios'

class AuthenticationJWT extends ApiClass{
  tokenVerify = async token => {
    try {
      // https://app-music-ia-production.up.railway.app/api/auth/token/verify/
      await axios.post('/auth/token/verify/', {
        "token": token,
      })
      
      return true
    } catch(error) {
      return  false
    }
  }

  logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userData')
    window.location.href = '/login'
    
    return null
  }


  getTokenAndVerify = async () =>  {
    let accessToken = localStorage.getItem('accessToken')
    accessToken = accessToken ? JSON.parse(accessToken) : null
    try {
      
      if (accessToken==null) {
        return this.logout()
      }
    }catch (e) {

      return this.logout()
      
    }
    
    const verifiToken = await this.tokenVerify(accessToken)

    if (!verifiToken){

      return this.logout()
              
    }
    
    return accessToken
  }
  
  

}

const apiAuthJWT = new AuthenticationJWT()
export default apiAuthJWT
