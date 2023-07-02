const fs = require("fs");
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

// Función para guardar frutas en el archivo de base de datos
function guardarFrutas(frutas) {
  const datos = JSON.stringify(frutas); // Convertir el arreglo de frutas a formato JSON
  fs.writeFileSync(__dirname + process.env.DATABASE_PATH, datos); // Escribir los datos en el archivo definido en la variable de entorno DATABASE_PATH
}

// Función para leer frutas desde el archivo de base de datos
function leerFrutas() {
  const frutasString = fs.readFileSync(__dirname + process.env.DATABASE_PATH, "utf8"); // Leer los datos del archivo definido en la variable de entorno DATABASE_PATH como una cadena de texto
  const frutas = JSON.parse(frutasString); // Convertir la cadena de texto JSON a un arreglo de frutas
  return frutas; // Devolver el arreglo de frutas
}

//Modif Alejandro Flores
async function findOneById(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    const frutas = await leerFrutas();
    const fruta = frutas.find((element) => element.id === id);

    if (!fruta) throw new Error("Error. El Id no corresponde a una fruta en existencia.");

    return fruta;
}

async function update(fruta) {
    if (!fruta?.id || !fruta?.imagen || !fruta?.nombre || !fruta?.importe || !fruta?.stock) throw new Error("Error. Datos incompletos.");
    let frutas = await leerFrutas();
    const indice = frutas.findIndex((element) => element.id === fruta.id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a una fruta en existencia.");

    frutas[indice] = fruta;
    await guardarFrutas(frutas);

    return frutas[indice];
}

async function destroy(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    let frutas = await leerFrutas();
    const indice = frutas.findIndex((element) => element.id === id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a una fruta en existencia.");

    const fruta = frutas[indice];
    frutas.splice(indice, 1);
    await guardarFrutas(frutas);

    return fruta;
}
// Exportar las funciones para ser utilizadas por otros módulos
module.exports = {
  leerFrutas,
  guardarFrutas,
  findOneById,
  update,
  destroy
};
