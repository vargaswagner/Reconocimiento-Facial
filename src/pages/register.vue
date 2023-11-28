
<script setup>
import { VForm } from 'vuetify/components'
import authV2RegisterIllustrationBorderedDark from '@/assets/images/pages/auth-v2-register-illustration-bordered-dark.png'
import authV2RegisterIllustrationBorderedLight from '@/assets/images/pages/auth-v2-register-illustration-bordered-light.png'
import authV2RegisterIllustrationDark from '@/assets/images/pages/auth-v2-register-illustration-dark.png'
import authV2RegisterIllustrationLight from '@/assets/images/pages/auth-v2-register-illustration-light.png'
import authV2MaskDark from '@/assets/images/pages/misc-mask-dark.png'
import authV2MaskLight from '@/assets/images/pages/misc-mask-light.png'
import { setUserAccessModules } from '@/plugins/casl/abilities'
import { useCurrentUserStore } from '@/stores/useCurrentUser'
import { showToastError, showToastSuccess, showToastWarning } from '@/pages/apps/toast'

import imageMundoMusic from '@/assets/images/pages/misc-under-maintenance.png'

const currentUserStore = useCurrentUserStore()

import { useAppAbility } from '@/plugins/casl/useAppAbility'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import axios from '@axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import {
  alphaDashValidator,
  emailValidator,
  requiredValidator,
} from '@validators'

import authUserApi from '@/services/auth/authUser'

const refVForm = ref()
const username = ref()
const email = ref()
const gender = ref('M')
const password = ref()
const privacyPolicies = ref(true)

// Router
const route = useRoute()
const router = useRouter()

// Ability
const ability = useAppAbility()

// Form Errors
const errors = ref({
  email: undefined,
  password: undefined,
})

const loadingRegister = ref(false)

const register = async () => {
  const headers = {
    'api-key-music': 'gIvRCn80.ZuiIqAqyTjgQp7WxmBfnwn2TN4har2Kb',
  }

  

  try {

    loadingRegister.value = true

    const registerResponse = await axios.post('/auth/register/', {
      username: username.value,
      gender: gender.value,
      email: email.value,
      password: password.value,
    })

    const responselogin = await axios.post('/auth/token/', {
      username: username.value,
      password: password.value,
    })

    const { access, refresh   } = responselogin.data

    const responseAuthMe = await axios.get('/auth/me/', { headers: { 'Authorization': `Bearer ${access}` } })

    const user = responseAuthMe.data

    let ability_view_app_web = [
      {
        "action": "read",
        "subject": "AclDemo",
      },
      {
        "action": "read",
        "subject": "Auth",
      },
    ]
    if (user.is_active){
      ability_view_app_web.push({
        "action": "manage",
        "subject": "all",
      })
    }

    let userAbilities = [...ability_view_app_web]

    currentUserStore.setCurrentUser(user)
    localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
    ability.update(userAbilities)
    localStorage.setItem('userData', JSON.stringify(user))
    localStorage.setItem('accessToken', JSON.stringify(access))
    localStorage.setItem('refreshToken', JSON.stringify(refresh))

    if (route.query.to)
      router.replace(String(route.query.to))
    else
      router.replace('/')
    
  } catch (error) {   
    if (error) {
      let messageError = ""

      if (error.response.status == 400) {

        Object.keys(error.response.data).forEach(function(propiedad) {
          messageError =  '👉 ' + error.response.data[propiedad]
        })
      
      }

      showToastError(messageError)
    }else{
      showToastError(null, 'error desconocido')
    }
  

  } finally {
    loadingRegister.value = false
  }
}


const imageVariant = useGenerateImageVariant(imageMundoMusic, imageMundoMusic, authV2RegisterIllustrationBorderedLight, imageMundoMusic, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      register()
  })
}

const generos = [
  {
    title: 'Masculino',
    value: 'M',
    icon: 'tabler-gender-male',
    color: 'primary',
  },
  {
    title: 'Femenino',
    value: 'F',
    icon: 'tabler-gender-female',
    color: 'error',
  },
  {
    title: 'Otro',
    value: 'O',
    icon: 'tabler-gender-agender',
    color: 'warning',
  },
]
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="650"
            :src="imageVariant"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          class="auth-footer-mask"
          :src="authThemeMask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />
          <h5 class="text-h5 font-weight-semibold mb-1">
            Adventure starts here 🚀
          </h5>
          <p class="mb-0">
            Make your app management easy and fun!
          </p>
        </VCardText>

        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- Username -->
              <VCol cols="12">
                <VTextField
                  v-model="username"
                  :rules="[requiredValidator, alphaDashValidator]"
                  label="Username"
                  placeholder="WagnerVC"
                />
              </VCol>

              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                  type="email"
                  placeholder="example@gmail.com"
                />
              </VCol>

              <!-- Género -->
              <VCol cols="12">
                <VSelect
                  v-model="gender"
                  :items="generos"
                  item-title="title"
                  item-value="value"
                  label="Seleccionar Género"
                >
                  <template #selection="{ item }">
                    <VChip>
                      <VIcon
                        size="20"
                        :color="item.raw.color"
                        :icon="item.raw.icon"
                      />
                      <span>{{ item.title }}</span>
                    </VChip>
                  </template>
                </VSelect>
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  :rules="[requiredValidator]"
                  label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center mt-2 mb-4">
                  <VCheckbox
                    id="privacy-policy"
                    v-model="privacyPolicies"
                    inline
                  />
                  <VLabel
                    for="privacy-policy"
                    class="pb-1"
                    style="opacity: 1;"
                  >
                    <span class="me-1">I agree to</span>
                    <a
                      href="javascript:void(0)"
                      class="text-primary"
                    >privacy policy & terms</a>
                  </VLabel>
                </div>

                <VBtn
                  block
                  type="submit"
                  variant="tonal"
                  color="success"
                  :disabled="loadingRegister"
                  :loading="loadingRegister"
                >
                  Inscribirse
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center text-base"
              >
                <span>¿Ya tienes una cuenta?</span>
                <RouterLink
                  class="text-primary ms-2"
                  :to="{ name: 'login' }"
                >
                  Iniciar sesión
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
