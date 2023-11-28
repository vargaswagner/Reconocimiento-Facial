<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import ComposeDialog from '@/views/apps/email/ComposeDialog.vue'
import EmailLeftSidebarContent from '@/views/apps/email/EmailLeftSidebarContent.vue'
import EmailView from '@/views/apps/email/EmailView.vue'
import { useEmail } from '@/views/apps/email/useEmail'
import { useEmailStore } from '@/views/apps/email/useEmailStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import { formatDateToMonthShort } from '@core/utils/formatters'

import videosApi from '@/services/models/videos'
import AddNewVideoDrawer from '@/views/apps/archivos/videos/AddNewVideo.vue'

import ArchivosCard from '@/pages/components/archivos/archivosCard.vue'
import { watchEffect } from 'vue'

const { isLeftSidebarOpen } = useResponsiveLeftSidebar()

// Composables
const route = useRoute()
const store = useEmailStore()
const dataAllVideos = ref()
const loadingSaveImage = ref(false)

// Compose dialog
const isComposeDialogVisible = ref(false)
const isAddNewVideoDrawerVisible = ref(false)
const loadingMoreData = ref(false)
const loadingDeleteImage = ref(false)
const updateData = ref(false)

// Ref
const search = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const q = ref('')
const videoSelected = ref()

// ------------------------------------------------
const selectedEmails = ref([])
const newResults = ref()

const deleteVideoSelect = ref({
  status: false,
  video: undefined,
})


const getDataAllVideos = async () => {
  try {
    loadingMoreData.calue = true
    let response = await videosApi.getAll({
      search: search.value,
      page: currentPage.value,
      page_size: rowPerPage.value,
    })

    dataAllVideos.value = response.data.results

    // if (newResults.length > 0) {
    //   dataAllVideos.value = [...dataAllVideos.value, ...dataImagesResults]
    //   currentPage.value++
    // }
    
  } catch (error) {
    console.log(error)
  }finally{
    loadingMoreData.calue = false
  }
}

// getdataAllVideos()

watchEffect(async () => await getDataAllVideos())

// Email View
const openedEmail = ref(null)


// Fetch emails
const fetchEmails = async () => {
  selectedEmails.value = []
  await store.fetchEmails({
    q: q.value,
    filter: route.params.filter,
    label: route.params.label,
  })
}


watch([
  q,
  () => route.params.filter,
  () => route.params.label,
], fetchEmails, { immediate: true })
watch([
  () => route.params.filter,
  () => route.params.label,
], () => {
  openedEmail.value = null
})

const openDialogAddNewImage = () => {
  // resetArtist()
  videoSelected.value = {}
  updateData.value = false
  isAddNewVideoDrawerVisible.value = true
}

const createImage = async data => {
  try {
    let response = await videosApi.post(data, { headers : { 'content-type': 'multipart/form-data' } })
    isAddNewVideoDrawerVisible.value = false

    await getDataAllVideos()
  } catch (err) {
    console.log(err)
  }
}

// Método PATCH para la actualización
const updateImage = async (id, data) => {
  console.log('response id, data', id, data)
  try {
    let response = await videosApi.put(id, {
      label_name: data.get('label_name'),
    })
    isAddNewVideoDrawerVisible.value = false 

    console.log('response', response)
    await getDataAllVideos()
  } catch (err) {
    console.log(err)
  }
}

const videoID = ref()

const saveImage = async videoData => {
  
  for (const [key, value] of videoData.entries()) {
    console.log(`Campo: ${key}, Valor: ${value}`)
    videoID.value = value
  }

  try{
    loadingSaveImage.value = true
    if(videoID.value === 'undefined'){
      await createImage(videoData)
    }else {
      await updateImage(videoID, videoData)
    }
    
  } finally{
    loadingSaveImage.value = false
  }
}

const videoSelectedEvent = video => {
  // resertErrorsAcademicYear()
  updateData.value = true
  videoSelected.value = video
  isAddNewVideoDrawerVisible.value = true
  dataAllVideos.value = [...dataAllVideos.value]
}

