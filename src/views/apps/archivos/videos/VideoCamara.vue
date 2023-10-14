

<template>
  <section>
    <div>
      <video
        ref="videoElement"
        autoplay
        style="max-width: 100%; max-height: 100%;"
        class="rounded"
        :style="{ display: videoStream ? 'block' : 'none' }"
      />
      <VBtn @click="startCameraWithBeforeUnload">
        Iniciar Cámara
      </VBtn>
      <VBtn
        v-if="recording"
        @click="stopRecording"
      >
        Detener Grabación
      </VBtn>
      <VBtn
        v-if="videoStream && !recording"
        @click="startRecording"
      >
        Iniciar Grabación
      </VBtn>
      <div v-if="recording">
        <p>Grabando...</p>
        <p>Tiempo restante: {{ remainingTime }} segundos</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onBeforeUnmount, watchEffect } from 'vue'
import videoDetectionsApi from '@/services/models/videoDetections'


const props = defineProps({
  selectedModel: {
    type: Object,
    required: false,
  },
})

const emit = defineEmits([
  'update:isDrawerOpenDialog',
  'videoDataCamara',
])

const videoElement = ref(null)
const videoStream = ref(null)
const mediaRecorder = ref(null)
const recordedChunks = ref([])
const recordedBlob = ref(null)
const recording = ref(false)
const remainingTime = ref(10)

const loadingSaveVideoDetection = ref(false)

const startCameraWithBeforeUnload = async () => {
  startCamera()
  window.addEventListener('beforeunload', handleBeforeUnload)
}

const startRecording = () => {
  recordedChunks.value = []
  mediaRecorder.value = new MediaRecorder(videoStream.value, { mimeType: 'video/webm' })

  mediaRecorder.value.ondataavailable = event => {
    if (event.data.size > 0) {
      recordedChunks.value.push(event.data)
    }
  }

  mediaRecorder.value.onstop = () => {
    // Crea un Blob personalizado con sus propios valores
    const name = 'grabacion_personalizada.webm'
    const type = 'video/webm'

    recordedBlob.value = new Blob(recordedChunks.value, { type })

    // Agregar un campo "name" personalizado al Blob
    recordedBlob.value.name = name

    // Imprime el Blob en la consola
    console.log('Blob grabado:', recordedBlob.value)

    // También puedes acceder a la URL del Blob y mostrarla en la consola
    const blobURL = URL.createObjectURL(recordedBlob.value)

    console.log('URL del Blob:', blobURL)
    if (recordedBlob.value) {
      const file = new File([recordedBlob.value], 'grabacion.webm', {
        type: 'video/webm',
      })

      emit('videoDataCamara', file)
    }
  }

  mediaRecorder.value.start()
  recording.value = true

  // Iniciar el temporizador para detener la grabación después de 10 segundos
  const timer = setInterval(() => {
    remainingTime.value--
    if (remainingTime.value === 0) {
      stopRecording()
      clearInterval(timer)
    }
  }, 1000)
}

const stopRecording = () => {
  if (mediaRecorder.value && recording.value) {
    mediaRecorder.value.stop()
    recording.value = false
    
  }
}

const startCamera = async () => {
  try {
    videoStream.value = await navigator.mediaDevices.getUserMedia({ video: true })
    videoElement.value.srcObject = videoStream.value
  } catch (error) {
    console.error('Error al acceder a la cámara: ', error)
  }
}

const stopCamera = () => {
  if (videoStream.value) {
    videoStream.value.getTracks().forEach(track => track.stop())
    videoElement.value.srcObject = null
  }
}

onBeforeUnmount(() => {
  stopCamera() // Detener la cámara cuando el componente se desmonta (página web se cierra)
})

// Función para manejar el evento beforeunload
const handleBeforeUnload = () => {
  stopCamera() // Detener la cámara antes de que la página se cierre
}

// Función para detener la cámara y eliminar el oyente de evento beforeunload
const stopCameraWithBeforeUnload = () => {
  stopCamera()
  window.removeEventListener('beforeunload', handleBeforeUnload)
}
</script>
