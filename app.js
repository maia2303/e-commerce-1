//importamos la dependencia
const express = require('express');

//instanciamos la app
const app = express();

const PORT = 3000;

//ruta raíz
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("pages/index")
})

//iniciar el servidor
app.listen(PORT, () => {
    console.log(`App funcionando en el puerto ${PORT}`)
});