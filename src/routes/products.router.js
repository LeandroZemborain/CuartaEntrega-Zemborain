import { Router } from "express";
import { productManager } from '../ProductManager.js'

const router = Router()


router.get('/', async (req, res) => {

    try {
      const products = await productManager.getProducts()
      const limit = +req.query.limit
      const prodLimit = products.slice(0,limit)
      if (!limit) {
        res.status(200).json({ message: 'Productos totales', products })
      }else{
        res.status(200).json({ message: 'Listado productos limitado', prodLimit })
      }
    } catch (error) {
      res.status(500).json({ error })
    }
  })
  
  router.get('/:pid', async (req, res) => {
    const { pid } = req.params
    try {
      const product = await productManager.getProductById(+pid)
      if(!product){
        res.status(200).json({message: "Producto no encontrado"})
      }else{
        res.status(200).json({ message: 'Producto encontrado', product })
      }
    } catch (error) {
      res.status(500).json({ error })
    }
  })
  
  router.post('/', async (req, res) => {
    try {
      const { title, description, code, price, stock, category, thumbnails } = req.body;
      const producto = {
        title,
        description,
        code,
        price,
        status: true, // Siguiendo el requerimiento se aplica el status TRUE por defecto
        stock: stock,
        category,
        thumbnails: thumbnails ? thumbnails.split(',') : [], 
      };
        const respuesta = await productManager.addProduct(producto);
        res.send("producto agregado", respuesta);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
  });
  
  router.put('/:pid', async (req, res) => {
    try {
        const pid = +req.params.pid;
        const producto = req.body;
        const respuesta = await productManager.updateProduct(pid, producto);
        res.send("guardado con exito", respuesta);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
  });
  
  router.delete('/:pid', async (req, res) => {
    try {
        const pid = +req.params.pid;
        const respuesta = await productManager.deleteProduct(pid);
        res.send("eliminado con exito", respuesta);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
  })


export default router