const deleteVideoConfirm = video => {
  deleteVideoSelect.value.status = true
  deleteVideoSelect.value.video = video
}

const deleteVideo = async confirm => {
  if (!confirm) return

  loadingDeleteImage.value=true
  try {
    let response = await videosApi.delete(deleteVideoSelect.value.video.id)
  } catch (err) {
    console.log(err)
  } finally {
    getDataAllVideos()
    loadingDeleteImage.value=false
    deleteVideoSelect.value.status = false
  }
}
</script>

<template>
  <VLayout class="email-app-layout">
    <VNavigationDrawer
      v-model="isLeftSidebarOpen"
      absolute
      touchless
      location="start"
      :temporary="$vuetify.display.mdAndDown"
    >
      <EmailLeftSidebarContent @toggle-compose-dialog-visibility="isComposeDialogVisible = !isComposeDialogVisible" />
    </VNavigationDrawer>
    
    <VMain>
      <VCard
        flat
        class="h-100 d-flex flex-column"
      >
        <div class="d-flex align-center">
          <VBtn
            variant="text"
            color="default"
            icon
            size="small"
            class="d-lg-none ms-3"
            @click="isLeftSidebarOpen = true"
          >
            <VIcon
              size="24"
              icon="tabler-menu-2"
            />
          </VBtn>
          <!-- 👉 Search -->
          <VTextField
            v-model="search"
            density="default"
            class="email-search px-1 flex-grow-1"
            prepend-inner-icon="tabler-search"
            placeholder="Search Imagen"
          />
        </div>

        <VDivider />
        <ArchivosCard
          :data-archive="dataAllVideos"
          @data-selected-delete="deleteVideoConfirm"
          @data-selected-edit="videoSelectedEvent"
        />
        <li
          v-show="!store.emails.length"
          class="py-4 px-5 text-center"
        >
          <span class="text-high-emphasis">No items found.</span>
        </li>
      </VCard>
      <AddNewVideoDrawer
        v-model:updateData="updateData"
        v-model:loadingSaveImage="loadingSaveImage"
        v-model:video-selected="videoSelected"
        v-model:isDrawerOpenDialog="isAddNewVideoDrawerVisible"
        @video-data="saveImage"
      />
      <ConfirmDialog
        v-model:isDialogVisible="deleteVideoSelect.status"
        :confirmation-msg="`¿Estas seguro de que quieres eliminar el video <<${deleteVideoSelect.video?.label_name}>>?. Se eliminará de forma permenente.`"
        :dialog-loading="loadingDeleteImage"
        @confirm="deleteVideo"
      />
    </VMain>
  </VLayout>
</template>

<route lang="yaml">
meta:
  layoutWrapperClasses: layout-content-height-fixed
</route>

<style lang="scss">
@use "@/styles/variables/_vuetify.scss";
@use "@core/scss/base/_mixins.scss";
@use "vuetify/lib/styles/tools/elevation" as elevation;

// ℹ️ Remove border. Using variant plain cause UI issue, caret isn't align in center
.image-bg-col {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.email-search {
  .v-field__outline {
    display: none;
  }
}

.email-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include elevation.elevation(vuetify.$card-elevation);

  $sel-email-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-email-app-layout);
    }
  }
}

.email-list {
  white-space: nowrap;

  .email-item {
    transition: all 0.2s ease-in-out;
    will-change: transform, box-shadow;

    &.email-read {
      background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
    }

    & + .email-item {
      border-block-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    }
  }

  .email-item:hover {
    transform: translateY(-2px);

    @include elevation.elevation(3);

    .email-actions {
      display: block !important;
    }

    .email-meta {
      display: none;
    }

    + .email-item {
      border-color: transparent;
    }
  }
}

.email-compose-dialog {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
  min-inline-size: 100%;

  @media only screen and (min-width: 800px) {
    min-inline-size: 712px;
  }
}
</style>

