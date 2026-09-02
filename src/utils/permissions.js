export const PERMISSIONS = [
  { value: 'dashboard.local', label: 'Dashboard Local' },
  { value: 'dashboard.categories', label: 'Dashboard Categorías' },
  { value: 'orders.view', label: 'Órdenes' },
  { value: 'reports.view', label: 'Reportes' },
  { value: 'real-sales.manage', label: 'Ventas Reales' },
  { value: 'users.manage', label: 'Usuarios' },
  { value: 'roles.manage', label: 'Roles y permisos' },
  { value: 'settings.catalogs', label: 'Catálogos' },
  { value: 'processes.run', label: 'Procesos' },
];

export const ALL_PERMISSION_VALUES = PERMISSIONS.map((permission) => permission.value);

const normalizeRoleName = (name = '') => String(name)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase();

export const isAdminRole = (role) => ['admin', 'administrador'].includes(normalizeRoleName(role?.name));

export const getUserPermissions = (user) => {
  const role = user?.roleId;

  if (isAdminRole(role)) {
    return ALL_PERMISSION_VALUES;
  }

  return Array.isArray(role?.permissions) ? role.permissions : [];
};

export const hasPermission = (user, permission) => {
  if (!permission) {
    return true;
  }

  return getUserPermissions(user).includes(permission);
};

const pathPermissions = [
  { path: '/local-dashboard', permission: 'dashboard.local' },
  { path: '/category-sales', permission: 'dashboard.categories' },
  { path: '/big-orders', permission: 'orders.view' },
  { path: '/big-order-details', permission: 'orders.view' },
  { path: '/orders', permission: 'orders.view' },
  { path: '/order-detail', permission: 'orders.view' },
  { path: '/unregistered-orders', permission: 'orders.view' },
  { path: '/unregistered-orders-by-shop', permission: 'orders.view' },
  { path: '/exports', permission: 'reports.view' },
  { path: '/export-large', permission: 'reports.view' },
  { path: '/reports', permission: 'reports.view' },
  { path: '/orders-comparison', permission: 'reports.view' },
  { path: '/platform-comparison-page', permission: 'reports.view' },
  { path: '/real-sales', permission: 'real-sales.manage' },
  { path: '/real-sales-massive', permission: 'real-sales.manage' },
  { path: '/customers', permission: 'users.manage' },
  { path: '/roles', permission: 'roles.manage' },
  { path: '/settings', permission: 'settings.catalogs' },
  { path: '/companies', permission: 'settings.catalogs' },
  { path: '/platforms', permission: 'settings.catalogs' },
  { path: '/shops', permission: 'settings.catalogs' },
  { path: '/cities', permission: 'settings.catalogs' },
  { path: '/products', permission: 'settings.catalogs' },
  { path: '/categories', permission: 'settings.catalogs' },
  { path: '/lists', permission: 'settings.catalogs' },
  { path: '/lists-products', permission: 'settings.catalogs' },
  { path: '/suppliers', permission: 'settings.catalogs' },
  { path: '/processes', permission: 'processes.run' },
];

export const getPathPermission = (pathname) => {
  const route = pathPermissions.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));
  return route?.permission || null;
};

export const canAccessPath = (user, pathname) => hasPermission(user, getPathPermission(pathname));
