//importamos la dependencia
const express = require('express');

//instanciamos la app
const app = express();

//decimos en donde van a estar los estilos a usar
app.use(express.static("public"));

//"traductor" de los datos que se envian desde el formulario al servidor
app.use(express.urlencoded({extended: false}));

//traductor para que javascript lea los datos json (del formulario checkout)
app.use(express.json());

const port = 3000;

app.set("view engine", "ejs");


//ur2 rutas

app.get("/cart", (req, res) => {
    res.render("pages/cart");
});

app.get("/checkout", (req, res) => {
    res.render("pages/checkout");
});

//iniciar el servidor
app.listen(port, () => {
    console.log(`App funcionando en el puerto ${port}`)
});

//DATOS
//array de los productos (ahora estan aca, pueden ir en un archivo json)
const misProductos = 
[
    {
        id: 1, 
        nombre: "whiskey Jack Daniels Honey 750ml", 
        precio: 9500, 
        descripcion: "Descubrí el sabor único de Jack Daniels Honey, una combinación perfecta de whiskey y miel que deleitará tu paladar. Su suave dulzura y notas de vainilla lo convierten en la elección ideal para disfrutar solo o en cocktails innovadores. Con su presentación elegante es el regalo perfecto para compartir en ocasiones especiales o simplemente para darte un gusto. ¡No esperes más! Comprá ahora y llevá el sabor inconfundible de Jack Daniels Honey a tu hogar.", 
        categoria: "Bebidas", 
        imagen: "/img/whiskey.jpg"
    }, 
    {
        id: 2, 
        nombre: "Hamburguesa completa", 
        precio: 3000, 
        descripcion: "Hamburguesa de carne 100% vacuna  con jamón, queso, tomate y lechuga manteca. Un clásico para compartir en todo momento.", 
        categoria: "Comidas", 
        imagen: "/img/hamburguesa.jpg" 
    },  
    {
        id: 3, 
        nombre: "Chenin dulce Santa Julia", 
        precio: 1500, 
        descripcion: "Santa Julia Chenin Dulce Natural es un vino elaborado con uvas de la variedad Chenin Blanc. Es un vino suave y delicado, de color amarillo verdoso y aromas que recuerdan a durazno blanco, damasco, hierbas frescas y algunasnotas cítricas como limón y pomelo.Santa Julia Chenin Dulce Natural resulta ideal como aperitivo o bien para acompañar picadas, frutos de mar o postres con frutas frescas y cítricas." , 
        imagen: "/img/vino.jpg", 
        categoria: "Bebidas"
    },
    {id: 4, nombre: "Wrap de ensalada caesar", precio: 1800, descripcion: "El wrap de ensalada César es una opción práctica y sabrosa que envuelve la clásica ensalada en una tortilla de harina. Combina lechuga romana crujiente, pollo (asado o empanado), queso parmesano y aderezo César cremoso, croutones para aportar textura. Es una opción de comida rápida, portátil y versátil.", imagen: "/img/wrap.jpg", categoria: "Comidas"},
    {id: 5, nombre: "Caipiriña", precio: 1000, descripcion: "Caipiriña es una bebida brasileña, originaria del estado de São Paulo. Clasificada como un cóctel, su ingrediente principal es la cachaza, pero también lleva lima o limón, azúcar y hielo.", imagen: "/img/caipiriña.jpg", categoria: "Cocteles"},
    {id: 6, nombre: "Papas Fritas con cheddar", precio: 2000, descripcion: "Calientes, crujientes y deliciosas, una nueva variedad llega para quedarse: Papas Fritas con Cheddar fundido.", imagen: "/img/papas.jpg", categoria: "Comidas"}
]

//array de usuarios
const usuario = [
    {nombreU: "Lucia", email: "lucia123@email.com", password: "lucia1234"}
];

app.get("/register", (req, res) => {  
    res.render("pages/register");
});
app.post("/register", (req, res) => {
    const usuarioEncontrado = usuario.find(u => u.email === req.body.email);
    if(usuarioEncontrado){
        res.redirect("/login"); 
    } else {
        const nuevoUsuario = {nombreU: req.body.nombreU, email: req.body.email, password: req.body.password};
        usuario.push(nuevoUsuario);
    }
    res.redirect("/login"); 
});
app.get("/login", (req, res) => {
    res.render("pages/login");
});
app.post("/login", (req, res) => {
    const usuarioExiste = usuario.find(u => u.email === req.body.email && u.password === req.body.password);
    if(usuarioExiste){
        res.redirect("/")
    } else {
        res.redirect("/login");
    }
});

//CARRITO

let porcentajeDescuento = 0; // Se actualiza cuando alguien usa la ruta /cart/coupon

app.get("/cart", (req, res) => {
    //Calculamos el subtotal dinámicamente cada vez que se carga la página
    let subtotal = cart.reduce((acumulador, producto) => {
        return acumulador + (producto.precio * producto.quantity);
    }, 0);

    //Calculamos cuánto es el descuento en dinero
    let descuentoPesos = subtotal * (porcentajeDescuento / 100);

    //El total final que va a pagar
    let totalFinal = subtotal - descuentoPesos;

    //Enviamos todo a la vista
    res.render("pages/cart", {
        cart: cart,
        total: totalFinal,
        descuento: porcentajeDescuento,
        subtotal: subtotal 
    });
});

//PRODUCTO
//us5 Detalle de un pedido especifico
app.get("/product/:id", (req,res) => {
    idProducto = req.params.id; //busca lo variable de la ulr

    //busca el id
    const productoEncontrado = misProductos.find(p => p.id == idProducto);

    if (productoEncontrado)
    {
        const relacionados = misProductos.filter(p => p.id != idProducto)
        const cat = misProductos.map(p => p.categoria);
        const categoriasBarra = [...new Set(cat)];

        res.render("pages/product", {
            product: productoEncontrado,
            productosRelacionados: relacionados,
            categorias: categoriasBarra
        });
    }
    else
    {
        res.status(404).send("Producto no encontrado");
    }
});

//cuando se toca una categoria, manda al index pero filtrado

app.get("/productos/categoria/:nombre", (req, res) => {
    const categoriaElegida = req.params.nombre;

    const productosFiltrados = misProductos.filter(p => p.categoria == categoriaElegida);

    //Generamos de nuevo la lista para la barra (para que no desaparezca)
    const cat = misProductos.map(p => p.categoria);
    const categoriasBarra = [...new Set(cat)];

    //Reutilizamos el index.ejs
    res.render("pages/index", {
        productos: productosFiltrados,
        categorias: categoriasBarra
    });
});



//funcion para ir agregando al carrito



