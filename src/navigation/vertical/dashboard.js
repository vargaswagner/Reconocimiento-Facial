export default [
  {
    title: 'Dashboards',
    icon: { icon: 'tabler-smart-home' },
    children: [
      {
        title: 'Analytics',
        to: 'dashboards-analytics',
      },
      {
        title: 'eCommerce',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'CRM',
        to: 'dashboards-crm',
      },
    ],
    badgeContent: '2',
    badgeClass: 'bg-light-primary text-primary',
  },
  {
    title: 'Home',
    icon: { icon: 'tabler-smart-home' },
    to: 'dashboards-home',
  },
  {
    title: 'Archivos',
    icon: { icon: 'tabler-books' },
    to: 'apps-archivos-videos',
  },
]
