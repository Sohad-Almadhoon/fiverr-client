import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "./Message.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import getCurrentUser from "../../utils/getUser";
import { Loader, EmptyState } from "../../components/state/State";

const Message = () => {
  const { id } = useParams();
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();

  // The conversation tells us who the other party is; without it the page only
  // knew about the logged-in user, so every bubble showed the same avatar and
  // the header showed your own name instead of the person you are talking to.
  const { data: conversation } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () =>
      newRequest.get(`/conversations/single/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const counterpartId = conversation
    ? conversation.sellerId === currentUser?._id
      ? conversation.buyerId
      : conversation.sellerId
    : null;

  const { data: counterpart } = useQuery({
    queryKey: ["user", counterpartId],
    queryFn: () =>
      newRequest.get(`/users/${counterpartId}`).then((res) => res.data),
    enabled: !!counterpartId,
  });

  const { isLoading, error, data } = useQuery({
    // Keyed by conversation id, otherwise switching threads shows the previous
    // one's messages from cache.
    queryKey: ["messages", id],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", id] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    },
    onError: (err) => alert(getErrorMessage(err)),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value.trim();
    if (!desc) return;
    mutation.mutate({
      conversationId: id,
      desc,
    });
    e.target[0].value = "";
  };

  // Newest message should be in view on open and after sending.
  const listRef = useRef(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [data]);

  const myRole =
    conversation && conversation.sellerId === currentUser?._id
      ? "seller"
      : "buyer";
  const theirRole = myRole === "seller" ? "buyer" : "seller";

  const avatarFor = (isOwn) =>
    (isOwn ? currentUser?.img : counterpart?.img) || "/img/noavatar.jpg";
  const nameFor = (isOwn) =>
    (isOwn ? currentUser?.username : counterpart?.username) || "User";

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link className="link" to="/messages">
            Messages
          </Link>{" "}
          &gt; {counterpart?.username || "..."} &gt;
        </span>

        {/* Who you are talking to, with their picture. */}
        <div className="peer">
          <img src={counterpart?.img || "/img/noavatar.jpg"} alt="" />
          <div className="peerInfo">
            <span className="name">{counterpart?.username || "Loading..."}</span>
            <span className="meta">
              {conversation ? `${theirRole} · you are the ${myRole}` : ""}
              {counterpart?.country ? ` · ${counterpart.country}` : ""}
            </span>
          </div>
        </div>

        {isLoading ? (
          <Loader label="Loading conversation..." />
        ) : error ? (
          <EmptyState
            variant="error"
            title="Couldn't load this conversation"
            message={getErrorMessage(error)}
            actionLabel="Back to messages"
            actionTo="/messages"
          />
        ) : !data?.length ? (
          <EmptyState
            icon="👋"
            title="No messages yet"
            message={`Send the first message to ${
              counterpart?.username || "them"
            }.`}
          />
        ) : (
          <div className="messages" ref={listRef}>
            {data?.map((m) => {
              const isOwn = m.userId === currentUser?._id;
              return (
                <div className={isOwn ? "owner item" : "item"} key={m._id}>
                  {/* Each bubble carries its own sender's picture; previously
                      every message showed the logged-in user's. */}
                  <img
                    src={avatarFor(isOwn)}
                    alt={nameFor(isOwn)}
                    title={nameFor(isOwn)}
                  />
                  <div className="bubble">
                    <span className="sender">
                      {isOwn ? "You" : nameFor(false)}
                    </span>
                    <p>{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea
            placeholder={`Write a message to ${
              counterpart?.username || "..."
            }`}
          />
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
