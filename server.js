//.env
//PORT=3008
//DATABASE_PATH = /database/frutas.json

// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas, findOneById, update, destroy } = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3000;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
   res.send(BD);
});

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
    const nuevaFruta = req.body;
    BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
    guardarFrutas(BD); // Guardar los cambios en el archivo
    res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});

// Obtener una fruta específico: Ruta GET http://127.0.0.1:3008/1
//Modif por Alejandro Flores
app.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    findOneById(Number(id))
        .then((fruta) => res.status(200).send(fruta))
        .catch((error) => res.status(400).send(error.message));
});

// Actualizar una fruta específica: Ruta PUT http://127.0.0.1:3000/1
//modif. Alejandro Flores
app.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { imagen, nombre, importe, stock } = req.body;

    update({ id: Number(id), imagen, nombre, importe, stock })
        .then((fruta) => res.status(200).send(fruta))
        .catch((error) => res.status(400).send(error.message));
});


// Eliminar una fruta específica: Ruta DELETE http://127.0.0.1:3008/1
//modif. Alejandro Flores
app.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    destroy((id))
        .then((fruta) => res.status(200).send(fruta))
        .catch((error) => res.status(400).send(error.message));
});

// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
  res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
