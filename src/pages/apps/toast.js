import { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export const showToastSuccess = message => {
  const toast = useToast()

  toast.success(message  , {
    timeout: 2500,
    position: 'top-right',
    closeOnClick: false,
  })
}

export const showToastInfo = message => {
  const toast = useToast()
  
  toast.info(message  , {
    timeout: 2500,
    position: 'top-right',
    closeOnClick: false,
  })
}
  

export const showToastError = msg => {
  const toast = useToast()
  
  toast.error(msg, {
    timeout: 2500,
    position: 'top-right',
  })
}

export const showToastWarning = msg => {
  const toast = useToast()
  
  toast.warning(msg, {
    timeout: 2500,
    position: 'top-right',
  })
}

export const showToastErrorBoottom = mensaje => {
  const toast = useToast()
  
  toast.error(mensaje, {
    timeout: 2500,
    position: 'bottom-right',
  })
}
  