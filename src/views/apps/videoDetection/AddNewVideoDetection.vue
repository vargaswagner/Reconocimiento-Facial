<script setup>
import {
  requiredValidator,
} from '@validators'
import VideoCamara from '@/views/apps/archivos/videos/VideoCamara.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { watchEffect } from 'vue'
import iAModelsApi from '@/services/models/modelIA'
import videosApi from '@/services/models/videos'
import videoDetectionsApi from '@/services/models/videoDetections'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  enviroments: {
    type: String,
    required: true,
  },
  listaIAModels: {
    type: Object,
    required: true,
  },
}) 

const emit = defineEmits([
  'update:isDrawerOpen',
  'videoDetectionData',
])

const dataItemsModel = ref()


const isFormValid = ref(false)
const refForm = ref()

const isAddVideoForDetection = ref(false)

const statusVideoSelect = ref(false)
const videoDetections = ref()
const resultVideoDetection = ref()
const loadingSaveVideoDetection = ref(false)
const loadingSaveRecordingDetection = ref(false)
const resultVideo = ref()

const loadingDownloadModeloIA = ref(false)

const resetVideoDetections = () => {
  videoDetections.value = {
    video: undefined,
    ia_model: undefined,
  }
}

resetVideoDetections()


const openFileVideosCard = () => {
  isAddVideoForDetection.value = true
}

const getSelectVideoDetection = data => {
  if (data) {
    videoDetections.value.video = data.video
  }
}

const saveNewVideo = async data => {

  data.append('label_name', 'grabacion2')
  data.append('work_environment', props.enviroments)

  try {
    await videosApi.post(data)
  } catch (err) {
    console.log(err)
  }
}

const updateModeloIA = async data => {

  try {
    if (data) {
      let res = await iAModelsApi.put(data.ia_model.id,{
        name: data.ia_model.name,
      })

    }
  } catch (err) {
    console.log(err)
  }
}

const createNewVideoDetection = async data => {

  try {
    if (data) {
      loadingSaveVideoDetection.value = true

      const formData = new FormData()

      formData.append('video', data)
      formData.append('ia_model', videoDetections.value.ia_model.id)

      let response = await videoDetectionsApi.post(formData)

      resultVideo.value = response

      emit('videoDetectionData', response.data)
    }else{

      const formDataToSubmit = new FormData()

      loadingSaveVideoDetection.value = true

      formDataToSubmit.append('video', videoDetections.value.video[0])
      formDataToSubmit.append('ia_model', videoDetections.value.ia_model.id)
      formDataToSubmit.append('id', videoDetections.value.id)

      let response = await videoDetectionsApi.post(formDataToSubmit)

      emit('videoDetectionData', response.data)

    }
  } catch (error) {
    console.log('error', error)
  }finally{
    loadingSaveVideoDetection.value = false
  }
}

const onSubmit = async () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      createNewVideoDetection()
    }
  })
}

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const files = ref()

const openFileInput = () => {
  const fileInput = document.querySelector('input[type="file"]')

  fileInput.click()
}

const handleFileChange = event => {
  const file = event.target.files[0]
  if (file) {
    statusVideoSelect.value = true
  }
}

const downloadModeloIA = async () => {
  if (videoDetections.value.ia_model) {
    try {
      loadingDownloadModeloIA.value = true
      let response = await iAModelsApi.create_proyect({
        id: videoDetections.value.ia_model.id,
      })
      const blob = base64toBlob(response.data.base64_file, 'application/octet-stream')
      const url = window.URL.createObjectURL(blob)

      // Crea y simula un enlace de descarga
      const a = document.createElement('a')

      a.href = url
      a.download = `${videoDetections.value.ia_model.name}.rar`
      a.click()

      // Limpia el enlace después de la descarga
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log(error)
    }finally{
      loadingDownloadModeloIA.value = false
    }
  }
}

// Función para convertir base64 a Blob
function base64toBlob(base64Data, contentType) {
  const byteCharacters = atob(base64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType })
}
</script>

<template>
  <VForm
    ref="refForm"
    v-model="isFormValid"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol cols="12">
        <VSelect
          v-model="videoDetections.ia_model"
          :items="props.listaIAModels"
          label="Modelo IA"
          single-line
          variant="filled"
          return-object
        />
      </VCol>
      <VCol
        v-if="videoDetections.ia_model"
        cols="12"
      >
        <VBtn
          :disabled="loadingDownloadModeloIA"
          :loading="loadingDownloadModeloIA"
          @click="downloadModeloIA"
        >
          Descargar
        </VBtn>
      </VCol>
      <VCol cols="12">
        <div class="border rounded pa-4">
          <VBtn
            variant="tonal"
            color="success"
            @click="openFileInput"
          >
            Subir Video
          </VBtn>
                
          <VFileInput
            ref="fileInput"
            v-model="videoDetections.video"
            color="primary"
            label="File input"
            style="display: none;"
            @change="handleFileChange"
          />
          
          <div v-if="statusVideoSelect">
            <VBtn
              type="submit"
              class="me-2 mt-3"
              :disabled="loadingSaveVideoDetection"
              :loading="loadingSaveVideoDetection"
            >
              Cargar
            </VBtn>

            <VBtn
              class="mt-3"
              variant="tonal"
              color="secondary"
            >
              Cancelar
            </VBtn>
          </div>
        </div>
      </VCol>

      <VCol cols="12">
        <div class="border rounded pa-4">
          <VideoCamara
            v-model:loadingSaveVideoDetection="loadingSaveVideoDetection"
            :selected-model="videoDetections.ia_model"
            @video-data-camara="createNewVideoDetection"
          />
        </div>
      </VCol>
    </VRow>
  </VForm>
</template>
