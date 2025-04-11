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
      'SELECT id, nome, login, senha, data_criacao, ultimo_log FROM usuarios WHERE login = ? LIMIT 1',
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
    delete user.senha;
    return res.json(user);
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

app.post('/api/consulta', async (req, res) => {
  const { cpf, nb, login } = req.body;
  if (cpf === process.env.FAKE_CPF && nb === process.env.FAKE_NB) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM creditos WHERE login = ? LIMIT 1',
        [login]
      );
      if (rows.length === 0) {
        return res.status(400).json({ error: 'Não há créditos para este usuário.' });
      }
      const cred = rows[0];
      if (cred.limite_disponivel <= 0) {
        return res.status(400).json({ error: 'Limite disponível esgotado.' });
      }
      const novoLimite = cred.limite_disponivel - 1;
      const novasConsultas = cred.consultas_realizada + 1;
      await pool.query(
        'UPDATE creditos SET limite_disponivel = ?, consultas_realizada = ? WHERE id = ?',
        [novoLimite, novasConsultas, cred.id]
      );
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
        benefitCardLimit: parseFloat(process.env.FAKE_BENEFIT_CARD_LIMIT),
        benefitCardBalance: parseFloat(process.env.FAKE_BENEFIT_CARD_BALANCE),
        availableTotalBalance: parseFloat(process.env.FAKE_AVAILABLE_TOTAL_BALANCE),
        benefitStatus: process.env.FAKE_BENEFIT_STATUS,
        legalRepresentativeName: process.env.FAKE_LEGAL_REPRESENTATIVE_NAME,
        bankCode: process.env.FAKE_BANK_CODE,
        bankName: process.env.FAKE_BANK_NAME,
        agencyCode: process.env.FAKE_AGENCY_CODE,
        accountNumber: process.env.FAKE_ACCOUNT_NUMBER,
        accountDigit: process.env.FAKE_ACCOUNT_DIGIT,
        numberOfActiveReservations: process.env.FAKE_NUMBER_OF_ACTIVE_RESERVATIONS,
        limite_disponivel: novoLimite,
        consultas_realizada: novasConsultas,
        total_carregado: cred.total_carregado
      });
    } catch (error) {
      console.error('Erro na consulta de crédito:', error);
      return res.status(500).json({ error: 'Erro interno no servidor ao consultar créditos.' });
    }
  } else {
    return res.status(400).json({ error: 'CPF ou NB inválido(s).' });
  }
});

app.listen(port, () => {
  console.log(`Servidor de API rodando na porta ${port}`);
});
