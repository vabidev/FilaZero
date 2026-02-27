const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const config = require('./config');

class Database {
  constructor() {
    this.db = new sqlite3.Database(config.database.filename, (err) => {
      if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
      } else {
        console.log('Conectado ao banco de dados SQLite');
        this.initTables();
      }
    });
  }

  initTables() {
    // Tabela de administradores
    this.db.run(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de configurações do negócio
    this.db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        business_name TEXT,
        business_description TEXT,
        business_phone TEXT,
        business_email TEXT,
        business_address TEXT,
        about_text TEXT,
        working_hours TEXT,
        employee_count INTEGER DEFAULT 1,
        theme_mode TEXT DEFAULT 'light',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Adicionar coluna employee_count se não existir (migração)
    this.db.run(`ALTER TABLE settings ADD COLUMN employee_count INTEGER DEFAULT 1`, (err) => {
      // Ignora erro se coluna já existir
    });

    // Tabela de serviços
    this.db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL,
        price DECIMAL(10,2),
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de clientes
    this.db.run(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de agendamentos
    this.db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      )
    `);

    // Tabela de horários bloqueados
    this.db.run(`
      CREATE TABLE IF NOT EXISTS blocked_times (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        block_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de dias excluídos (feriados)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS excluded_dates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        excluded_date DATE NOT NULL UNIQUE,
        reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar usuário admin padrão se não existir
    this.createDefaultAdmin();

    // Criar configurações padrão se não existir
    this.createDefaultSettings();
  }

  createDefaultAdmin() {
    const defaultUsername = 'admin';
    const defaultPassword = 'admin123';

    // Verifica se existe QUALQUER admin no sistema
    this.db.get('SELECT * FROM admins LIMIT 1', (err, row) => {
      if (!row) {
        // Só cria o admin padrão se não houver NENHUM admin no sistema
        bcrypt.hash(defaultPassword, 10, (err, hash) => {
          this.db.run(
            'INSERT INTO admins (username, password) VALUES (?, ?)',
            [defaultUsername, hash],
            (err) => {
              if (!err) {
                console.log('✓ Admin padrão criado - Usuário: admin | Senha: admin123');
              }
            }
          );
        });
      }
    });
  }

  createDefaultSettings() {
    // Usar setTimeout para garantir que a tabela foi criada
    setTimeout(() => {
      this.db.get('SELECT * FROM settings LIMIT 1', (err, row) => {
        if (err) {
          console.error('Erro ao verificar configurações:', err);
          return;
        }
        if (!row) {
          this.db.run(`
            INSERT INTO settings (
              business_name, 
              business_description, 
              business_phone, 
              business_email,
              about_text,
              working_hours,
              employee_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            'FilaZero',
            'Sistema de Agendamento Online',
            '(11) 9999-9999',
            'contato@filazero.com',
            'Somos uma empresa dedicada a oferecer os melhores serviços para nossos clientes.',
            JSON.stringify(config.business.defaultWorkingHours),
            1
          ], (err) => {
            if (!err) {
              console.log('✓ Configurações padrão criadas');
            }
          });
        }
      });
    }, 100);
  }

  // Métodos auxiliares para queries
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = new Database();
