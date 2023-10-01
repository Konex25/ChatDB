const express = require('express');
const app = express();
const { Pool } = require('pg');
const mysql2 = require('mysql2/promise');
const getPostgresDDL = require('./src/getDDL/postgres/getPostgresDDL');
const getMysqlDDL = require('./src/getDDL/mysql/getMysqlDDL');
const os = require('os');

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const cors = require('cors');

app.use(express.json());

app.use(cors({
  origin: '*',
}));

function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return '0.0.0.0';
}

const isLLMBackendRunning = false;

const LLM_BACKEND_URL = 'http://192.168.203.69:5000';
const PATH_TO_TEST_DB_DDL = './sql/ddl.sql';
const PATH_TO_TEST_SQLITE_DB = './sql/jpk_database';

const connections = [];

app.post('/getDDL', async (req, res) => {
  const {
    useTestDatabase,
    dbUrl,
    textQuery,
  } = req.body;

  console.log('Prompt request received', { useTestDatabase, dbUrl, textQuery });

  let connection;

  if (useTestDatabase) {
    connection = connections.find(connection => connection.dbms === 'sqlite');

    if (!connection) {
      const db = new sqlite3.Database(PATH_TO_TEST_SQLITE_DB, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
          return res.status(400).json({ error: 'Failed to connect to database' });
        }
      });

      connection = {
        dbms: 'sqlite',
        dbUrl: PATH_TO_TEST_SQLITE_DB,
        db,
      };

      connections.push(connection);
    }
  } else {
    connection = connections.find(connection => connection.dbUrl === dbUrl);

    if (!connection) {
      const isPostgres = /^postgres(ql)?:\/\/.*$/i.test(dbUrl);
      const isMySQL = /^mysql:\/\/.*$/i.test(dbUrl);
  
      if (!isPostgres && !isMySQL) {
        return res.status(400).json({ error: 'Invalid database URL' });
      }
  
      if (isPostgres) {
        const pool = new Pool({ connectionString: dbUrl });
  
        try {
          await pool.connect();
        } catch (err) {
          return res.status(400).json({ error: 'Failed to connect to database' });
        }
  
        connection = {
          dbms: 'postgres',
          dbUrl,
          pool,
        };
  
        connections.push(connection);
      } else if (isMySQL) {
        try {
          const conn = await mysql2.createConnection(dbUrl);
          
          connection = {
            dbms: 'mysql',
            dbUrl,
            conn
          };
  
          connections.push(connection);
        } catch (err) {
          console.error(err);
          return res.status(400).json({ error: 'Failed to connect to database' });
        }
  
      }
    }
  }

  try {
    let ddl;

    if (connection.dbms === 'postgres') {
      ddl = await getPostgresDDL(connection);
    } else if (connection.dbms === 'mysql') {
      ddl = await getMysqlDDL(connection);
    } else if (connection.dbms === 'sqlite') {
      ddl = fs.readFileSync(PATH_TO_TEST_DB_DDL, 'utf8');
    }

    // console.log('Requesting LLM backend...', { ddl, nlPrompt: textQuery });

    // if (!isLLMBackendRunning) {
    //   return res.json({ sqlQuery: 'SELECT * FROM table WHERE column = value' });
    // }

    // const response = await fetch(`${LLM_BACKEND_URL}/process`, {
    //   timeout: 180000,
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     ddl,
    //     nlPrompt: textQuery,
    //   }),
    // });

    // const { sqlQuery } = await response.json();

    // const { sqlQuery } = await httpRequest(`${LLM_BACKEND_URL}/process`, {
    //   ddl,
    //   nlPrompt: textQuery,
    // });

    return res.json({ ddl });
  } catch (err) {
    console.error(err);

    return res.status(400).json({ err });
  }
});

app.post('/execute', async (req, res) => {
  const {
    useTestDatabase,
    dbUrl,
    sqlQuery,
  } = req.body;

  let connection;

  if (useTestDatabase) {
    connection = connections.find(connection => connection.dbms === 'sqlite');

    if (!connection) {
      const db = new sqlite3.Database(PATH_TO_TEST_SQLITE_DB, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
          return res.status(400).json({ error: 'Failed to connect to database' });
        }
      });

      connection = {
        dbms: 'sqlite',
        dbUrl: PATH_TO_TEST_SQLITE_DB,
        db,
      };

      console.log('Connected to SQLite database', connection);

      connections.push(connection);
    }
  } else {
    connection = connections.find(connection => connection.dbUrl === dbUrl);

    if (!connection) {
      const isPostgres = /^postgres(ql)?:\/\/.*$/i.test(dbUrl);
      const isMySQL = /^mysql:\/\/.*$/i.test(dbUrl);

      if (!isPostgres && !isMySQL) {
        return res.status(400).json({ error: 'Invalid database URL' });
      }

      if (isPostgres) {
        const pool = new Pool({ connectionString: dbUrl });

        try {
          await pool.connect();
        } catch (err) {
          return res.status(400).json({ error: 'Failed to connect to database' });
        }

        connection = {
          dbms: 'postgres',
          dbUrl,
          pool,
        };

        connections.push(connection);
      } else if (isMySQL) {
        try {
          const conn = await mysql2.createConnection(dbUrl);
          
          connection = {
            dbms: 'mysql',
            dbUrl,
            conn
          };

          connections.push(connection);
        } catch (err) {
          console.error(err);
          return res.status(400).json({ error: 'Failed to connect to database' });
        }

      }
    }
  }

  if (!connection) {
    return res.status(400).json({
      queryResult: {
        headers: ["Column 1", "Column 2", "Column 3"],
        data: [
          ["Row 1, Column 1", "Row 1, Column 2", "Row 1, Column 3"],
          ["Row 2, Column 1", "Row 2, Column 2", "Row 2, Column 3"],
          ["Row 3, Column 1", "Row 3, Column 2", "Row 3, Column 3"],
          ["Row 4, Column 1", "Row 4, Column 2", "Row 4, Column 3"],
          ["Row 5, Column 1", "Row 5, Column 2", "Row 5, Column 3"],
        ],
      },
    });
  }

  try {
    let queryData;

    if (connection.dbms === 'postgres') {
      const client = await connection.pool.connect();

      try {
        queryData = (await client.query(sqlQuery)).rows;
      } catch (err) {
        return res.status(400).json({ error: 'Failed to execute query' });
      } finally {
        await client.release();
      }
    } else if (connection.dbms === 'mysql') {
      try {
        queryData = (await connection.conn.query(sqlQuery))[0];
      } catch (err) {
        return res.status(400).json({ error: 'Failed to execute query' });
      }
    } else if (connection.dbms === 'sqlite') {
      queryData = await new Promise((resolve, reject) => {
        connection.db.all(sqlQuery, (err, rows) => {
          if (err) {
            return reject(err);
          }

          return resolve(rows);
        });
      });
    }

    const headers = Object.keys(queryData[0]);
    const data = queryData.map(row => Object.values(row)).slice(0, 10);

    return res.json({ queryResult: { headers, data } });
  } catch (err) {
    console.error(err);

    return res.status(400).json({ err });
  }
});

const port = 8000;

app.listen(port, () => {
  console.log(`Listening on ${getIPAddress()}:${port}`);
});
