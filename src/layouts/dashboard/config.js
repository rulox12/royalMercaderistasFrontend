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

export const items = [
  {
    title: "Inicio",
    path: "/",
    icon: <HomeOutlinedIcon fontSize="small" />,
  },
  {
    title: "Dashboard Local",
    path: "/local-dashboard",
    icon: <DashboardOutlinedIcon fontSize="small" />,
  },
  {
    title: "Pedidos",
    path: "/big-orders",
    icon: <AssignmentOutlinedIcon fontSize="small" />,
  },
  {
    title: "Reportes",
    path: "/exports",
    icon: <SummarizeOutlinedIcon fontSize="small" />,
  },
  {
    title: "Exporte general",
    path: "/export-large",
    icon: <FileDownloadOutlinedIcon fontSize="small" />,
  },
  {
    title: "Ver detalle de orden",
    path: "/order-detail",
    icon: <ReceiptLongOutlinedIcon fontSize="small" />,
  },
  {
    title: "Ordenes",
    path: "/orders",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
  },
  {
    title: "Órdenes faltantes",
    path: "/unregistered-orders",
    icon: <ErrorOutlineOutlinedIcon fontSize="small" />,
  },
  {
    title: "Órdenes faltantes por tienda",
    path: "/unregistered-orders-by-shop",
    icon: <StorefrontOutlinedIcon fontSize="small" />,
  },
  {
    title: "Grafica Comparación de meses",
    path: "/reports",
    icon: <InsightsOutlinedIcon fontSize="small" />,
  },
  {
    title: "Comparar Órdenes",
    path: "/orders-comparison",
    icon: <CompareArrowsOutlinedIcon fontSize="small" />,
  },
  {
    title: "Configuración",
    icon: <SettingsOutlinedIcon fontSize="small" />,
    subItems: [
      {
        title: "Usuarios",
        path: "/customers",
      },
      {
        title: "Plataformas",
        path: "/platforms",
      },
      {
        title: "Locales",
        path: "/shops",
      },
      {
        title: "Ciudades",
        path: "/cities",
      },
      {
        title: "Productos",
        path: "/products",
      },
      {
        title: "Categorías",
        path: "/categories",
      },
      {
        title: "Listas",
        path: "/lists",
      },
      {
        title: "Proveedores",
        path: "/suppliers",
      },
      {
        title: "Procesos",
        path: "/processes",
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
