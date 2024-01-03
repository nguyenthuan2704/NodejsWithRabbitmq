const amqplib = require('amqplib')
// .env
const amqp_url_docker = 'amqp://localhost:5672';
const receiveNoti = async()=>{
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
        //4.create queue
        const {
            queue
        } = await channel.assertQueue('',{
            //exclusive : tự động xóa queue khi sub không còn connect đến pub , tránh lãng phí queue
            exclusive:true
        })
        console.log(`nameQueue:::${queue}`)
        //5.binding : thể hiện mối quan hệ giữa exchange và queue
        await channel.bindQueue(queue,nameExchange,'')
        await channel.consume(queue,msg => {
            console.log(`msg::`,msg.content.toString())
        },{
            noAck:true
        })

    } catch (error) {
        console.error(error.message)
    }
}

receiveNoti()