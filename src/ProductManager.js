import fs from "fs"

class ProductManager{
    constructor(path){
        this.path = path
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
              const infoArchivo = await fs.promises.readFile(this.path, 'utf-8')
              return JSON.parse(infoArchivo)
            } else {
              return []
            }
          } catch (error) {
            return error
          }
    }
    async addProduct(obj){
        try {
            const productPrev = await this.getProducts()
            let id
            if (!productPrev.length) {
              id = 1
            } else {
              id = productPrev[productPrev.length - 1].id + 1
            }
            productPrev.push({ ...obj, id })
            await fs.promises.writeFile(this.path, JSON.stringify(productPrev))
          } catch (error) {
            return error
          }
    }
    async getProductById(id){
        try {
            const productPrev = await this.getProducts()
            console.log(productPrev);
            const producto = productPrev.find((p) => p.id === id)
            if (!producto) {
              return console.log("Id de producto no encontrado")
            }
            console.log("Producto encontrado:", producto)
            return producto 
          } catch (error) {
            return error
          }
    }
    async updateProduct(id, obj){
        try {
            const productPrev = await this.getProducts()
            const productoIndex = productPrev.findIndex((p) => p.id === id)
            if (productoIndex === -1) {
              return 'No hay un producto con ese id'
            }
            const producto = productPrev[productoIndex]
            productPrev[productoIndex] = { ...producto, ...obj }
            await fs.promises.writeFile(this.path, JSON.stringify(productPrev))
          } catch (error) {
            return error
          }
    }
    async deleteProduct(id){
        try {
            const productPrev = await this.getProducts()
            const nuevoArregloProd = productPrev.filter((p) => p.id !== id)
            await fs.promises.writeFile(
              this.path,
              JSON.stringify(nuevoArregloProd)
            )
          } catch (error) {
            return error
          }
    }
}

export const productManager = new ProductManager("products.json")





