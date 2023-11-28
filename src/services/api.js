import { showToastError, showToastInfo, showToastSuccess, showToastWarning } from '@/pages/apps/toast'
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

  showErrorMessage (response, modelName) {
    let messageError = ""

    // Error body __all__
    if (response.status == 422 && Array.isArray(response.data.detail)){
      let errors_fields = response.data.detail.filter( field_err => field_err.loc[0]=="body")
      const map_fields = new Map()

      errors_fields = errors_fields.forEach(field => map_fields.set(field.loc[1], [field.msg]))

      for (const [field_name, msg] of map_fields) {
        if (field_name == "__all__") {
          messageError = msg[0]
          showToastError(messageError)
          
          return
        }
        
        return
      }
    
      // return 
    }

    if (response.status == 400) {

      Object.keys(response.data).forEach(function(propiedad) {
        messageError =  '👉 ' + response.data[propiedad]

        // showToastError(messageError)
        // console.log('kjsajaks')
      })
      
    }

    // Error con detail
    // if (response){
    //   // Others errors string message
    //   if (typeof response.data === 'string'){
    //     messageError = `${modelName}: ${response.config.method}, Cod: ${response.status} - ${response.data.detail}`
    //   } else {
    //     messageError = `${modelName}: ${response.config.method}, Cod: ${response.status} - Error al procesar información`
    //   }
    // } else {
    //   messageError = `${modelName}: Error desconocido`
    // }
    showToastError(messageError)
  }

  showCreateMessage (modelName) {
    let message = `${modelName}: Creado correctamente`
    showToastSuccess(message)
  }

  showUpdateMessage (modelName) {
    let message = `${modelName}: Actualizado correctamente`
    showToastSuccess(message)
  }

  showDeleteMessage (modelName) {
    let message = `${modelName}: Eliminado correctamente`
    showToastWarning(message)
  }

  showReadMessage (modelName) { // Esto es opcional, usar si se requiere
    let message = `${modelName}: Datos cargados correctamente`
    showToastSuccess(message)
  }

  showSuccessMessage (modelName) { // Esto es opcional, usar si se requiere
    showToastInfo(modelName)
  }

  showWarningMessage (modelName) { // Esto es opcional, usar si se requiere
    showToastWarning(modelName)
  }

}
