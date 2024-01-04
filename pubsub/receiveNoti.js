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
            /*Sử dụng thuộc tính autoAck
           sử dụng thuộc tính autoAck là true khi Consumer nhận Message, thuộc tính này chỉ ra răng một ACK message sẽ được auto gửi đến RabbitMQ để báo với RabbitMQ rằng một Message đã được Consumer nhận, 
            xử lý và Rabbit có thể xoá nó. Một vấn đề đặt ra là nếu một Consumer xử lý Task trong một thời gian dài, chỉ một phần của Task được hoàn thành và nó die. 
            Khi đó, Message đã bị xoá bởi RabbitQM và Task sẽ bị mất. Để giải quyết vấn đề này, chúng ta sẽ không auto gửi Message, mà chúng ta sẽ gửi một ACK message đến RabbitMQ khi nó hoàn thành xử lý Message
            */
            noAck:true
        })

    } catch (error) {
        console.error(error.message)
    }
}

receiveNoti()
