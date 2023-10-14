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
            v-for="imagen in datosArchivo"
            :key="imagen"
            cols="12"
            md="3"
            sm="4"
            class="text-center"
          >
            <VCard
              style="background-color: rgba(255, 255, 255, 10%);"
            >
              <VRow>
                <VCol>
                  <VImg
                    :src="imagen?.image"
                    height="130"
                    class="mt-2"
                  />
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12">
                  <h4 class="ml-3 mr-3 text-secondary text-truncate">
                    {{ imagen.name }}
                  </h4>
                  <span class="text-sm text-truncate">
                    {{ imagen.created.split('T')[0] }}
                  </span>
                </VCol>
                <VCol
                  v-if="imagen?.image"
                  cols="12"
                >
                  <VBtn
                    icon
                    size="x-small"
                    color="secondary"
                    variant="tonal"
                    @click="dataSelectedEdit(imagen)"
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
                    @click="dataSelectedDelete(imagen)"
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
