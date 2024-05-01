import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import BuildingOfficeIcon from '@heroicons/react/24/solid/BuildingOfficeIcon';
import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon';
import QueueListIcon from '@heroicons/react/24/solid/QueueListIcon';
import BuildingLibraryIcon from '@heroicons/react/24/solid/BuildingLibraryIcon';
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import UserGroupIcon from '@heroicons/react/24/solid/UserGroupIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Inicio',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Pedidos',
    path: '/big-orders',
    icon: (
      <SvgIcon fontSize="small">
        <ListBulletIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Configuración',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
    subItems: [
      {
        title: 'Users',
        path: '/customers'
      },
      {
        title: 'Plataformas',
        path: '/platforms'
      },
      {
        title: 'Locales',
        path: '/shops',
      },
      {
        title: 'Ciudades',
        path: '/cities'
      },
      {
        title: 'Productos',
        path: '/products',
      },
      {
        title: 'Listas',
        path: '/lists',
      },
      {
        title: 'Ciudades',
        path: '/cities',
      },
      {
        title: 'Proveedores',
        path: '/suppliers',
      },

      {
        title: 'Exportar',
        path: '/exports',
      },
    ]
  },
  // {
  //   title: 'Roles',
  //   path: '/roles',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <ListBulletIcon />
  //     </SvgIcon>
  //   )
  // },
];
