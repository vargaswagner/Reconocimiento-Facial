<script setup>
import { useTheme } from 'vuetify'
import AddNewModelIA from '@/views/apps/modeloIA/AddNewModelIA.vue'
import AddNewVideoDetection from '@/views/apps/videoDetection/AddNewVideoDetection.vue'
import videosApi from '@/services/models/videos'

// import fondoImagen from '@/assets/images/illustrations/congo-illustration.png'
import fondoImagen from '@/assets/images/pages/misc-under-maintenance.png'


import iAModelsApi from '@/services/models/modelIA'
import videoDetectionsApi from '@/services/models/videoDetections'
import { watchEffect } from 'vue'

const route = useRoute()
const router = useRouter()

const vuetifyTheme = useTheme()
const currentTheme = vuetifyTheme.current.value.colors

const listVideos = ref([])
const isAddNewModelIA = ref(false)
const isAddNewVideoDetection = ref(false)

const resultVideoDetection = ref()

const loadingSaveModelIA = ref(false)
const listIAModels = ref([])

const getAllVideos = async () => {
  try {
    let response = await videosApi.getAll({
      work_environment__id: route.params.id,
    })
    listVideos.value = response.data.results
  } catch (error) {
    console.log(error)
  }
}

const getDataAllIAModel = async () => {
  try {
    let response = await iAModelsApi.getAll({
      work_environment__id: route.params.id,
    })

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
  } catch (error) {
    console.log('error', error)
  }finally{
    loadingSaveModelIA.value = false
  }
}

const createNewVideoDetection = async data => {
  
  try {
    // let response = await videoDetectionsApi.post(data)

    // isAddNewVideoDetection.value = false

    resultVideoDetection.value = data.video_result

  } catch (error) {
    console.log('error', error)
  }
}


const files = ref()

const openFileInput = () => {
  const fileInput = document.querySelector('input[type="file"]')

  fileInput.click()
}

const playVideo = () => {
  const videoElement = document.querySelector('video')
  if (videoElement) {
    videoElement.play() // Reproduce automáticamente el video cuando se carga
  }
}
</script>

<template>
  <section>
    <VRow class="match-height">
      <VCol
        cols="4"
      >
        <VCard class="text-center">
          <div class="border rounded pl-3 pr-3 pb-3">
            <VBtn
              v-if="listVideos.length > 0"
              variant="tonal"
              class="mt-2"
              @click="openDialogModelIA"
            >
              Entrenar nuevo modelo
            </VBtn>
            <h3
              v-else
              class="text-warning mt-3"
            >
              👈 Sube videos
            </h3>
          </div>
          <VCardText v-if="listVideos.length > 0">
            <AddNewVideoDetection
              v-model:listaIAModels="listIAModels"
              v-model:isDrawerOpen="isAddNewVideoDetection"
              v-model:enviroments="route.params.id"
              @video-detection-data="createNewVideoDetection"
            />
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="8">
        <VCard>
          <VCardText class="text-center">
            <div
              v-if="!resultVideoDetection"
              class="fondo-imagen"
            >
              <VImg
                :src="fondoImagen"
                height="400"
              />
            </div>
            <video
              v-else
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

// .fondo-imagen {
//   block-size: 10rem;
// }
</style>
