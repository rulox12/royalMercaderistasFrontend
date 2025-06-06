import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import BuildingLibraryIcon from '@heroicons/react/24/solid/ArrowsPointingInIcon';

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
    title: 'Reportes',
    path: '/exports',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingLibraryIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Exporte general',
    path: '/export-large',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingLibraryIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Ver detalle de orden',
    path: '/order-detail',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingLibraryIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Ordenes',
    path: '/orders',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingLibraryIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Órdenes faltantes',
    path: '/unregistered-orders',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingLibraryIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Órdenes faltantes por tienda',
    path: '/unregistered-orders-by-shop',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingLibraryIcon />
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
        title: 'Usuarios',
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
        title: 'Proveedores',
        path: '/suppliers',
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
