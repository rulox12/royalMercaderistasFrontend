import Head from 'next/head';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { getProducts } from 'src/services/productService';
import { useState, useEffect } from 'react';
import { Box, Container, Stack, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, TextField } from '@mui/material';
import { getOrdersByDate } from 'src/services/orderService';
import { getBigOrder } from 'src/services/bigOrderService';
import { getShops } from 'src/services/shopService';

const BigOrderDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  //const [bigOrder, setBigOrder] = useState([]);
  const [editedQuantities, setEditedQuantities] = useState({});

  const getBigOrdersService = async () => {
    try {
      const response = await getBigOrder(id);
      
      return response
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  const getProductsService = async () => {
    try {
      const response = await getProducts();
      setProducts(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getOrdersService = async (date) => {
    try {
      const response = await getOrdersByDate(date);
      setOrders(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getShopsService = async () => {
    try {
      const response = await getShops();
      setShops(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProductsService();
    getShopsService();
    getBigOrdersService().then((response)=> {
      if(response && response.date ){
        getOrdersService(response.date);
      }
    })
  },[]);

 

  const renderTable = () => {
    const tableHeader = ['PRODUCTO', ...shops.map(shop => shop.name)];
    const tableHeader2 = ['PRODUCTO', ...shops.map(shop => shop._id)];
    const tableData = products.map(product => {
      const rowData = [product.displayName];
      let productTotal = 0; // Variable para almacenar la suma total del producto
      tableHeader2.slice(1).forEach(shop => {
        const order = orders.find(order => order.order.shop === shop);
        const detail = order ? order.details.find(detail => detail.product === product._id) : null;

        const editedQuantity = editedQuantities[`${product._id}_${shop}`];
        const displayedValue = editedQuantity !== undefined ? editedQuantity : (detail ? detail.PEDI_REAL : 0);

        productTotal += parseInt(displayedValue, 10); // Agrega el valor actual al total del producto

        rowData.push(
          <TextField
            type="number"
            value={displayedValue}
            onChange={(e) => handleQuantityChange(product._id, shop, e.target.value)}
            variant="outlined"
            sx={{ p: 0 }}
          />
        );
      });

      rowData.push(
        <TableCell key="total" sx={{ p: 0, fontWeight: 'bold' }}>
          {productTotal}
        </TableCell>
      );

      return rowData;
    });

    // Agrega una fila al final de la tabla que muestra la suma total por tienda
    const totalRow = ['TOTAL'];
    shops.forEach(shop => {
      const shopTotal = tableData.reduce((acc, rowData) => acc + parseInt(rowData[shops.indexOf(shop) + 1], 10), 0);
      totalRow.push(
        <TableCell key={`${shop._id}_total`} sx={{ p: 0, fontWeight: 'bold' }}>
          {shopTotal}
        </TableCell>
      );
    });


    return (
      <Table>
        <TableHead>
          <TableRow>
            {tableHeader.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((rowData, index) => (
            <TableRow key={index} sx={{ pt: 0 }}>
              {rowData.map((data, dataIndex) => (
                <TableCell key={dataIndex} sx={{ p: 1 }}>{data}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const handleQuantityChange = (productId, shopId, value) => {
    
    setEditedQuantities(prevQuantities => ({
      ...prevQuantities,
      [`${productId}_${shopId}`]: parseInt(value, 10) || 0,
    }));
  };

  const handleSave = () => {
    console.log('Cantidades editadas:', editedQuantities);
  };

  return (
    <>
      <Head>
        <title>Listas</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={2}>
            <Card>
              <CardContent sx={{ pt: 0 }}>
                {renderTable()}
                <button onClick={handleSave}>Guardar</button>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};


BigOrderDetailsPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default BigOrderDetailsPage;