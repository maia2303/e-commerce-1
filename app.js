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
        nombre: "Whiskey Jack Daniels Honey 750ml", 
        precio: 9500, 
        descripcion: "Descubrí el sabor único de Jack Daniels Honey, una combinación perfecta de whiskey y miel que deleitará tu paladar. Su suave dulzura y notas de vainilla lo convierten en la elección ideal para disfrutar solo o en cocktails innovadores. Con su presentación elegante es el regalo perfecto para compartir en ocasiones especiales o simplemente para darte un gusto.", 
        categoria: "Bebidas", 
        imagen: "/img/whiskey.jpg"
    }, 
    {
        id: 2, 
        nombre: "Hamburguesa completa", 
        precio: 3000, 
        descripcion: "Hamburguesa de carne 100% vacuna de primera calidad con jamón, queso fundido, tomate fresco y lechuga manteca. Un clásico para compartir en todo momento que satisfará los paladares más exigentes. Preparada al momento con ingredientes seleccionados, esta hamburguesa es perfecta para una comida rápida pero de excelente calidad. Ideal para disfrutar con amigos y familia.", 
        categoria: "Comidas", 
        imagen: "/img/hamburguesa.jpg" 
    },  
    {
        id: 3, 
        nombre: "Chenin dulce Santa Julia", 
        precio: 1500, 
        descripcion: "Santa Julia Chenin Dulce Natural es un vino elaborado con uvas de la variedad Chenin Blanc cultivadas en los viñedos mendocinos. Es un vino suave y delicado, de color amarillo verdoso y aromas que recuerdan a durazno blanco, damasco, hierbas frescas y algunas notas cítricas como limón y pomelo.", 
        imagen: "/img/vino.jpg", 
        categoria: "Bebidas"
    },
    {id: 4, nombre: "Wrap de ensalada caesar", precio: 1800, descripcion: "El wrap de ensalada César es una opción práctica y sabrosa que envuelve la clásica ensalada en una tortilla de harina integral o blanca. Combina lechuga romana crujiente, pollo asado tierno, queso parmesano rallado y aderezo César cremoso artesanal, acompañado de croutones para aportar textura. Es una opción de comida rápida, portátil y versátil, perfecta para llevar. Ideal para quienes buscan una alternativa saludable sin sacrificar el sabor.", imagen: "/img/wrap.jpg", categoria: "Comidas"},
    {id: 5, nombre: "Caipiriña", precio: 1000, descripcion: "Caipiriña es una bebida brasileña refrescante, originaria del estado de São Paulo. Clasificada como un cóctel, su ingrediente principal es la cachaza de calidad premium, pero también lleva lima o limón fresco, azúcar de caña y hielo picado. Esta combinación crea una bebida tropical perfecta para días calurosos y celebraciones.", imagen: "/img/caipiriña.jpg", categoria: "Cocteles"},
    {id: 6, nombre: "Papas Fritas con cheddar", precio: 2000, descripcion: "Calientes, crujientes y deliciosas, una nueva variedad llega para quedarse: Papas Fritas con Cheddar fundido que se derrite en cada bocado. Preparadas con papas de primera calidad y cortadas al grosor perfecto para mantener su textura ideal. El cheddar es derretido artesanalmente para garantizar una cobertura uniforme y un sabor irresistible. Perfectas como acompañamiento o para disfrutar como snack principal.", imagen: "/img/papas.jpg", categoria: "Comidas"}
]

//array de usuarios
const usuario = [
    {nombreU: "Lucia", email: "lucia123@email.com", password: "lucia1234"}
];

let cart = [];


//us2 rutas

//CHECKOUT
app.get("/checkout", (req, res) => {
    res.render("pages/checkout");
});

//INDEX
app.get("/", (req, res) => {
    //Extraer categorias
    const cat = misProductos.map(p => p.categoria);
    //para que no haya repetidos (set) y convertir en array
    const categoriasBarra = [...new Set(cat)];

    res.render("pages/index", {
        productos: misProductos,
        categorias: categoriasBarra
    });
});

//REGISTER
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

//LOGIN
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

app.post("/agregar-carrito", (req, res) => {
const id = req.body.idProducto;

//buscar producto
const productoCarrito = misProductos.find(p => p.id == id);

if (productoCarrito) {
        productoCarrito.quantity = 1;
        cart.push(productoCarrito);
        console.log("Carrito actual:", cart); // Esto para ver en la terminal si se guarda
        
        // Redirigimos a la misma página agregando ?success=true a la URL
        res.redirect(`/product/${id}?success=true`);
    } else {
        res.status(404).send("No se pudo agregar el producto");
    }
})

// RUTA PARA AUMENTAR
app.post("/cart/increase/:id", (req, res) => {
    const id = req.params.id;
    const producto = cart.find(p => p.id == id);

    if (producto) {
        producto.quantity += 1;
    }
    res.redirect("/cart");
});

// RUTA PARA DISMINUIR
app.post("/cart/decrease/:id", (req, res) => {
    const id = req.params.id;
    const producto = cart.find(p => p.id == id);

    if (producto) {
        if (producto.quantity > 1) {
            producto.quantity -= 1;
        } else {
            cart = cart.filter(p => p.id != id);
        }
    }
    res.redirect("/cart");
});