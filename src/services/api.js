import axios from '@axios'
import apiAuthJWT from './auth/auth'


export default class ApiClass {
  getAllURI = async uri => {
    try{
      const token = await apiAuthJWT.getTokenAndVerify()
      if(!token) return null    

      return await axios.get(uri, {
        'headers': {
          'Authorization': `Bearer ${token}`,
        },
      })

    } catch(error) {
      console.log('error en la API', error)
    }
  }

}
