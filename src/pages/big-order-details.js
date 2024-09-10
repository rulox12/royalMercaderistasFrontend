import Head from 'next/head';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { getProducts } from 'src/services/productService';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Stack,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  TableContainer,
  Typography,
  CircularProgress
} from '@mui/material';
import { getOrdersByDate } from 'src/services/orderService';
import { getBigOrder } from 'src/services/bigOrderService';
import { getShops } from 'src/services/shopService';
import { updateBigOrder } from '../services/bigOrderService';
import { getCity } from '../services/cityService';
import styles from './styles.module.css';
import * as XLSX from 'xlsx';
import { getPlatform } from '../services/platformService';

const BigOrderDetailsPage = () => {
    const router = useRouter();
    const { id, cityId } = router.query;
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState({});
    const [city, setCity] = useState({});
    const [platform, setPlatform] = useState({});
    const [shops, setShops] = useState([]);
    const [orders, setOrders] = useState([]);
    const [bigOrder, setBigOrder] = useState([]);
    const [editedQuantities, setEditedQuantities] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getBigOrderService = async () => {
      try {
        const response = await getBigOrder(id);
        await setBigOrder(response);
        console.log(response);
        return bigOrder;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const getProductsService = async () => {
      try {
        const response = await getProducts();
        if (response) {
          response.sort((a, b) => parseInt(a.position) - parseInt(b.position));
        }

        setProducts(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const getCityService = async (id) => {
      try {
        const response = await getCity(id);
        setCity(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const getOrdersService = async (date) => {
      try {
        const response = await getOrdersByDate(date, cityId, bigOrder.platformId);
        setOrders(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const getShopsService = async (platformId) => {
      try {
        const response = await getShops({ cityId, platformId});
        setShops(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

  const getPlatformService = async (platformId) => {
    try {
      const response = await getPlatform(bigOrder.platformId);
      setPlatform(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

    useEffect(() => {
      if (bigOrder && bigOrder.date && bigOrder.cityId) {
        getOrdersService(formatDate(bigOrder.date)).then(r => {
          getCityService(bigOrder.cityId).then((response) => {
            setIsLoading(false);
          });
        });
        getProductsService().then(r => {
          getShopsService(bigOrder.platformId).then(r => {
          });
        });
        getPlatformService().then(r => {});
      }
    }, [bigOrder]);

    useEffect(() => {
      getBigOrderService().then((r) => {});

      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUser(user);
      }
    }, []);

    const formatDate = (date) => {
      const newDate = new Date(date);
      const formatDate = newDate.toISOString().split('T')[0];

      return formatDate;
    };

    const renderTable = () => {
      const tableHeader = ['PRODUCTO', ...shops.map((shop) => shop.name)];
      tableHeader.push('TOTAL');
      const tableHeader2 = ['PRODUCTO', ...shops.map((shop) => shop._id)];
      const tableData = products.map((product) => {
        const rowData = [product.displayName];
        let productTotal = 0;
        tableHeader2.slice(1).forEach((shop) => {
          const order = orders.find((order) => {
            return order.order.shop._id === shop;
          });

          const detail = order
            ? order.details.find((detail) => detail.product._id === product._id)
            : null;

          const editedQuantity = editedQuantities[`${product._id}_${shop}`];
          const displayedValue =
            editedQuantity !== undefined
              ? editedQuantity
              : detail && detail.PEDI_REAL
                ? detail.PEDI_REAL
                : 0;

          productTotal += parseInt(displayedValue, 10);
          rowData.push(
            <TextField
              sx={{ p: '0px !important' }}
              type="number"
              value={displayedValue}
              onChange={(e) => handleQuantityChange(product._id, shop, e.target.value)}
              variant="outlined"
              className={`${styles['custom-textfield']}`}
              InputProps={{
                classes: {
                  input: styles['no-padding']
                }
              }}
            />
          );
        });

        rowData.push(
          <TableCell key="total" sx={{ p: '0 !important', fontWeight: 'bold !important' }}>
            {productTotal}
          </TableCell>
        );

        return rowData;
      });

      const totalRow = ['TOTAL'];
      shops.forEach((shop) => {
        const shopTotal = tableData.reduce(
          (acc, rowData) => acc + parseInt(rowData[shops.indexOf(shop) + 1], 10),
          0
        );
        totalRow.push(
          <TableCell key={`${shop._id}_total`} sx={{ p: 0, fontWeight: 'bold' }}>
            {shopTotal}
          </TableCell>
        );
      });

      return (
        <>
          <TableContainer sx={{ maxHeight: 5000 }}>
            <Table stickyHeader aria-label="">
              <TableHead>
                <TableRow sx={{ p: 0 }}>
                  {tableHeader.map((header, index) => (
                    <TableCell key={index} sx={{ p: 0, fontSize: '8px !important' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ p: 0 }}>
                {tableData.map((rowData, index) => (
                  <TableRow key={index} sx={{ p: 0 }}>
                    {rowData.map((data, dataIndex) => (
                      <TableCell key={dataIndex} sx={{ p: 0 }}>
                        {data}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      );
    };

    const handleExportToExcel = () => {
      const wsData = [
        ['PRODUCTO', ...shops.map(shop => shop.name), 'TOTAL'],
        ...products.map(product => {
          const row = [
            product.displayName,
            ...shops.map(shop => {
              const order = orders.find(order => order.order.shop._id === shop._id);
              const detail = order
                ? order.details.find(detail => detail.product._id === product._id)
                : null;
              const editedQuantity = editedQuantities[`${product._id}_${shop._id}`];
              const value = editedQuantity !== undefined
                ? editedQuantity
                : detail && detail.PEDI_REAL
                  ? detail.PEDI_REAL
                  : '';
              return value === 0 ? '' : value;
            })
          ];
          const productTotal = row.slice(1).reduce((acc, qty) => acc + (parseInt(qty, 10) || 0), 0);
          row.push(productTotal === 0 ? '' : productTotal);
          return row;
        })
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Format cells as numbers where applicable
      ws['!cols'] = wsData[0].map(() => ({ wpx: 100 }));
      wsData.slice(1).forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (colIndex > 0) { // Skip the first column (product name)
            const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
            if (!ws[cellAddress]) {
              ws[cellAddress] = { t: 'n', v: parseInt(cell, 10) || '' };
            }
          }
        });
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Productos');

      let orderDate = new Date(bigOrder.date);
      let year = orderDate.getUTCFullYear();
      let month = String(orderDate.getUTCMonth() + 1).padStart(2, '0'); // `getUTCMonth()` devuelve un valor basado en cero
      let day = String(orderDate.getUTCDate()).padStart(2, '0');
      let dateOnly = `${year}-${month}-${day}`;
      const fileName = 'BigOrder' + '-' + city.name + '-' + dateOnly;
      XLSX.writeFile(wb, fileName + '.xlsx');
    };

    const handleQuantityChange = (productId, shopId, value) => {
      setEditedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [`${productId}_${shopId}`]: parseInt(value, 10) || 0
      }));
    };

    const handleSave = async () => {
      try {
        const query = {
          bigOrderId: id,
          products: editedQuantities,
          userId: user._id
        };
        const response = await updateBigOrder(query);
        if (response?.status === 201) {
          window.alert(response.message);
        } else {
          window.alert('Ocurrio un error' + response?.status);
        }
      } catch (error) {
        window.alert('Ocurrio un error');
      }
    };

    const options = {
      timeZone: 'UTC',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return (
      <>
        {isLoading ? (
          <Typography variant="h4" align="center">
            <CircularProgress/>
          </Typography>
        ) : (
          <>
            <Head>
              <title>Pedidos</title>
            </Head>
            <Typography variant="h4" align="center">
              {city.name + ` - ${platform?.name} - ` + new Date(bigOrder.date).toLocaleDateString('es-CO', options)}
            </Typography>
            <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
              <Container maxWidth="xl">
                <Stack spacing={0}>
                  <Card>
                    <CardContent sx={{ pt: 0 }}>
                      {renderTable()}
                      <br></br>
                      <Button variant="contained" color="success" onClick={handleSave}>
                        Guardar
                      </Button>
                      <Button variant="contained" color="primary" onClick={handleExportToExcel}>
                        Exportar a Excel
                      </Button>
                    </CardContent>
                  </Card>
                </Stack>
              </Container>
            </Box>
          </>
        )}
      </>
    );
  }
;

BigOrderDetailsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BigOrderDetailsPage;
