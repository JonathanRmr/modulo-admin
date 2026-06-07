require('dotenv').config();
const app = require('./src/app');
const conectarDB = require('./src/config/db');

const PORT = process.env.PORT || 4004;

const iniciar = async () => {
  await conectarDB();
  app.listen(PORT, () => {
    console.log(`✅ Módulo Admin corriendo en puerto ${PORT}`);
  });
};

iniciar();
