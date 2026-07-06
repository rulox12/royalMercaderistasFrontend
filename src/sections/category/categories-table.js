import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Scrollbar } from 'src/components/scrollbar';
import { deleteCategory, addProductToCategory, removeProductFromCategory, updateCategory } from 'src/services/categoryService';

export const CategoriesTable = ({ items = [], allProducts = [], onRefresh }) => {
  const [selectedProduct, setSelectedProduct] = useState({});
  const [updatingCategoryId, setUpdatingCategoryId] = useState('');
  const [openCategories, setOpenCategories] = useState({});

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('¿Eliminar esta categoría? Los productos quedarán sin categoría.')) return;
    try {
      await deleteCategory(categoryId);
      onRefresh();
    } catch {
      window.alert('Error al eliminar categoría');
    }
  };

  const handleAddProduct = async (categoryId) => {
    const productId = selectedProduct[categoryId];
    if (!productId) return;
    try {
      await addProductToCategory(categoryId, productId);
      setSelectedProduct((prev) => ({ ...prev, [categoryId]: '' }));
      onRefresh();
    } catch {
      window.alert('Error al agregar producto');
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (!window.confirm('¿Quitar este producto de la categoría?')) return;
    try {
      await removeProductFromCategory(productId);
      onRefresh();
    } catch {
      window.alert('Error al quitar producto');
    }
  };

  const handleToggleGroupForSale = async (categoryId, groupForSale) => {
    setUpdatingCategoryId(categoryId);
    try {
      await updateCategory(categoryId, { groupForSale });
      onRefresh();
    } catch {
      window.alert('Error al actualizar la categoría');
    } finally {
      setUpdatingCategoryId('');
    }
  };

  const toggleCategoryOpen = (categoryId) => {
    setOpenCategories((previous) => ({
      ...previous,
      [categoryId]: !previous[categoryId],
    }));
  };

  // Productos que ya tienen categoría asignada
  const assignedProductIds = new Set(
    items.flatMap((cat) => (cat.products || []).map((p) => String(p._id)))
  );

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ p: 2 }}>
          {items.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No hay categorías creadas.
            </Typography>
          )}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="center">Agrupar para venta</TableCell>
                <TableCell align="center">Productos</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((category) => {
                const availableProducts = allProducts.filter(
                  (p) => !assignedProductIds.has(String(p._id))
                );
                const isOpen = Boolean(openCategories[category._id]);

                return (
                  <>
                    <TableRow key={category._id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1" fontWeight={600}>
                            {category.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={category.groupForSale === false ? 'Sin agrupar' : 'Agrupar'}
                            color={category.groupForSale === false ? 'default' : 'primary'}
                            variant={category.groupForSale === false ? 'outlined' : 'filled'}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={(
                            <Switch
                              checked={category.groupForSale !== false}
                              disabled={updatingCategoryId === category._id}
                              onChange={(_, checked) => handleToggleGroupForSale(category._id, checked)}
                            />
                          )}
                          label=""
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => toggleCategoryOpen(category._id)}
                        >
                          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Eliminar categoría
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} sx={{ py: 0, borderBottom: 0 }}>
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 2 }}>
                            <Stack spacing={2}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <FormControl size="small" sx={{ minWidth: 280 }}>
                                  <InputLabel>Agregar producto</InputLabel>
                                  <Select
                                    value={selectedProduct[category._id] || ''}
                                    label="Agregar producto"
                                    onChange={(e) =>
                                      setSelectedProduct((prev) => ({ ...prev, [category._id]: e.target.value }))
                                    }
                                  >
                                    {availableProducts.map((p) => (
                                      <MenuItem key={p._id} value={p._id}>
                                        {p.displayName || p.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                                <Button
                                  variant="contained"
                                  size="small"
                                  disabled={!selectedProduct[category._id]}
                                  onClick={() => handleAddProduct(category._id)}
                                >
                                  Agregar
                                </Button>
                              </Stack>

                              {(category.products || []).length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                  Sin productos en esta categoría.
                                </Typography>
                              ) : (
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Nombre</TableCell>
                                      <TableCell>Presentación</TableCell>
                                      <TableCell>Proveedor</TableCell>
                                      <TableCell>Acción</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {category.products.map((product) => (
                                      <TableRow key={product._id}>
                                        <TableCell>{product.displayName || product.name}</TableCell>
                                        <TableCell>{product.presentation}</TableCell>
                                        <TableCell>
                                          {product.supplierId?.name || '—'}
                                        </TableCell>
                                        <TableCell>
                                          <Button
                                            size="small"
                                            color="warning"
                                            variant="outlined"
                                            onClick={() => handleRemoveProduct(product._id)}
                                          >
                                            Quitar
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
                            </Stack>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};
