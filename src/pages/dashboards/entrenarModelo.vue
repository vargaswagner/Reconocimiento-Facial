<script setup>
import { useTheme } from 'vuetify'
import AddNewModelIA from '@/views/apps/modeloIA/AddNewModelIA.vue'
import AddNewVideoDetection from '@/views/apps/videoDetection/AddNewVideoDetection.vue'
import videosApi from '@/services/models/videos'

import iAModelsApi from '@/services/models/modelIA'
import videoDetectionsApi from '@/services/models/videoDetections'
import { watchEffect } from 'vue'

const route = useRoute()
const router = useRouter()

const vuetifyTheme = useTheme()
const currentTheme = vuetifyTheme.current.value.colors

const listVideos = ref()
const isAddNewModelIA = ref(false)
const isAddNewVideoDetection = ref(false)

const resultVideoDetection = ref()

const loadingSaveModelIA = ref(false)

const getAllVideos = async () => {
  try {
    let response = await videosApi.getAll()
    listVideos.value = response.data.results
    console.log('listVideos', listVideos)
  } catch (error) {
    console.log(error)
  }
}

getAllVideos()

const idWorkEnvironments = ref()

watchEffect(() => idWorkEnvironments.value = route.params.id)

const openDialogModelIA = () => {
  
  isAddNewModelIA.value = true
}

const openDialogVideoDetections = () => {
  isAddNewVideoDetection.value = true
}

const createNewModelIA = async data => {
  loadingSaveModelIA.value = true
  try {
    let response = await iAModelsApi.post({
      name: data.name,
      work_environment: route.params.id,
    })

    isAddNewModelIA.value = false
    console.log('responseresponse', response)
  } catch (error) {
    console.log('error', error)
  }finally{
    loadingSaveModelIA.value = false
  }
}

const createNewVideoDetection = async data => {
  
  console.log('datayakklkl', data)
  try {
    // let response = await videoDetectionsApi.post(data)

    // isAddNewVideoDetection.value = false

    resultVideoDetection.value = data.video_result

    // console.log('responseresponse', response)
  } catch (error) {
    console.log('error', error)
  }
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
  }
}

const playVideo = () => {
  const videoElement = document.querySelector('video')
  if (videoElement) {
    videoElement.play() // Reproduce automáticamente el video cuando se carga
  }
}

const items = [
  'Foo',
  'Bar',
  'Fizz',
  'Buzz',
]

const getDataAllModels = async () => {
  try {
    let response = await iAModelsApi.getAll()
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <section>
    <VRow class="match-height">
      <VCol
        cols="4"
      >
        <VCard
          class="text-center"
          title="Entrenamiento del modelo"
        >
          <VCardText>
            <VRow>
              <VCol>
                <VTextField
                  label="Escribe el nombre del modelo"
                  variant="filled"
                />
              </VCol>
            </VRow>
          </VCardText>
          <VBtn
            variant="tonal"
            class="mt-2"
            @click="getDataAllModels"
          >
            Entrenar modelo
          </VBtn>
        </VCard>
      </VCol>
      <VCol cols="8">
        <VCard title="Etiquetas entrenados">
          <VCardText class="text-center">
            <video
              :key="resultVideoDetection"
              controls
              :src="resultVideoDetection"
              class="rounded"
              autoplay
              @load="playVideo"  
            >
              <source
                :src="resultVideoDetection"
                type="video/mp4"
              >
              <source>
            </video>
          </VCardText>
        </VCard> 
      </VCol>
    </VRow>
    <AddNewModelIA
      v-model:isDrawerOpen="isAddNewModelIA"
      v-model:loading-save-model-ia="loadingSaveModelIA"
      v-model:work-environments="idWorkEnvironments"
      @ia-model-data="createNewModelIA"
    />
  </section>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
