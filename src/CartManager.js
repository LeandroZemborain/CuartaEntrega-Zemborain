import fs from "fs"
import {productManager} from './ProductManager.js'

class CartManager{
    constructor(path){
        this.path = path
    }

    async getCart() {
        try {
            if (fs.existsSync(this.path)) {
                const productos = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(productos);
            } else {
                return [];
            }

        } catch (error) {
            return error;
        }
    }

    async getOneCart(id) {
        try {
            const carts = await this.getCart();
            console.log(carts)
            const cart = carts.find((c) => c.id === id);
            //console.log(cart);
            if (!cart) {
                return 'Carrito no ha sido encontrado';
            } else {
                return cart;
            }
        } catch (error) {
            return error;
        }
    }

    async createCart() {
        try{
            const carritos = await this.getCart();
            const arrayCarrito = [];

            let id;
            if(carritos.length === 0){
                id = 1;
            } else {
                id = carritos[carritos.length - 1].id + 1;
            }

            const newCarrito = { id, products: arrayCarrito };

            carritos.push(newCarrito);
            const carritosString = JSON.stringify(carritos);
            await fs.promises.writeFile(this.path, carritosString);

            return newCarrito;

        } catch (error) {
            return error;
        }
    }

    async addProductToCart (cid, pid) {
        try{
            
            const carritos = await cartManager.getCart();
            const carrito = carritos.find(c => c.id === +cid);
            const productos = await productManager.getProducts();
            const producto = productos.find(p => p.id === +pid);
            if(!carrito){
                return 'Carrito no encontrado';
            }
            if(!producto){
                return 'Producto no encontrado';
            }
            carrito.products.push(producto.title)
            await fs.promises.writeFile(this.path, JSON.stringify(carritos));
            return "Producto agregado al carrito"
        } catch (error) {
            return error;
        }
    
    }

}
    

export const cartManager = new CartManager("cart.json")
