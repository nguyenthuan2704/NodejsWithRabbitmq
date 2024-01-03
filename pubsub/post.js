const amqplib = require('amqplib')
// .env
const amqp_url_docker = 'amqp://localhost:5672';
const postVideo = async({msg})=>{
    try {
        //1.create Connect
        const conn = await amqplib.connect(amqp_url_docker)
        //2.create channel
        const channel = await conn.createChannel()
        //3.create exchange
        const nameExchange = 'video'
        await channel.assertExchange(nameExchange,'fanout',{
            durable:false
        })
        //4.publish
        await channel.publish(nameExchange,'',Buffer.from(msg))
        console.log(`[x] Send OK:::${msg}`)
        setTimeout(function(){
            conn.close();
            process.exit(0);
        },2000)
    } catch (error) {
        console.error(error.message)
    }
}
const msg = process.argv.slice(2).join(' ') || 'Hello Exchange'
postVideo({msg})