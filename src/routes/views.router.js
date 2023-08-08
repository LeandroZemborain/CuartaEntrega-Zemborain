import { Router } from "express";
import { productManager } from "../ProductManager.js";

const router = Router();


router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de productos' });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el listado de productos' });
    }
});

router.delete('/api/views/delete/:id', async (req, res) => {
    const productId = parseInt(req.params.id);

    try {
        const deletedProduct = await productManager.deleteProduct(productId);
    if (deletedProduct) {
      socketServer.emit('deleteProduct', productId);
      res.status(200).json({ message: `Producto ID ${productId} eliminado.` });
    } else {
      res.status(404).json({ error: `No se encontró producto con el ID ${productId}.` });
    }
    } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
});
  

export default router;
