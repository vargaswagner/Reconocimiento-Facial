import { set_access_moduls } from '@/utils/casl'

const actions_db = {
  'view': 'read',
  'add': 'create',
  'change': 'update',
  'delete': 'delete',
}

function setUserAccessModules(user) {
  let permision_user  = []

  user.groups.map(group => {
    permision_user = [...permision_user, ...group.permissions]
  })
  permision_user = [...permision_user, ...user.user_permissions]
        
  let hash = {}
  permision_user = permision_user.filter(o => hash[o.id] ? false : hash[o.id] = true)

  let mapping_access_moduls = []

  for(let permission of permision_user){
    const actions_name = permission.codename.split(`_${permission.content_type.model}`)[0]

    mapping_access_moduls.push({
      'action': actions_db[actions_name],
      'subject': permission.content_type.model,
    })
  }

  const accessModules = set_access_moduls()

  accessModules.add(mapping_access_moduls)

  return accessModules.get()
}

export { setUserAccessModules }
