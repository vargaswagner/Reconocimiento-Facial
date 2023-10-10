// utils/cals.js

// Define a Set to hold the access modules
const accessModules = new Set()

function set_access_moduls() {
  return {
    add: function(mapping) {
      // Add each key-value pair in the mapping to the accessModules Set
      Object.keys(mapping).forEach(function(key) {
        accessModules.add({ module: key, access: mapping[key] })
      })
    },
    get: function() {
      // Return an array of objects representing the access modules
      return Array.from(accessModules)
    },
  }
}

// Export the set_access_moduls function
export { set_access_moduls }
