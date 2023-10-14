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
  try {
    let response = await iAModelsApi.post({
      name: data.name,
      work_environment: route.params.id,
    })

    isAddNewModelIA.value = false
    console.log('responseresponse', response)
  } catch (error) {
    console.log('error', error)
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
</script>

<template>
  <section>
    <VRow class="match-height">
      <!-- 👉 Total Earning -->
      <VCol
        cols="12"
        class="text-right"
      >
        <VBtn
          variant="tonal"
          @click="openDialogModelIA"
        >
          Agregar modelo IA
        </VBtn>
        <VBtn
          variant="tonal"
          color="success"
          @click="openDialogVideoDetections"
        >
          Deteccion
        </VBtn>
      </VCol>
      <VCol
        cols="4"
      >
        <VCard class="text-center">
          <VCardText>
            <AddNewVideoDetection
              v-model:isDrawerOpen="isAddNewVideoDetection"
              @video-detection-data="createNewVideoDetection"
            />
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="8">
        <VCard>
          <VCardText class="text-center">
            <video
              controls
              :src="resultVideoDetection"
              class="rounded"
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
