<script setup>
import {
  requiredValidator,
} from '@validators'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { watchEffect } from 'vue'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },

  loadingSaveModelIa: {
    type: Boolean,
    required: true,
  },
  workEnvironments: {
    String,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'iaModelData',
])

const isFormValid = ref(false)
const refForm = ref()

const iAModel = ref()

const resetModelIA = () => {
  iAModel.value = {
    name: undefined,
    work_environment: undefined,
  }
}

resetModelIA()

watchEffect(() => console.log('hola mundo', props.workEnvironments))

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('iaModelData', iAModel.value)
    }
  })
}

// watchEffect(() => {
//   if (props.academicYearSelected){
//     academicYear.value.id = props.academicYearSelected.id
//     academicYear.value.name = props.academicYearSelected.name
//     academicYear.value.date_start = props.academicYearSelected.date_start
//     academicYear.value.date_end = props.academicYearSelected.date_end
//   } else {
//     nextTick(() => {
//       refForm.value?.reset()
//       refForm.value?.resetValidation()
//     })
//     resetModelIA()
//   }
// })


const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VDialog
    temporary
    :width="600"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form Create -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 Nombre -->
              <VCol cols="12">
                <VTextField
                  v-model="iAModel.name"
                  type="text"
                  label="Nombre"
                />
              </VCol>

              <!-- 👉 Fecha Inicio -->
              

              <!-- 👉 Submit and Cancel -->
              <VCol
                cols="12"
                class="text-center"
              >
                <VBtn
                  type="submit"
                  class="me-3"
                  :loading="loadingSaveModelIa"
                  :disabled="loadingSaveModelIa"
                >
                  Guardar
                </VBtn>
                <VBtn
                  variant="tonal"
                  color="secondary"
                  
                  @click="closeNavigationDrawer"
                >
                  Cancelar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VDialog>
</template>
