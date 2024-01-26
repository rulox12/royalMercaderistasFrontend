import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import BuildingOfficeIcon from '@heroicons/react/24/solid/BuildingOfficeIcon';
import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon';
import QueueListIcon from '@heroicons/react/24/solid/QueueListIcon';
import BuildingLibraryIcon from '@heroicons/react/24/solid/BuildingLibraryIcon';
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Home',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Usuarios',
    path: '/customers',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Plataformas',
    path: '/platforms',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingOfficeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Locales',
    path: '/shops',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingOfficeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Productos',
    path: '/products',
    icon: (
      <SvgIcon fontSize="small">
        <ArchiveBoxIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Listas',
    path: '/lists',
    icon: (
      <SvgIcon fontSize="small">
        <QueueListIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Ciudades',
    path: '/cities',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingLibraryIcon />
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
    title: 'Roles',
    path: '/roles',
    icon: (
      <SvgIcon fontSize="small">
        <ListBulletIcon />
      </SvgIcon>
    )
  },
];
