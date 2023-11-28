<script setup>
import { VForm } from 'vuetify/components'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import axios from '@axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { setUserAccessModules } from '@/plugins/casl/abilities'
import { useCurrentUserStore } from '@/stores/useCurrentUser'
import {
  emailValidator,
  requiredValidator,
} from '@validators'
import authV2LoginIllustrationBorderedDark from '@/assets/images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@/assets/images/pages/auth-v2-login-illustration-bordered-light.png'

// import authV2LoginIllustrationDark from '@/assets/images/pages/persons-music.png'
// import authV2LoginIllustrationLight from '@/assets/images/pages/persons-music.png'
import authV2MaskDark from '@/assets/images/pages/auth-v2-reset-password-illustration-light.png'
import authV2MaskLight from '@/assets/images/pages/auth-v2-reset-password-illustration-dark.png'

const currentUserStore = useCurrentUserStore()

// const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const authLoginImage = useGenerateImageVariant(authV2LoginIllustrationBorderedDark, authV2LoginIllustrationBorderedLight)
const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const ability = useAppAbility()

const errors = ref({
  username: undefined,
  password: undefined,
})

const refVForm = ref()
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const loadingLogin = ref(false)

const login = async () => {
  try {
    loadingLogin.value = true

    const r = await axios.post('/auth/token/', { 
      username: username.value,
      password: password.value,
    })

    const { access, refresh, user } = r.data

    // const userAccessModules = setUserAccessModules(user)

    // let userAbilities = userAccessModules.map(item=> {
    //   const { action, subject } = item.access
      
    //   return { action:action,subject:subject }
    // })

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
    
    ability.update(userAbilities)
    localStorage.setItem('userAbilities', JSON.stringify(userAbilities))

    localStorage.setItem('accessToken', JSON.stringify(access))
    localStorage.setItem('refreshToken', JSON.stringify(refresh))
    setTimeout(()=>loadingLogin.value = false, 7500)
    if (route.query.to) 
      router.replace(String(route.query.to))
    else 
      router.replace('/')
    
    return null
  } catch (e) {
    const formErrors2 = e.response.data
    if (formErrors2.detail != undefined) {
      console.log(formErrors2.detail)
    }
    errors.value = formErrors2
    setTimeout(()=>loadingLogin.value = false, 100)
  } finally {
    setTimeout(()=>loadingLogin.value = false, 8000)
  }
  
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login()
  })
}
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
            max-width="340"
            :src="authThemeMask"
            class="auth-illustration mt-16 mb-2"
          />
        </div>
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
          <h5 class="text-h5 font-weight-semibold mb-1">
            Welcome to Video Detection! 👋🏻
          </h5>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <VCardText>
          <VAlert
            color="primary"
            variant="tonal"
          >
            <p class="text-caption mb-2">
              Admin username: <strong>admin</strong> / Pass: <strong>admin</strong>
            </p>
            <p class="text-caption mb-0">
              Client Email: <strong>client</strong> / Pass: <strong>client</strong>
            </p>
          </VAlert>
        </VCardText>
        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="username"
                  label="Username"
                  type="text"
                  :rules="[requiredValidator]"
                  :error-messages="errors.username"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'forgot-password' }"
                  >
                    Forgot Password?
                  </RouterLink>
                </div>

                <VBtn
                  block
                  type="submit"
                  :loading="loadingLogin"
                  :disabled="loadingLogin"
                  variant="tonal"
                  color="success"
                >
                  INICIAR SESIÓN
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>
                <RouterLink
                  class="text-primary ms-2"
                  :to="{ name: 'register' }"
                >
                  Create an account
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
