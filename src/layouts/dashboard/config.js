import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';

export const items = [
  {
    title: "Inicio",
    path: "/",
    icon: <HomeOutlinedIcon fontSize="small" />,
  },
  {
    title: "Dashboard Local",
    path: "/local-dashboard",
    permission: "dashboard.local",
    icon: <DashboardOutlinedIcon fontSize="small" />,
  },
  {
    title: "Ventas por categoría",
    path: "/category-sales",
    permission: "dashboard.categories",
    icon: <CategoryOutlinedIcon fontSize="small" />,
  },
  {
    title: "Pedidos",
    path: "/big-orders",
    permission: "orders.view",
    icon: <AssignmentOutlinedIcon fontSize="small" />,
  },
  {
    title: "Reportes",
    path: "/exports",
    permission: "reports.view",
    icon: <SummarizeOutlinedIcon fontSize="small" />,
  },
  {
    title: "Exporte general",
    path: "/export-large",
    permission: "reports.view",
    icon: <FileDownloadOutlinedIcon fontSize="small" />,
  },
  {
    title: "Ver detalle de orden",
    path: "/order-detail",
    permission: "orders.view",
    icon: <ReceiptLongOutlinedIcon fontSize="small" />,
  },
  {
    title: "Ordenes",
    path: "/orders",
    permission: "orders.view",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
  },
  {
    title: "Órdenes faltantes",
    path: "/unregistered-orders",
    permission: "orders.view",
    icon: <ErrorOutlineOutlinedIcon fontSize="small" />,
  },
  {
    title: "Órdenes faltantes por tienda",
    path: "/unregistered-orders-by-shop",
    permission: "orders.view",
    icon: <StorefrontOutlinedIcon fontSize="small" />,
  },
  {
    title: "Grafica Comparación de meses",
    path: "/reports",
    permission: "reports.view",
    icon: <InsightsOutlinedIcon fontSize="small" />,
  },

  {
    title: "Comparar Órdenes",
    path: "/orders-comparison",
    permission: "reports.view",
    icon: <CompareArrowsOutlinedIcon fontSize="small" />,
  },
  {
    title: 'Ventas Reales',
    permission: 'real-sales.manage',
    icon: <PointOfSaleOutlinedIcon fontSize="small" />,
    subItems: [
      {
        title: 'Carga ventas reales',
        path: '/real-sales',
        permission: 'real-sales.manage',
      },
      {
        title: 'Exporte ventas reales masivo',
        path: '/real-sales-massive',
        permission: 'real-sales.manage',
      },
    ],
  },
  {
    title: "Configuración",
    icon: <SettingsOutlinedIcon fontSize="small" />,
    subItems: [
      {
        title: "Usuarios",
        path: "/customers",
        permission: "users.manage",
      },
      {
        title: "Roles y permisos",
        path: "/roles",
        permission: "roles.manage",
      },
      {
        title: "Plataformas",
        path: "/platforms",
        permission: "settings.catalogs",
      },
      {
        title: "Locales",
        path: "/shops",
        permission: "settings.catalogs",
      },
      {
        title: "Ciudades",
        path: "/cities",
        permission: "settings.catalogs",
      },
      {
        title: "Productos",
        path: "/products",
        permission: "settings.catalogs",
      },
      {
        title: "Categorías",
        path: "/categories",
        permission: "settings.catalogs",
      },
      {
        title: "Listas",
        path: "/lists",
        permission: "settings.catalogs",
      },
      {
        title: "Proveedores",
        path: "/suppliers",
        permission: "settings.catalogs",
      },
      {
        title: "Procesos",
        path: "/processes",
        permission: "processes.run",
      },
    ],
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
