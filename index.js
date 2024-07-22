const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  authStrategy: new LocalAuth()
});

const messageData = {
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: process.env.WHATSAPP_NUMBER,
  type: "text",
  text: {
    body: "Esta é uma mensagem de teste"
  }
};

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('message', async message => {
  let msg = message.body.toLowerCase().trim();
  console.log("Mensagem recebida: " + msg);

  if (msg.includes("agendamento")) {
    try {
      const response = await axios.post(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, messageData, {
        headers: {
          'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending message:', error.response.data);
    }
  }
});

client.initialize();
