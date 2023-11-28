
<script setup>
import { ref, onBeforeUnmount, watchEffect } from 'vue'
import videoDetectionsApi from '@/services/models/videoDetections'


const props = defineProps({
  selectedModel: {
    type: Object,
    required: false,
  },
  loadingSaveVideoDetection: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpenDialog',
  'videoDataCamara',
])

const statusCamera = ref(true)
const statusVideoRecording = ref(true)
const videoElement = ref(null)
const videoStream = ref(null)
const mediaRecorder = ref(null)
const recordedChunks = ref([])
const recordedBlob = ref(null)
const recording = ref(false)
const remainingTime = ref(10)
const recordingTimer = ref(null)
const name = ref()

// const loadingSaveVideoDetection = ref(false)

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
    // const name = 'grabacion_personalizada.webm'
    // const type = 'video/webm'

    recordedBlob.value = new Blob(recordedChunks.value)

    // recordedBlob.value.name = name

    // Restablecer remainingTime al valor inicial
    remainingTime.value = 10

    // const blobURL = URL.createObjectURL(recordedBlob.value)

    if (recordedBlob.value) {
      const file = new File([recordedBlob.value], `${name?.value || 'grabacion'}.webm`, {
        type: 'video/webm',
      })

      emit('videoDataCamara', file)
    }
  }

  // Detener cualquier temporizador existente
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value)
  }

  remainingTime.value = 10 // Reiniciar remainingTime al valor inicial
  mediaRecorder.value.start()
  recording.value = true

  // Iniciar el nuevo temporizador
  recordingTimer.value = setInterval(() => {
    remainingTime.value--
    if (remainingTime.value === 0) {
      stopRecording()
      clearInterval(recordingTimer.value)
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
    statusCamera.value = false
  } catch (error) {
    console.error('Error al acceder a la cámara: ', error)
  }
}

const stopCamera = () => {
  if (videoStream.value) {
    videoStream.value.getTracks().forEach(track => track.stop())
    videoElement.value.srcObject = null
    statusCamera.value = true
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

<template>
  <section>
    <div>
      <video
        ref="videoElement"
        autoplay
        style="max-width: 100%; max-height: 100%;"
        class="rounded"
        :style="{ display: videoStream && !statusCamera ? 'block' : 'none' }"
      />
      <div class="mt-2">
        <VBtn
          v-if="statusCamera"
          icon
          color="success"
          size="43"
          @click="startCameraWithBeforeUnload"
        >
          <VIcon icon="tabler-video" />
        </VBtn>
        <VBtn
          v-if="!statusCamera"
          icon
          color="error"
          size="43"
          @click="stopCameraWithBeforeUnload"
        >
          <VIcon icon="tabler-video-off" />
        </VBtn>

      
        <VBtn
          v-if="videoStream && !statusCamera && !recording"
          icon
          color="primary"
          size="43"
          :disabled="loadingSaveVideoDetection"
          :loading="loadingSaveVideoDetection"
          @click="startRecording"
        >
          <VIcon
            icon="tabler-video-plus"
          />
        </VBtn>
        <VBtn
          v-if="recording && !statusCamera"
          variant="tonal"
          icon
          size="43"
          color="error"
          :disabled="loadingSaveVideoDetection"
          :loading="loadingSaveVideoDetection"
          @click="stopRecording"
        >
          <VIcon
            icon="tabler-video-minus"
          />
        </VBtn>
      </div>
      <div v-if="recording">
        <p>Grabando...</p>
        <p>Tiempo restante: {{ remainingTime }} segundos</p>
      </div>
    </div>
  </section>
</template>
