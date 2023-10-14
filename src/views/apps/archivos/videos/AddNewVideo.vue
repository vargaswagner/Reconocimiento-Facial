<script setup>
import { watchEffect } from "vue"

const props = defineProps({
  isDrawerOpenDialog: {
    type: Boolean,
    required: true,
  },
  imageSelected: {
    type: Object,
    required: false,
  },

  // loadingSaveAcademicYear: {
  //   type: Boolean,
  //   required: true,
  // },
})

const emit = defineEmits([
  'update:isDrawerOpenDialog',
  'imageData',
])

const isDialogVisible = ref(false)
const formDataImage = ref()
const isFormValid = ref(false)
const refForm = ref()

const resetformDataImage = () => {
  formDataImage.value = {
    label_name: undefined,
    video: undefined,
  }
}

resetformDataImage()

const onSubmit = async () => {
  const formDataToSubmit = new FormData()

  formDataToSubmit.append('label_name', formDataImage.value.label_name)
  formDataToSubmit.append('work_environment', props.imageSelected.id)
  formDataToSubmit.append('video', formDataImage.value.video[0])
  formDataToSubmit.append('number_samples', 32767)
  formDataToSubmit.append('id', formDataImage.value.id)
  refForm.value?.validate().then(({ valid }) => {
    

    if (valid) {
      
      emit('imageData', formDataToSubmit)
    }
  })
}

// watchEffect(() => {
//   if (props.imageSelected){
//     formDataImage.value.id = props.imageSelected.id
//     formDataImage.value.name = props.imageSelected.name

//     // formDataImage.value.image = props.imageSelected.image
//   } else {
//     nextTick(() => {
//       refForm.value?.reset()
//       refForm.value?.resetValidation()
//     })
//     resetformDataImage()
//   }
// })


const closeNavigationDrawer = () => {
  emit('update:isDrawerOpenDialog', false)
  resetformDataImage()
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpenDialog', val)
  resetformDataImage()
}
</script>

<template>
  <VDialog
    :model-value="props.isDrawerOpenDialog"
    max-width="600"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeNavigationDrawer" />

    <!-- Dialog Content -->
    <VCard title="Agregar Imagen">
      <VForm
        ref="refForm"
        v-model="isFormValid"
        @submit.prevent="onSubmit"                                      
      >
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              sm="5"
            >
              <VTextField
                v-model="formDataImage.label_name"
                label="Nombre de la Imagen"
              />
            </VCol>
            <VCol
              cols="12"
              sm="7"
            >
              <VFileInput
                v-model="formDataImage.video"
                chips
                label="Subir Archivo"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn
            variant="tonal"
            color="secondary"
            @click="closeNavigationDrawer"
          >
            Cerrar
          </VBtn>
          <VBtn
            type="submit"
          >
            Guardar
            <template #loader>
              <span>Loading...</span>
            </template>
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
