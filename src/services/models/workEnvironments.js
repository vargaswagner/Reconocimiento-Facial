import ApiClass from '@/services/api'
import apiAuthJWT from '@/services/auth/auth'
import axios from '@axios'

const enpoint = 'work_environments'
const modelName = 'Entorno de trabajo'
class WorkEnvironmentsApi extends ApiClass{
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
      if (error) {
        super.showErrorMessage(error.response, modelName)
        throw error 
      } else {
        super.showErrorMessage(null, modelName)
      }
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
      if (error) {
        super.showErrorMessage(error.response, modelName)
        throw error 
      } else {
        super.showErrorMessage(null, modelName)
      }
    }
  }

  post = async data => {
    try {
      const token = await apiAuthJWT.getTokenAndVerify()

      const response = await axios.post(
        `${enpoint}/`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
      )

      super.showCreateMessage(modelName)
      
      return response
    } catch(error){
      if (error) {
        super.showErrorMessage(error.response, modelName)
        throw error 
      } else {
        super.showErrorMessage(null, modelName)
      }
    }
  }

  delete = async id => {
    try {
      const token = await apiAuthJWT.getTokenAndVerify()

      const response = await axios.delete(
        `${enpoint}/${id}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
      )

      super.showDeleteMessage(modelName)
      
      return response
    } catch(error){
      if (error) {
        super.showErrorMessage(error.response, modelName)
        throw error 
      } else {
        super.showErrorMessage(null, modelName)
      }
    }
  }

  put = async (id, data) => {
    try {
      const token = await apiAuthJWT.getTokenAndVerify()

      const response = await axios.put(
        `${enpoint}/${id}/`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
      )

      super.showUpdateMessage(modelName)
      
      return response
    } catch(error){
      if (error) {
        super.showErrorMessage(error.response, modelName)
        throw error 
      } else {
        super.showErrorMessage(null, modelName)
      }
    }
  }

}

const workEnvironmentsApi = new WorkEnvironmentsApi()

export default workEnvironmentsApi
