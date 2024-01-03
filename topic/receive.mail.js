const amqplib = require('amqplib')
// .env
const amqp_url_docker = 'amqp://localhost:5672';
const receiveEmail = async()=>{
    try {
        //1.create Connect
        // const conn = await amqplib.connect(amqp_url_cloud)
        const conn = await amqplib.connect(amqp_url_docker)

        //2.create channel
        const channel = await conn.createChannel()

        //3.create exchange
        const nameExchange = 'send_email'
        await channel.assertExchange(nameExchange,'topic',{
            durable:false
        })

        //4.create queue
        const { queue } = await channel.assertQueue('', {
            exclusive:true
        })

        //5.binding
        const args = process.argv.slice(2);
        if(!args.length){
            process.exit(0)
        }

        /**
         * kí tự * : ý nghĩa phù hợp với bất kỳ từ nào
         * kí tự # : ý nghĩa khớp với một hoặc nhiều từ bất kỳ
         */

        console.log(`waiting queue ${queue}::: topic::${args}`)

        args.forEach(async key => {
            await channel.bindQueue(queue,nameExchange,key)
        })

        //6.publish email
        await channel.consume(queue, msg => {
            console.log(`Routing key:${msg.fields.routingKey}::: msg:::${msg.content.toString()}`)
        })        
    } catch (error) {
        console.error(error.message)
    }
}

receiveEmail()