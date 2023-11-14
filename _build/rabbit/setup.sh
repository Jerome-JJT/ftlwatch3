RABBITCMD="rabbitmqadmin -u $RABBITMQ_DEFAULT_USER -p $RABBITMQ_DEFAULT_PASS"

$RABBITCMD declare queue name=message.dlq durable=true
$RABBITCMD declare queue name=update.dlq durable=true

$RABBITCMD declare queue name=exchange.dlq durable=true
$RABBITCMD declare exchange name=fallback type=fanout
$RABBITCMD declare binding source="fallback" destination_type="queue" destination="exchange.dlq"



$RABBITCMD declare exchange name=main type=topic arguments='{"alternate-exchange": "fallback"}'

$RABBITCMD declare queue name=slow.update.queue durable=true arguments='{"x-dead-letter-exchange": "", "x-dead-letter-routing-key": "update.dlq"}'
$RABBITCMD declare queue name=fast.update.queue durable=true arguments='{"x-dead-letter-exchange": "", "x-dead-letter-routing-key": "update.dlq"}'

$RABBITCMD declare queue name=server.message.queue durable=true arguments='{"x-dead-letter-exchange": "", "x-dead-letter-routing-key": "message.dlq"}'
$RABBITCMD declare queue name=private.message.queue durable=true arguments='{"x-dead-letter-exchange": "", "x-dead-letter-routing-key": "message.dlq"}'


$RABBITCMD declare binding source="main" destination_type="queue" destination="slow.update.queue" routing_key="slow.update.queue"
$RABBITCMD declare binding source="main" destination_type="queue" destination="fast.update.queue" routing_key="fast.update.queue"

$RABBITCMD declare binding source="main" destination_type="queue" destination="server.message.queue" routing_key="*.server.message.queue"
$RABBITCMD declare binding source="main" destination_type="queue" destination="private.message.queue" routing_key="*.private.message.queue"

$RABBITCMD declare binding source="main" destination_type="queue" destination="private.message.queue" routing_key="projects.server.message.queue"


