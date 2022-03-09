const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const response = await client.get('/api/orders').catch(function () { });

  return { orders: response && response.data ? response.data : [] };
};

export default OrderIndex;
