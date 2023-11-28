import axios from '@axios'


class AuthUserApi {
  createUser = async data => {
    try{
      // const token = await apiAuthJWT.getTokenAndVerify()
      // if (!token) return null
          
      return await axios.post(
        `/`,
        data,

        // {
        //   headers: {
        //     'api-key-music': 'gIvRCn80.ZuiIqAqyTjgQp7WxmBfnwn2TN4har2Kb',
        //   },
        // },
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
}

const authUserApi = new AuthUserApi()

export default authUserApi
