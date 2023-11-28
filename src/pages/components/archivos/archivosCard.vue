<script setup>
import { watchEffect } from "vue"
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

// import imageAudio from '@/assets/images/svg/music-1.svg'

const props = defineProps({
  dataArchive: {
    type: Object,
    required: false,
  },
})

const emit = defineEmits([
  'dataMusic',
  'dataSelectedDelete',
  'dataSelectedEdit',
])

const q = ref('')
const datosArchivo = ref()

const dataSelectedDelete = data => {
  emit('dataSelectedDelete', data)
}

const dataSelectedEdit = data => {
  emit('dataSelectedEdit', data)
}

watchEffect(() => {
  if (props.dataArchive) {
    datosArchivo.value = props.dataArchive
    console.log('archivos', datosArchivo)
  }
})
</script>

<template>
  <PerfectScrollbar
    tag="ul"
    :options="{ wheelPropagation: false }"
    class="email-list"
  >
    <VCard
      flat
    >
      <VCardText>
        <VRow>
          <VCol
            v-for="archivo in datosArchivo"
            :key="archivo.id"
            cols="12"
            md="4"
            sm="4"
            class="text-center"
          >
            <VCard
              class="border"
              style="background-color: rgba(255, 255, 255, 10%);"
            >
              <VRow>
                <VCol>
                  <video
                    :src="archivo?.video"
                    height="130"
                    class="mt-2 rounded"
                  />
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12">
                  <h4 class="ml-3 mr-3 text-secondary text-truncate">
                    {{ archivo.label_name }}
                  </h4>
                  <span class="text-sm text-truncate">
                    {{ archivo.created.split('T')[0] }}
                  </span>
                </VCol>
                <VCol
                  cols="12"
                >
                  <VBtn
                    icon
                    size="x-small"
                    color="secondary"
                    variant="tonal"
                    @click="dataSelectedEdit(archivo)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                    />
                  </VBtn>
                  <VBtn
                    icon
                    size="x-small"
                    color="error"
                    variant="tonal"
                    @click="dataSelectedDelete(archivo)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-trash"
                    />
                  </VBtn>
                </VCol>
              </VRow>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </PerfectScrollbar>
</template>
