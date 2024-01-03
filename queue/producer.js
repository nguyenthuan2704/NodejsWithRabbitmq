const amqplib = require('amqplib')
// .env
const amqp_url_docker = 'amqp://localhost:5672';
const sendQueue = async ({ msg }) => {
    try {
     //1.create Connect
    const conn = await amqplib.connect(amqp_url_docker)
    //2.create channel
    const channel = await conn.createChannel()
    //3.create name queue
    const nameQueue = 'firstQueue'
    //4.create queue
    await channel.assertQueue(nameQueue,{
        // true : khi restart services thì các queue không bị mất message
        durable:true 
    })   
    //5.send to queue
    await channel.sendToQueue(nameQueue,Buffer.from(msg),{
        // lưu queue vào cache hoặc ổ đĩa cứng
        persistent:true
    })
    // await channel.sendToQueue(nameQueue,Buffer.from(msg),{
    //     //TTL Time To Live
    //     expiration: '10000'
    // })
    //6.
    } catch (error) {
        console.error(`Error::`,error.message)
    }
}
const msg = process.argv.slice(2).join('') || 'Hello';
//process.argv = [
    // bin node,
    // path,
    //'hello1'
//]
sendQueue({msg})