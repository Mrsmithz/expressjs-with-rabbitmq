const express = require('express');
const app = express();
const logger = require('morgan')
const amqpClient = require('./amqpClient');

app.use(express.json())
app.use(logger('dev'))

let channel
amqpClient.createClient({ url: process.env.RABBIT_URL })
  .then(ch => {
    channel = ch;
  });


app.get('/service1', function(req, res) {
  amqpClient.sendRPCMessage(channel, req.body.message, 'rpc_queue1')
    .then(msg => {
      res.send(msg)
    });
});
app.get('/service2', function(req, res) {
  amqpClient.sendRPCMessage(channel, req.body.message, 'rpc_queue2')
    .then(msg => {
      res.send(msg)
    });
});

const PORT = process.env.PORT || 15000
app.listen(PORT, function() {
  console.log(`server started on port ${PORT}`);
});