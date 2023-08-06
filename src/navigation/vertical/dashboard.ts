export default [
  {
    title: 'Medicines',
    icon: { icon: 'mdi-pill' },
    to: 'Medicines',
  },
  {
    title: 'Donate-Medicine',
    icon: { icon: 'mdi-pill-multiple' },
    to: 'Donate-Medicine',
  },
  {
    title: 'My-Donated-Medicines',
    icon: { icon: 'mdi-pill-multiple' },
    to: 'MyMedicines',
  },
  {
    title: 'Recognize-Disease',
    icon: { icon: 'mdi-medication' },
    to: 'Recognize-Disease',
  },
  { heading: 'Dashboards' },
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
]
