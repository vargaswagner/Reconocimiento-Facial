<script setup>
import videoDetectionsApi from '@/services/models/videoDetections'
import videosApi from '@/services/models/videos'
import { watchEffect } from 'vue'

const props = defineProps({
  isDrawerOpenDialog: {
    type: Boolean,
    required: true,
  },

  // loadingDataList: {
  //   type: Boolean,
  //   required: true,
  // },
})

const emit = defineEmits([
  'update:isDrawerOpenDialog',
  'update:loadingDataList',
  'videoData',
  'searchData',
])

const listVideos = ref([])
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

const search = ref('')

const getAllDataVideo= async () => {
  try {
    let response = await videosApi.getAll()

    listVideos.value = response.data.results

  } catch (error) {
    console.log(error)

  }
}

getAllDataVideo()

// watchEffect(async () => getDataImages())

watch(
  () => search.value,
  async (newSearch, oldSearch) => {
    if (newSearch !== oldSearch) {
      // Realiza acciones necesarias cuando la variable search cambia
      await getDataImages()
    }
  },
)

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpenDialog', false)
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpenDialog', val)
}

const getVideoSelect = async dataVideo => {

  emit('videoData', dataVideo)
  emit('update:isDrawerOpenDialog', false)
  emit('update:loadingDataList', true)
}


watchEffect(async () => {
  await getVideoSelect()
})

const isDialogVisible = ref(false)
</script>

<template>
  <VDialog
    :model-value="props.isDrawerOpenDialog"
    width="60rem"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeNavigationDrawer" />

    <!-- Dialog Content -->
    <VCard>
      <template #title>
        Imágenes
        <VTextField
          v-model="search"
          density="default"
          prepend-inner-icon="tabler-search"
          placeholder="Search Imagen"
        />
      </template>
      <VCardText>
        <VRow>
          <VCol
            v-for="(video, index) in listVideos"
            :key="index"
            cols="3"
            class="text-truncate"
          >
            <VCard @click="getVideoSelect(video)">
              <VCardText
                class="text-center"
              >
                <span class="text-h8">{{ video.label_name }}</span>
                <template #loader>
                  <span>Loading...</span>
                </template>
              </VCardText>
            </VCard> 
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
