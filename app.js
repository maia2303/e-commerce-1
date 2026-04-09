//importamos la dependencia
const express = require('express');

//instanciamos la app
const app = express();

//decimos en donde van a estar los estilos a usar
app.use(express.static("assets"));

const port = 3000;

//ruta raíz
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("pages/index")
})

//ur2 rutas

app.get("/cart", (req, res) => {
    res.render("pages/cart");
});

app.get("/checkout", (req, res) => {
    res.render("pages/checkout");
});

app.get("/login", (req, res) => {
    res.render("pages/login");
});

app.get("/product", (req, res) => {
    res.render("pages/product");
});

app.get("/register", (req, res) => {
    res.render("pages/register");
});

//iniciar el servidor
app.listen(port, () => {
    console.log(`App funcionando en el puerto ${port}`)
});

//array de los productos (ahora estan aca, pueden ir en un archivo json)
const misProductos = 
[
    {id: 1, nombre: "whiskey Jack Daniels Honey 750ml", precio: 9500, descripcion: "Descubrí el sabor único de Jack Daniels Honey, una combinación perfecta de whiskey y miel que deleitará tu paladar. Su suave dulzura y notas de vainilla lo convierten en la elección ideal para disfrutar solo o en cocktails innovadores. Con su presentación elegante es el regalo perfecto para compartir en ocasiones especiales o simplemente para darte un gusto. ¡No esperes más! Comprá ahora y llevá el sabor inconfundible de Jack Daniels Honey a tu hogar.", imagen: "/public/img/whiskey.jpg"}, 
    {id: 2, nombre: "Hamburguesa completa", precio: 3000, descripcion: "Hamburguesa de carne 100% vacuna  con jamón, queso, tomate y lechuga manteca. Un clásico para compartir en todo momento.", imagen: "/public/img/hamburguesa.jpg" },  
    {id: 3, nombre: "Chenin dulce Santa Julia", precio: 1500, descripcion: "Santa Julia Chenin Dulce Natural es un vino elaborado con uvas de la variedad Chenin Blanc. Es un vino suave y delicado, de color amarillo verdoso y aromas que recuerdan a durazno blanco, damasco, hierbas frescas y algunasnotas cítricas como limón y pomelo.Santa Julia Chenin Dulce Natural resulta ideal como aperitivo o bien para acompañar picadas, frutos de mar o postres con frutas frescas y cítricas." , imagen: "/public/img/vino.jpg"},
    {id: 4, nombre: "Wrap de ensalada caesar", precio: 1800, descripcion: "El wrap de ensalada César es una opción práctica y sabrosa que envuelve la clásica ensalada en una tortilla de harina. Combina lechuga romana crujiente, pollo (asado o empanado), queso parmesano y aderezo César cremoso, a menudo con croutones para aportar textura. Es una opción de comida rápida, portátil y versátil.", imagen: "/public/img/wrap.jpg"},
    {id: 5, nombre: "Caipiriña", precio: 1000, descripcion: "Caipiriña es una bebida brasileña, originaria del estado de São Paulo. Clasificada como un cóctel, su ingrediente principal es la cachaza, pero también lleva lima o limón, azúcar y hielo.", imagen: "/public/img/caipiriña.jpg"},
    {id: 6, nombre: "Papas Fritas con cheddar", precio: 2000, descripcion: "Calientes, crujientes y deliciosas, una nueva variedad llega para quedarse: Papas Fritas con Cheddar fundido.", imagen: "/public/img/papas.jpg"}
]
//hay que enviarlo al index
app.get("/", (req, res) => {
    res.render("index", { productos: misProductos });
});

//us5 Detalle de un pedido especifico (borro el get anterior de producto?)
app.get("producto/:id", (req,res) => {
    idProducto = req.params.id; //busca lo variable de la ulr

    //busca el id
    const productoEncontrado = misProductos.find(p => p.id == p.idProducto);

    if (productoEncontrado)
    {
        const relacionados = misProductos.filter(p => p.id != id.product)

        res.render("pages/product", {
            product: productoEncontrado,
            productosRelacionados: relacionados
        });
    }
    else
    {
        res.status(404).send("Producto no encontrado");
    }
});

//funcion para ir agregando al carrito
