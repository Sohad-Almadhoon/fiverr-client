import "./Orders.scss";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import getCurrentUser from "../../utils/getUser";
import { Loader, EmptyState } from "../../components/state/State";

const Orders = () => {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        return res.data;
      }),
  });
  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;
    // Role comes from this order, not from the account's global mode - a
    // seller browsing in buying mode is still the seller of their own order.
    const amSeller = order.sellerId === currentUser?._id;
    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      // Optional chaining: a network failure has no `response`, so the old
      // check threw a second error inside the catch block.
      if (err?.response?.status === 404) {
        const res = await newRequest.post(`/conversations`, {
          to: amSeller ? buyerId : sellerId,
          asSeller: amSeller,
        });
        navigate(`/message/${res.data.id}`);
      } else {
        console.error(getErrorMessage(err));
      }
    }
  };

  const isSeller = !!currentUser?.isSeller;

  return (
    <div className="orders">
      <div className="container">
        <div className="title">
          <h1>Orders</h1>
        </div>

        {isLoading ? (
          <Loader label="Loading your orders..." />
        ) : error ? (
          <EmptyState
            variant="error"
            title="Couldn't load your orders"
            message={getErrorMessage(error)}
            actionLabel="Try again"
            onAction={() => refetch()}
          />
        ) : data?.length ? (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Type</th>
                <th>Price</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {/* data-label drives the stacked card layout under 768px. */}
              {data.map((order) => (
                <tr key={order._id}>
                  <td data-label="Image">
                    <img className="image" src={order.img} alt="" />
                  </td>
                  <td data-label="Title">{order.title}</td>
                  {/* The list now spans both sides, so each row says which. */}
                  <td data-label="Type">
                    <span
                      className={
                        order.sellerId === currentUser?._id
                          ? "tag sale"
                          : "tag purchase"
                      }>
                      {order.sellerId === currentUser?._id ? "Sale" : "Purchase"}
                    </span>
                  </td>
                  <td data-label="Price">${order.price}</td>
                  <td data-label="Contact">
                    <img
                      className="message"
                      src="/img/message.png"
                      alt="Contact"
                      onClick={() => handleContact(order)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* An empty table with only headers used to render here, which reads
             as a broken page rather than "nothing yet". */
          <EmptyState
            icon="🧾"
            title="No orders yet"
            message="Purchases you make and sales on your gigs both show up here."
            actionLabel={isSeller ? "Manage your gigs" : "Browse services"}
            actionTo={isSeller ? "/mygigs" : "/gigs"}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
