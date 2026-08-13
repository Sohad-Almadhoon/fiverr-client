import { Link } from "react-router-dom";
import "./Messages.scss";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import getCurrentUser from "../../utils/getUser";
import { Loader, EmptyState } from "../../components/state/State";

// The table used to print the raw ObjectId of the other party, which is
// meaningless to a user. Resolve it to their picture and username.
const Counterpart = ({ userId }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });
  if (isLoading) return <Loader inline label="" />;
  return (
    <span className="counterpart">
      <img src={data?.img || "/img/noavatar.jpg"} alt="" />
      <span className="name">
        {error || !data?.username ? "Unknown user" : data.username}
      </span>
    </span>
  );
};

const Messages = () => {
  // Shared safe reader instead of a raw JSON.parse of localStorage.
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest.get(`/conversations`).then((res) => {
        return res.data;
      }),
  });
  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
  const handleRead = (id) => {
    mutation.mutate(id);
  };

  // Role is per conversation, not the account's global mode: the same person
  // can be the seller in one thread and the buyer in another. Keying off
  // currentUser.isSeller showed the wrong name and the wrong unread state.
  const amSeller = (c) => c.sellerId === currentUser?._id;
  const counterpartId = (c) => (amSeller(c) ? c.buyerId : c.sellerId);
  const isUnread = (c) =>
    amSeller(c) ? !c.readBySeller : !c.readByBuyer;

  return (
    <div className="messages">
      <div className="container">
        <div className="title">
          <h1>Messages</h1>
        </div>

        {isLoading ? (
          <Loader label="Loading your messages..." />
        ) : error ? (
          <EmptyState
            variant="error"
            title="Couldn't load your messages"
            message={getErrorMessage(error)}
            actionLabel="Try again"
            onAction={() => refetch()}
          />
        ) : data?.length ? (
          <table>
            <thead>
              <tr>
                <th>With</th>
                <th>Last Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* className falls back to undefined, not `false` - the old &&
                  expression rendered class="false" on every read row. */}
              {data.map((c) => (
                <tr className={isUnread(c) ? "active" : undefined} key={c.id}>
                  <td data-label="With">
                    <Counterpart userId={counterpartId(c)} />
                    <span className="role">
                      {amSeller(c) ? "buyer" : "seller"}
                    </span>
                  </td>
                  <td data-label="Last Message">
                    <Link to={`/message/${c.id}`} className="link">
                      {c?.lastMessage
                        ? `${c.lastMessage.substring(0, 100)}${
                            c.lastMessage.length > 100 ? "..." : ""
                          }`
                        : "No messages yet"}
                    </Link>
                  </td>
                  <td data-label="Date">{moment(c.updatedAt).fromNow()}</td>
                  <td data-label="Action">
                    {isUnread(c) && (
                      <button
                        disabled={mutation.isPending}
                        onClick={() => handleRead(c.id)}>
                        Mark as Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* Previously an empty table rendered with just its headers. */
          <EmptyState
            icon="💬"
            title="No conversations yet"
            message={
              currentUser?.isSeller
                ? "When a buyer contacts you about a gig, the conversation appears here."
                : "Contact a seller from any gig page to start a conversation."
            }
            actionLabel={currentUser?.isSeller ? "Manage gigs" : "Browse services"}
            actionTo={currentUser?.isSeller ? "/mygigs" : "/gigs"}
          />
        )}
      </div>
    </div>
  );
};

export default Messages;
