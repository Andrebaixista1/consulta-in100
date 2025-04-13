// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();
const app = express();
const port = 3000;
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/api/login', async (req, res) => {
  const { login, senha } = req.body;
  try {
    const [rows] = await pool.query(
      `SELECT b.id, b.nome, b.login, b.senha, b.data_criacao, b.ultimo_log,
              a.total_carregado, a.limite_disponivel, a.consultas_realizada
         FROM usuarios b
         LEFT JOIN creditos a ON a.id_user = b.id
         WHERE b.login = ? LIMIT 1`,
      [login]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    const user = rows[0];
    if (senha !== user.senha) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }
    await pool.query('UPDATE usuarios SET ultimo_log = NOW() WHERE id = ?', [user.id]);
    const creditos = {
      total_carregado: parseInt(user.total_carregado) || 0,
      limite_disponivel: parseInt(user.limite_disponivel) || 0,
      consultas_realizada: parseInt(user.consultas_realizada) || 0
    };
    delete user.senha;
    delete user.total_carregado;
    delete user.limite_disponivel;
    delete user.consultas_realizada;
    user.creditos = creditos;
    return res.json(user);
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

app.post('/api/consulta', async (req, res) => {
  const { cpf, nb, login } = req.body;
  try {
    if (cpf !== process.env.FAKE_CPF || nb !== process.env.FAKE_NB) {
      return res.status(400).json({ error: 'CPF ou NB inválido(s).' });
    }
    const [rows] = await pool.query(
      `SELECT a.*, u.id AS user_id
         FROM creditos a
         JOIN usuarios u ON a.id_user = u.id
         WHERE u.login = ? 
         LIMIT 1`,
      [login]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Créditos não encontrados para este usuário.' });
    }
    const cred = rows[0];
    if (parseInt(cred.limite_disponivel) <= 0) {
      return res.status(400).json({ error: 'Seus créditos acabaram, verifique agora com o setor de Planejamento e/ou seu gerente expande' });
    }
    const novoLimite = parseInt(cred.limite_disponivel) - 1;
    const novasConsultas = parseInt(cred.consultas_realizada) + 1;
    await pool.query(
      'UPDATE creditos SET limite_disponivel = ?, consultas_realizada = ? WHERE id = ?',
      [novoLimite, novasConsultas, cred.id]
    );
    const [updatedRows] = await pool.query(
      'SELECT total_carregado, limite_disponivel, consultas_realizada FROM creditos WHERE id = ? LIMIT 1',
      [cred.id]
    );
    const updatedCredit = updatedRows[0];
    return res.json({
      benefitNumber: process.env.FAKE_BENEFIT_NUMBER,
      documentNumber: process.env.FAKE_DOCUMENT_NUMBER,
      name: process.env.FAKE_NAME,
      state: process.env.FAKE_STATE,
      alimony: process.env.FAKE_ALIMONY,
      birthDate: process.env.FAKE_BIRTH_DATE,
      blockType: process.env.FAKE_BLOCK_TYPE,
      grantDate: process.env.FAKE_GRANT_DATE,
      benefitEndDate: process.env.FAKE_BENEFIT_END_DATE,
      creditType: process.env.FAKE_CREDIT_TYPE,
      benefitCardLimit: parseInt(process.env.FAKE_BENEFIT_CARD_LIMIT),
      benefitCardBalance: parseInt(process.env.FAKE_BENEFIT_CARD_BALANCE),
      availableTotalBalance: parseInt(process.env.FAKE_AVAILABLE_TOTAL_BALANCE),
      benefitStatus: process.env.FAKE_BENEFIT_STATUS,
      legalRepresentativeName: process.env.FAKE_LEGAL_REPRESENTATIVE_NAME,
      bankCode: process.env.FAKE_BANK_CODE,
      bankName: process.env.FAKE_BANK_NAME,
      agencyCode: process.env.FAKE_AGENCY_CODE,
      accountNumber: process.env.FAKE_ACCOUNT_NUMBER,
      accountDigit: process.env.FAKE_ACCOUNT_DIGIT,
      numberOfActiveReservations: process.env.FAKE_NUMBER_OF_ACTIVE_RESERVATIONS,
      total_carregado: parseInt(updatedCredit.total_carregado),
      limite_disponivel: parseInt(updatedCredit.limite_disponivel),
      consultas_realizada: parseInt(updatedCredit.consultas_realizada)
    });
  } catch (error) {
    console.error('Erro na consulta de crédito:', error);
    return res.status(500).json({ error: 'Erro interno no servidor ao consultar créditos.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor de API rodando na porta ${port}`);
});
