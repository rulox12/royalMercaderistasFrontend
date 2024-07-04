import Head from "next/head";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Button from "@mui/material/Button";
import { getProducts } from "src/services/productService";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Stack,
  Card,
  CardContent,
  TextField,
  Snackbar,
  Typography,
} from "@mui/material";
import { createListProduct, getAllProductsForListId } from "src/services/listService";
import { getList } from "../services/listService";

const ListProductsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [products, setProducts] = useState([]);
  const [list, setList] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const getProductsService = async () => {
    try {
      const response = await getProducts();
      setProducts(response);
      const initialList = response.map((product) => ({
        productId: product._id,
        cost: "",
        salePrice: "",
        pvp: "",
      }));
      setListItems(initialList);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getListService = async (id) => {
    try {
      const response = await getList(id);
      setList(response);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const fetchProductsForListId = async (listId) => {
    try {
      const productList = await getAllProductsForListId(listId);
      return productList;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    return [];
  };

  const setDefaultValues = (productList) => {
    const updatedItems = products.map((product) => {
      const foundProduct = productList.find((item) => item.productId._id === product._id);

      return {
        productId: product._id,
        cost: (foundProduct && foundProduct.cost) || "",
        salePrice: (foundProduct && foundProduct.salePrice) || "",
        pvp: (foundProduct && foundProduct.pvp) || "",
      };
    });

    setListItems(updatedItems);
  };

  useEffect(() => {
    getListService(id)
    getProductsService().then(() => {
      if (dataLoaded && id) {
        fetchProductsForListId(id)
          .then((productList) => {
            setDefaultValues(productList);
          })
          .catch((error) => {
            console.error("Error fetching products for list:", error);
          });
      }
    });
  }, [dataLoaded, id]);

  const handleEditItem = (index, field, value) => {
    const updatedItems = [...listItems];
    updatedItems[index][field] = value;
    setListItems(updatedItems);
  };

  const handleSaveList = async () => {
    try {
      const filteredProducts = listItems.filter((item) => {
        return item.cost !== "" || item.salePrice !== "" || item.pvp !== "";
      });

      const response = await createListProduct(id, filteredProducts);
      if (response) {
        setShowAlert(true);
      }
    } catch (e) {
      console.log(e.response.data.message);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <Head>
        <title>Listas</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Typography variant="h4" align="center" sx={{
          position: 'sticky',
          top: 50,
          backgroundColor: 'white',
          zIndex: 1000,
          width: '100%',
          padding: '15px 0',
        }}>
          {list.name}
        </Typography>
        <br></br>
        <Container maxWidth="xl">
          <Stack spacing={2}>
            <Card>
              <CardContent sx={{ pt: 2 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Costo</th>
                      <th>Venta</th>
                      <th>PVP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listItems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <TextField
                            size="small"
                            id="productId"
                            disabled
                            value={products[index]?.name}
                            onChange={(e) => handleEditItem(index, "productId", e.target.value)}
                          />
                        </td>
                        <td>
                          <TextField
                            size="small"
                            value={item.cost}
                            onChange={(e) => handleEditItem(index, "cost", e.target.value)}
                          />
                        </td>
                        <td>
                          <TextField
                            size="small"
                            value={item.salePrice}
                            onChange={(e) => handleEditItem(index, "salePrice", e.target.value)}
                          />
                        </td>
                        <td>
                          <TextField
                            size="small"
                            value={item.pvp}
                            onChange={(e) => handleEditItem(index, "pvp", e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="contained" onClick={handleSaveList}>
                Guardar Lista
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        message="Guardado correctamente"
      />
    </>
  );
};

ListProductsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ListProductsPage;
