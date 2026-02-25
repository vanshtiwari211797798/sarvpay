const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Allow your Flutter app to communicate with this server

// Configuration - Keep these in environment variables in a real app!
const RECHARGE_CONFIG = {
  baseUrl: 'https://business.a1topup.com/recharge/api',
  username: '505663',
  pwd: 'jtyc7xry',
  circleCode: '10'
};

app.post('/api/recharge', async (req, res) => {
  const { operatorCode, number, amount, orderId } = req.body;
  console.log('Received recharge request:', { operatorCode, number, amount, orderId });

  // 1. Basic Validation
  if (!operatorCode || !number || !amount || !orderId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 2. Construct the parameters for the third-party API
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

    // 3. Make the GET request to A1 Topup
    const response = await axios.get(RECHARGE_CONFIG.baseUrl, { params });
    console.log('A1 Topup response:', response.data);

    // 4. Return the result back to your Flutter app
    res.json(response.data);

  } catch (error) {
    console.error('Recharge Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process recharge with provider' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));