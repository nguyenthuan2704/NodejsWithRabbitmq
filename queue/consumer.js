const amqplib = require('amqplib')
// .env
const amqp_url_docker = 'amqp://localhost:5672';
const receiveQueue = async () => {
    try {
     //1.create Connect
    const conn = await amqplib.connect(amqp_url_docker)
    //2.create channel
    const channel = await conn.createChannel()
    //3.create name queue
    const nameQueue = 'firstQueue'
    //4.create queue
    await channel.assertQueue(nameQueue,{
        durable:true 
    })   
    //5.receive to queue
    await channel.consume(nameQueue, msg => {
        console.log('Msg::',msg.content.toString())
    },{
        noAck : true
    })
    //6.
    } catch (error) {
        console.error(`Error::`,error.message)
    }
}

receiveQueue()