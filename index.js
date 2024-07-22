const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client({
  authStrategy: new LocalAuth()
});

const messageData = {
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: process.env.WHATSAPP_NUMBER,
  type: "interactive",
  interactive: {
    type: "button",
    body: {
      text: "Seja bem-vindo(a) à Barbearia TechNosDev. Estamos aqui para oferecer o melhor serviço e cuidar do seu visual. Como podemos ajudar você hoje?"
    },
    action: {
      buttons: [
        {
          type: "reply",
          reply: {
            id: "corte_cabelo",
            title: "✂️ Corte de cabelo"
          }
        },
        {
          type: "reply",
          reply: {
            id: "barba_bigode",
            title: "🧔 Barba e bigode"
          }
        },
        {
          type: "reply",
          reply: {
            id: "tratamentos_capilares",
            title: "💈 Tratamentos"
          }
        }
      ]
    }
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
    axios.post(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, messageData, {
      headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log('Message sent successfully:', response.data);
    }).catch(error => {
      console.error('Error sending message:', error.response.data);
    });
  }
});

client.initialize();
