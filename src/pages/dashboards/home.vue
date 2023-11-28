<script setup>
import { useTheme } from 'vuetify'
import AnalyticsSalesByCountries from '@/views/dashboards/analytics/AnalyticsSalesByCountries.vue'
import AddNewWorkEnvironments from '@/views/apps/workEnvironments/AddNewWorkEnvironments.vue'
import AddNewVideo from '@/views/apps/archivos/videos/AddNewVideo.vue'

import auFlag from '@/assets/images/icons/countries/au.png'
import brFlag from '@/assets/images/icons/countries/br.png'
import cnFlag from '@/assets/images/icons/countries/cn.png'
import frFlag from '@/assets/images/icons/countries/fr.png'
import inFlag from '@/assets/images/icons/countries/in.png'
import usFlag from '@/assets/images/icons/countries/us.png'

import imagePackage from '@/assets/images/pages/icon explorer.png'

import workEnvironmentsApi from '@/services/models/workEnvironments'
import videosApi from '@/services/models/videos'

const salesByCountries = [
  {
    avatarImg: usFlag,
    stats: '$8,567k',
    subtitle: 'United states',
    profitLoss: 25.8,
  },
  {
    avatarImg: brFlag,
    stats: '$2,415k',
    subtitle: 'Brazil',
    profitLoss: -6.2,
  },
  {
    avatarImg: inFlag,
    stats: '$865k',
    subtitle: 'India',
    profitLoss: 12.4,
  },
  {
    avatarImg: auFlag,
    stats: '$745k',
    subtitle: 'Australia',
    profitLoss: -11.9,
  },
  {
    avatarImg: frFlag,
    stats: '$45',
    subtitle: 'France',
    profitLoss: 16.2,
  },
  {
    avatarImg: cnFlag,
    stats: '$12k',
    subtitle: 'China',
    profitLoss: 14.8,
  },
]

const listaWorkEnvironments = ref()
const isAddNewWorkEnvironments = ref(false)

const loadingDeleteWorkEnvironments = ref(false)
const loadingSaveWorkEnvironments = ref(false)

const errorWorkEnvironments = ref()

const workEnvironmentsSelected = ref()

const deleteWorkEnvironmentsSelect = ref({
  status: false,
  workEnvironments: undefined,
})

const resertErrorsWorkEnvironments = () => {
  errorWorkEnvironments.value = {
    name: undefined,
  }
}

resertErrorsWorkEnvironments()

const getAllDataWorkEnvironments = async () => {
  try {
    let response = await workEnvironmentsApi.getAll()
    listaWorkEnvironments.value = response.data.results
  } catch (error) {
    console.log(error)
  }
}

getAllDataWorkEnvironments()

const createWorkEnvironments = async data => {
  try {
    let response = await workEnvironmentsApi.post(data)

    isAddNewWorkEnvironments.value = false 

    getAllDataWorkEnvironments()
  } catch (err) {
    console.log(err)
  }
}

// Método PATCH para la actualización
const updateWorkEnvironments = async (id, data) => {
  try {
    let response = await workEnvironmentsApi.put(id, data)

    isAddNewWorkEnvironments.value = false 

    getAllDataWorkEnvironments()
  } catch (err) {
    console.log(err)
  }
}

const saveWorkEnvironments = async environmentsData => {
  try{
    loadingSaveWorkEnvironments.value = true
    if(!environmentsData.id){
      await createWorkEnvironments(environmentsData)
    }else {
      await updateWorkEnvironments(environmentsData.id, environmentsData)
    }
    
  } finally{
    loadingSaveWorkEnvironments.value = false
  }
}

const saveNewVideo = async data => {

  try {
    let response = await videosApi.post(data)

    isAddNewVideo.value = false 

  } catch (err) {
    console.log(err)
  }
}

const openDialogAddNewWorkEnvironments = () => {
  resertErrorsWorkEnvironments()
  workEnvironmentsSelected.value = null
  isAddNewWorkEnvironments.value = true
}

const isAddNewVideo = ref(false)

