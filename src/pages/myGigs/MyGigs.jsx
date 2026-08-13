import React from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import { Loader, EmptyState } from "../../components/state/State";
import { categoryTitle } from "../../data";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["myGigs", currentUser?._id],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => {
        return res.data;
      }),
    enabled: !!currentUser?._id,
  });
  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGigs"] });
      queryClient.invalidateQueries({ queryKey: ["categoryCounts"] });
    },
    onError: (err) => alert(getErrorMessage(err)),
  });
  const handleDelete = (id, title) => {
    // Deleting a gig also removes its reviews and pending orders.
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      mutation.mutate(id);
    }
  };

  // Seller-only page: a buyer landing here should be told, not shown an empty
  // table.
  if (currentUser && !currentUser.isSeller) {
    return (
      <div className="myGigs">
        <div className="container">
          <EmptyState
            icon="🎨"
            title="You're in buying mode"
            message="Switch to selling from the navbar to create and manage your own gigs."
            actionLabel="View your orders"
            actionTo="/orders"
          />
        </div>
      </div>
    );
  }

  const totals = (data || []).reduce(
    (acc, g) => ({
      views: acc.views + (g.views || 0),
      sales: acc.sales + (g.sales || 0),
    }),
    { views: 0, sales: 0 }
  );

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>Gigs</h1>
          <Link to="/add">
            <button>Add New Gig</button>
          </Link>
        </div>

        {isLoading ? (
          <Loader label="Loading your gigs..." />
        ) : error ? (
          <EmptyState
            variant="error"
            title="Couldn't load your gigs"
            message={getErrorMessage(error)}
            actionLabel="Try again"
            onAction={() => refetch()}
          />
        ) : data?.length ? (
          <>
            {/* Reach at a glance - views were tracked but never surfaced. */}
            <div className="stats">
              <div className="stat">
                <span className="value">{data.length}</span>
                <span className="label">Active gigs</span>
              </div>
              <div className="stat">
                <span className="value">{totals.views}</span>
                <span className="label">Total views</span>
              </div>
              <div className="stat">
                <span className="value">{totals.sales}</span>
                <span className="label">Total sales</span>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Views</th>
                  <th>Sales</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* data-label drives the stacked card layout under 768px. */}
                {data.map((gig) => (
                  <tr key={gig._id}>
                    <td data-label="Image">
                      <Link to={`/gig/${gig._id}`}>
                        <img className="image" src={gig.cover} alt="" />
                      </Link>
                    </td>
                    <td data-label="Title">
                      <Link className="link" to={`/gig/${gig._id}`}>
                        {gig.title}
                      </Link>
                    </td>
                    <td data-label="Category">{categoryTitle(gig.cat)}</td>
                    <td data-label="Price">${gig.price}</td>
                    <td data-label="Views">{gig.views || 0}</td>
                    <td data-label="Sales">{gig.sales || 0}</td>
                    <td data-label="Action">
                      <img
                        className="delete"
                        src="/img/delete.png"
                        alt="Delete"
                        onClick={() => handleDelete(gig._id, gig.title)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <EmptyState
            icon="🎨"
            title="You haven't created any gigs"
            message="Publish your first service and it will appear on the marketplace right away."
            actionLabel="Create your first gig"
            actionTo="/add"
          />
        )}
      </div>
    </div>
  );
}

export default MyGigs;
