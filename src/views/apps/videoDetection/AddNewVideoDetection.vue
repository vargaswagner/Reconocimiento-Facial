<script setup>
import {
  requiredValidator,
} from '@validators'
import VideoCamara from '@/views/apps/archivos/videos/VideoCamara.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { watchEffect } from 'vue'
import iAModelsApi from '@/services/models/modelIA'
import videoDetectionsApi from '@/services/models/videoDetections'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
}) 

const emit = defineEmits([
  'update:isDrawerOpen',
  'videoDetectionData',
])

const isFormValid = ref(false)
const refForm = ref()

const isAddVideoForDetection = ref(false)

const statusVideoSelect = ref(false)
const videoDetections = ref()
const listIAModels = ref([])
const resultVideoDetection = ref()
const loadingSaveVideoDetection = ref(false)
const resultVideo = ref()

const resetVideoDetections = () => {
  videoDetections.value = {
    video: undefined,
    ia_model: undefined,
  }
}

resetVideoDetections()

const getDataAllIAModel = async () => {
  try {
    let response = await iAModelsApi.getAll()

    listIAModels.value = response.data.results.map(iaModel => {
      iaModel.title = iaModel.name
      iaModel.id = iaModel.id

      return iaModel
    })
  }catch (error) {
    console.log(error)
  }
}

getDataAllIAModel()

const openFileVideosCard = () => {
  isAddVideoForDetection.value = true
}

const getSelectVideoDetection = data => {
  if (data) {
    videoDetections.value.video = data.video
  }
  console.log('hellow Video', videoDetections)
}

const createNewVideoDetection = async data => {
  try {
    if (data) {

      const formData = new FormData()

      formData.append('video', data)
      formData.append('ia_model', videoDetections.value.ia_model.id)
    
      console.log('dataCameradataCameradataCamera',formData)
    

      let response = await videoDetectionsApi.post(formData)
      console.log('responseresponsecamara',response)

      resultVideo.value = response

      emit('videoDetectionData', response.data)
    }else{

      const formDataToSubmit = new FormData()

      loadingSaveVideoDetection.value = true

      formDataToSubmit.append('video', videoDetections.value.video[0])
      formDataToSubmit.append('ia_model', videoDetections.value.ia_model.id)
      formDataToSubmit.append('id', videoDetections.value.id)

      let response = await videoDetectionsApi.post(formDataToSubmit)

      console.log('responseVideo', response.data)

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
    console.log('Archivo seleccionado:', file)
    statusVideoSelect.value = true
  }
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
          :items="listIAModels"
          label="Modelo IA"
          single-line
          variant="filled"
          return-object
        />
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
              Save
            </VBtn>

            <VBtn
              class="mt-3"
              variant="tonal"
              color="secondary"
            >
              Reset
            </VBtn>
          </div>
        </div>
      </VCol>

      <VCol cols="12">
        <div class="border rounded pa-4">
          <VideoCamara
            :selected-model="videoDetections.ia_model"
            @video-data-camara="createNewVideoDetection"
          />
        </div>
      </VCol>
    </VRow>
  </VForm>
</template>
