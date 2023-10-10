import apiAuthJWT from '@/services/auth/auth'
import { canNavigate } from '@layouts/plugins/casl'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { getHomeRouteForLoggedInUser, getUserData, isUserLoggedIn } from './utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ℹ️ We are redirecting to different pages based on role.
    // NOTE: Role is just for UI purposes. ACL is based on abilities.
    {
      path: '/',
      redirect: to => {
        const userData = JSON.parse(localStorage.getItem('userData') || null)

        // const userAbilities = JSON.parse(localStorage.getItem('userAbilities') || '{}')
        const userRole = userData && userData.role ? userData.role : null

        // const abilitys = userAbilities ? userData.role : null
        // const ability = new Ability()
        // const { can, cannot, rules } = new AbilityBuilder()

        // can(abilitys.action['manage'], abilitys.subject['all'])
        // ability.update(rules)
        // console.log('hola mundo de abilitis')

        if (!userData){
          return { name: 'login', query: to.query }
        }

        // Si es admin
        // if (userData.is_superuser/* && ability.$can('manage', 'all')*/){
        //   return { name: 'dashboards-analytics' }
        // }

        if (userData.is_active/* && ability.$can('manage', 'all')*/){
          return { name: 'dashboards-analytics' }
        }

        // if (userData.role.code == 0) {
        //   return { name: 'apps-calendario-calendar' }
        // }

        // if (userData == 'Student') {
        //   return { name: 'apps-calendario-calendar' }
        // }
        // if (userData == 'Teacher') {
        //   return { name: 'apps-alumnos' }
        // }
        
        

        // Armar if si es docente, mandar a un page docente
        // Armar if si es alumno, mandar a un page alumno
        // Armar if si es asistente, mandar a un page asistente
        // if (userRole == null){
        //   return { name: 'access-control' }
        // }
        return { name: 'dashboards-analytics' }
      },
    },
    ...setupLayouts(routes),
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to, _, next) => {
  const isLoggedIn = isUserLoggedIn()
  if (to.name!='login') await apiAuthJWT.getTokenAndVerify()

  // console.log('isLoggedIn :>> ', isLoggedIn)
  // console.log('canNavigate(to) :>> ', canNavigate(to))
  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    // ℹ️ Only add `to` query param if `to` route is not index route
    if (!isLoggedIn)
      return next({ name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } })

    // If logged in => not authorized
    return next({ name: 'not-authorized' })
  }

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    const userData = getUserData()

    next(getHomeRouteForLoggedInUser(userData))
  }
  
  return next()
})
export default router
