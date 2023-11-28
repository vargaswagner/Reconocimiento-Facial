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
  workEnvironmentsSelected: {
    type: Object,
    required: false,
  },
  errorWorkEnvironments: {
    type: Object,
    required: false,
  },
  loadingSaveWorkEnvironments: {
    type: Boolean,
    required: true,
  },
}) 

const emit = defineEmits([
  'update:isDrawerOpen',
  'workEnvironmentsData',
])

const isFormValid = ref(false)
const refForm = ref()

const environments = ref()

const resetWorkEnvironments = () => {
  environments.value = {
    name: undefined,
  }
}

resetWorkEnvironments()

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('workEnvironmentsData', environments.value)
    }
  })
}

watchEffect(() => {
  if (props.workEnvironmentsSelected){
    environments.value.id = props.workEnvironmentsSelected.id
    environments.value.name = props.workEnvironmentsSelected.name
  } else {
    nextTick(() => {
      refForm.value?.reset()
      refForm.value?.resetValidation()
    })
    resetWorkEnvironments()
  }
})

watchEffect(() => {
  environments.value.name = environments.value.name || null
  // eslint-disable-next-line vue/no-mutating-props
  props.errorWorkEnvironments.name = undefined
})

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}

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
                  v-model="environments.name"
                  prepend-inner-icon="tabler-folder"
                  :error-messages="props.errorWorkEnvironments.name"
                  label="Nombre"
                  placeholder="Nombre"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol
                cols="12"
                class="text-center"
              >
                <VBtn
                  type="submit"
                  class="me-3"
                  :disabled="loadingSaveWorkEnvironments"
                  :loading="loadingSaveWorkEnvironments"
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
