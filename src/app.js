import express from 'express';
import { __dirname } from './utils.js'
import { productManager } from './ProductManager.js';
import productsRouter from './routes/products.router.js'; 
import cartRouter from './routes/cart.router.js'; 
import viewsRouter from './routes/views.router.js' 
import handlebars from 'express-handlebars'
import { Server } from 'socket.io' 


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


app.use('/api/views', viewsRouter)
app.use('api/views/delete/:id', viewsRouter)



app.get('/', (req, res) => {
  res.send('¡Bienvenidos!');
});

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

const PORT = 8080

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`)
})

const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
  console.log('Cliente conectado', socket.id);
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado`);
  });

  socket.on('addProduct', (newProduct) => {
    const addedProduct = productManager.addProduct(newProduct);
    socketServer.emit('addProduct', addedProduct); 
  });

  socket.on('deleteProduct', (productId) => {
    productManager.deleteProduct(Number(productId));
    socketServer.emit('productDeleted', productId); 
    socketServer.emit('updateProductList'); 
  });
});

