require('dotenv').config()
const amqp = require('amqplib')

const q = 'rpc_queue2'
amqp.connect(process.env.RABBIT_URL)
    .then(conn => conn.createChannel())
    .then(ch => {
        ch.assertQueue(q, {durable:false})
        ch.prefetch(1)
        console.log("[x] Awaiting RPC Requests")

        ch.consume(q, msg => {
            const message = `from ${q}, message is : ${msg.content.toString()}`
            console.log(`get message : ${msg.content.toString()}`)
            ch.sendToQueue(msg.properties.replyTo, Buffer.from(message), {correlationId:msg.properties.correlationId})
            ch.ack(msg)
        })
    })