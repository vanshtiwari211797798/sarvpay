const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const RECHARGE_CONFIG = {
  baseUrl: 'https://business.a1topup.com/recharge/api',
  username: '505663',
  pwd: 'jtyc7xry',
  circleCode: '10'
};

app.post('/api/recharge', async (req, res) => {
  const { operatorCode, number, amount, orderId } = req.body;

  if (!operatorCode || !number || !amount || !orderId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const params = {
      username: RECHARGE_CONFIG.username,
      pwd: RECHARGE_CONFIG.pwd,
      circlecode: RECHARGE_CONFIG.circleCode,
      operatorcode: operatorCode,
      number: number,
      amount: amount,
      orderid: orderId,
      format: 'json',
    };

    const response = await axios.get(RECHARGE_CONFIG.baseUrl, { params });

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process recharge with provider'
    });
  }
});

module.exports = app;