const openDialogAddNewVideos = data => {
  // resertErrorsWorkEnvironments()
  workEnvironmentsSelected.value = data
  isAddNewVideo.value = true
}

const workEnvironmentsSelectedEvent = environments => {
  resertErrorsWorkEnvironments()
  environments.name = environments.name
  workEnvironmentsSelected.value = environments
  isAddNewWorkEnvironments.value = true
  listaWorkEnvironments.value = [...listaWorkEnvironments.value]
}

const deleteWorkEnvironmentsConfirm = environments => {
  deleteWorkEnvironmentsSelect.value.status = true
  deleteWorkEnvironmentsSelect.value.workEnvironments = environments
}

const deleteWorkEnvironments = async confirm => {
  if (!confirm) return

  loadingDeleteWorkEnvironments.value=true
  try {

    let response = await workEnvironmentsApi.delete(deleteWorkEnvironmentsSelect.value.workEnvironments.id)
  } catch (err) {
    console.log(err)
  } finally {
    getAllDataWorkEnvironments()
    loadingDeleteWorkEnvironments.value=false
    deleteWorkEnvironmentsSelect.value.status = false
  }
}
</script>

<template>
  <section>
    <VCard>
      <VCardText>
        <VRow class="match-height">
          <!-- 👉 Sales by Countries -->
          <VCol
            cols="12"
            class="text-right"
          >
            <VBtn
              variant="tonal"
              @click="openDialogAddNewWorkEnvironments"
            >
              Agregar Entorno de Trabajo
            </VBtn>
          </VCol>
          <VCol
            v-for="environments in listaWorkEnvironments"
            :key="environments"
            cols="12"
            sm="4"
          >
            <VCard
              class="border"
            >
              <template #title>
                <span class="text-primary titulo">{{ environments.name }}</span>
              </template>
              <template #append>
                <div class="me-n2">
                  <VBtn
                    icon
                    color="default"
                    size="x-small"
                    variant="plain"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-dots-vertical"
                    />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem
                          v-for="(item, index) in ['Editar', 'Delete']"
                          :key="index"
                          :value="index"
                        >
                          <VListItemTitle>
                            <span @click="item === 'Editar' ? workEnvironmentsSelectedEvent(environments) : deleteWorkEnvironmentsConfirm(environments)">{{ item }}</span>
                          </VListItemTitle>
                        </VListItem>
                      </VList>
                    </VMenu>
                  </VBtn>
                </div>
              </template>

              <RouterLink
                :to="{ name: 'apps-archivos-id', params: { id: environments.id } }"
              >
                <div class="text-center icono-folder">
                  <VIcon
                    icon="tabler-folders"
                    size="200"
                  />
                </div> 
              </RouterLink>
              
              <div class="text-center mb-2">
                <VBtn
                  color="#000000"
                  @click="openDialogAddNewVideos(environments)"
                >
                  <span class="text-primary">Agregar Video</span>
                </VBtn>
              </div>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <AddNewVideo
      v-model:video-selected="workEnvironmentsSelected"
      v-model:isDrawerOpenDialog="isAddNewVideo"
      @video-data="saveNewVideo"
    />
    <AddNewWorkEnvironments
      v-model:isDrawerOpen="isAddNewWorkEnvironments"
      v-model:work-environments-selected="workEnvironmentsSelected"
      v-model:error-work-environments="errorWorkEnvironments"
      v-model:loading-save-work-environments="loadingSaveWorkEnvironments"
      @work-environments-data="saveWorkEnvironments"
    />
    <ConfirmDialog
      v-model:isDialogVisible="deleteWorkEnvironmentsSelect.status"
      :confirmation-msg="`¿Estas seguro de que quieres eliminar el Año Académico <<${deleteWorkEnvironmentsSelect.workEnvironments?.name}>>?. Se eliminará de forma permenente.`"
      :dialog-loading="loadingDeleteWorkEnvironments"
      @confirm="deleteWorkEnvironments"
    />
  </section>
</template>

<style lang="scss">
.titulo {
  color: #36c !important;
  font-family: Arial, sans-serif;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: black !important;
  }
}

.icono-folder {
  color: #36c;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: black !important;
  }
}
</style>
