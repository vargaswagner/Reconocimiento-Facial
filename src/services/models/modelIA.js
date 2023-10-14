import ApiClass from '@/services/api'
import apiAuthJWT from '@/services/auth/auth'
import axios from '@axios'

const enpoint = 'ia_models'
class IAModelsApi extends ApiClass{
  getAll = async params => {
    try{
      const token = await apiAuthJWT.getTokenAndVerify()
      if (!token) return null
          
      return await axios.get(
        `${enpoint}/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params: params, 
        },
      )
    } catch(error){
      console.log('error API', error)
    }
        
  }

  getByID = async id => {
    try {
      let token = await apiAuthJWT.getTokenAndVerify()

      return await axios.get(
        `${enpoint}/${id}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
      )
    } catch(error){
      console.log('error API', error)
    }
  }

  post = async data => {
    try {
      const token = await apiAuthJWT.getTokenAndVerify()

      return await axios.post(
        `${enpoint}/`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
      )
    } catch(error){
      console.log('error API', error)
    }
  }

  delete = async id => {
    try {
      const token = await apiAuthJWT.getTokenAndVerify()

      return await axios.delete(
        `${enpoint}/${id}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
      )
    } catch(error){
      console.log('error API', error)
    }
  }

  put = async (id, data) => {
    try {
      const token = await apiAuthJWT.getTokenAndVerify()

      return await axios.put(
        `${enpoint}/${id}/`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
      )
    } catch(error){
      console.log('error API', error)
    }
  }

}

const iAModelsApi = new IAModelsApi()

export default iAModelsApi
