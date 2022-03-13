//import buildClient from "../api/build-client";
import Link from 'next/link'

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(t => {
    return (
      <tr key={t.id}>
        <td>{t.title}</td>
        <td>{t.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${t.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  })
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList.length > 0 ? ticketList : "Satın Alınabilir Bilet Bulunmamaktadır"}
        </tbody>
      </table>
    </div>
  )
}


LandingPage.getInitialProps = async (context, client, currentUser) => {
  //const client = buildClient(context);
  // const response = await client.get('/api/users/currentuser').catch(function () { });
  // return response ? response.data : {}
  const response = await client.get('/api/tickets').catch(function () { });
  return { tickets: response && response.data ? response.data : [] };
};

export default LandingPage;