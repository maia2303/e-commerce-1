//importamos la dependencia
const express = require('express');

//instanciamos la app
const app = express();

//decimos en donde van a estar los estilos a usar
app.use(express.static("assets"));

const PORT = 3000;

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
app.listen(PORT, () => {
    console.log(`App funcionando en el puerto ${PORT}`)
});