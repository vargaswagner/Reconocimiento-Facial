<script setup>
const emit = defineEmits(['toggleComposeDialogVisibility'])

const folders = [
  {
    title: 'Imágenes',
    prependIcon: 'tabler-album',
    to: { name: 'apps-archivos-videos' },
  },

]

const labels = [
  {
    title: 'Personal',
    color: 'success',
    to: {
      name: 'apps-email-label',
      params: { label: 'personal' },
    },
  },
  {
    title: 'Company',
    color: 'primary',
    to: {
      name: 'apps-email-label',
      params: { label: 'company' },
    },
  },
  {
    title: 'Important',
    color: 'warning',
    to: {
      name: 'apps-email-label',
      params: { label: 'important' },
    },
  },
  {
    title: 'Private',
    color: 'error',
    to: {
      name: 'apps-email-label',
      params: { label: 'private' },
    },
  },
]
</script>

<template>
  <!-- 👉 Folders -->
  <ul class="mt-5 email-filters-labels">
    <RouterLink
      v-for="folder in folders"
      :key="folder.title"
      v-slot="{ isActive, href, navigate }"
      class="d-flex items-center cursor-pointer"
      :to="folder.to"
      custom
    >
      <li
        v-bind="$attrs"
        :href="href"
        :class="isActive && 'email-filter-active text-primary'"
        class="cursor-pointer"
        @click="navigate"
      >
        <VIcon
          :icon="folder.prependIcon"
          class="me-3"
          size="20"
        />
        <span>{{ folder.title }}</span>
      </li>
    </RouterLink>

    <!-- 👉 Labels -->
    <li class="text-xs d-block text-uppercase text-disabled mt-6">
      LABELS
    </li>
    <RouterLink
      v-for="label in labels"
      :key="label.title"
      v-slot="{ isActive, href, navigate }"
      class="d-flex items-center"
      :to="label.to"
      custom
    >
      <li
        v-bind="$attrs"
        :href="href"
        :class="isActive && 'email-label-active text-primary'"
        class="cursor-pointer"
        @click="navigate"
      >
        <VBadge
          inline
          dot
          :color="label.color"
          class="me-4"
        />
        <span>{{ label.title }}</span>
      </li>
    </RouterLink>
  </ul>
</template>

<style lang="scss">
.email-filters-labels {
  > li {
    position: relative;
    margin-block-end: 4px;
    padding-block: 4px;
    padding-inline: 20px;
  }

  .email-filter-active,
  .email-label-active {
    &::after {
      position: absolute;
      background: currentcolor;
      block-size: 100%;
      content: "";
      inline-size: 3px;
      inset-block-start: 0;
      inset-inline-start: 0;
    }
  }
}
</style>
