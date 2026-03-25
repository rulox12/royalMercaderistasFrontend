import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Scrollbar } from 'src/components/scrollbar';
import { deleteCategory, addProductToCategory, removeProductFromCategory } from 'src/services/categoryService';

export const CategoriesTable = ({ items = [], allProducts = [], onRefresh }) => {
  const [selectedProduct, setSelectedProduct] = useState({});

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
          {items.map((category) => {
            const availableProducts = allProducts.filter(
              (p) => !assignedProductIds.has(String(p._id))
            );

            return (
              <Accordion key={category._id} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', pr: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {category.name}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category._id); }}
                    >
                      Eliminar categoría
                    </Button>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    {/* Agregar producto */}
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

                    {/* Lista de productos en la categoría */}
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
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Scrollbar>
    </Card>
  );
};
