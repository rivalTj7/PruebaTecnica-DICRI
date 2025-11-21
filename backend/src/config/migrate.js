const fs = require('fs');
const path = require('path');
const sql = require('mssql');
require('dotenv').config();

const runMigrations = async () => {
  try {
    console.log('🔄 Iniciando migraciones de base de datos...');

    // Primero conectar a master para crear la base de datos
    const masterConfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 1433,
      database: 'master', // Conectar a master primero
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000,
      },
    };

    console.log('📡 Conectando a SQL Server (master)...');
    let masterPool = await sql.connect(masterConfig);

    // Crear base de datos si no existe
    console.log(`📦 Verificando/Creando base de datos ${process.env.DB_NAME}...`);
    await masterPool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '${process.env.DB_NAME}')
      BEGIN
        CREATE DATABASE [${process.env.DB_NAME}]
      END
    `);
    console.log(`✅ Base de datos ${process.env.DB_NAME} lista`);

    await masterPool.close();

    // Ahora conectar a DICRI_DB
    const dbConfig = {
      ...masterConfig,
      database: process.env.DB_NAME,
    };

    console.log(`📡 Conectando a ${process.env.DB_NAME}...`);
    const pool = await sql.connect(dbConfig);

    // Leer archivos SQL en orden
    const scriptsPath = path.join(__dirname, '../../database');
    const scripts = [
      'schema.sql',
      'stored-procedures.sql',
      'seed-data.sql',
    ];

    for (const scriptName of scripts) {
      const scriptPath = path.join(scriptsPath, scriptName);

      if (fs.existsSync(scriptPath)) {
        console.log(`📄 Ejecutando: ${scriptName}`);
        const scriptContent = fs.readFileSync(scriptPath, 'utf8');

        // Dividir por GO statements (SQL Server batch separator)
        const batches = scriptContent
          .split(/\nGO\n|\nGO\r\n/gi)
          .filter(batch => batch.trim().length > 0);

        for (const batch of batches) {
          try {
            await pool.request().query(batch);
          } catch (error) {
            // Ignorar errores de "objeto ya existe" durante desarrollo
            if (!error.message.includes('already exists') &&
                !error.message.includes('ya existe')) {
              throw error;
            }
          }
        }

        console.log(`✅ ${scriptName} ejecutado correctamente`);
      } else {
        console.log(`⚠️  Archivo no encontrado: ${scriptName}`);
      }
    }

    await pool.close();
    console.log('✅ Migraciones completadas exitosamente');
  } catch (error) {
    console.error('❌ Error en migraciones:', error);
    process.exit(1);
  }
};

// Ejecutar migraciones si este script se ejecuta directamente
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { runMigrations };
