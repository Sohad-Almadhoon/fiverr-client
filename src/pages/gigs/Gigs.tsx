import { useEffect, useRef, useState } from "react";
import GigCard from "../../components/gigCard/GigCard";
import { Loader, EmptyState } from "../../components/state/State";
import "./Gigs.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import { Link, useLocation } from "react-router-dom";
import { categoryTitle } from "../../data";

const Gigs = () => {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);
  const { search } = useLocation();

  // Built with URLSearchParams: concatenating onto an empty `search` produced
  // "/gigs&min=..." with no "?", which the API answered with a 404.
  const buildQuery = () => {
    const params = new URLSearchParams(search);
    const min = minRef.current?.value;
    const max = maxRef.current?.value;
    if (min) params.set("min", min);
    else params.delete("min");
    if (max) params.set("max", max);
    else params.delete("max");
    params.set("sort", sort);
    return params.toString();
  };

  const { isLoading, error, data, refetch, isFetching } = useQuery({
    queryKey: ["gigs", search, sort],
    queryFn: () =>
      newRequest.get(`/gigs?${buildQuery()}`).then((res) => {
        return res.data;
      }),
  });

  const reSort = (type: string) => {
    setSort(type);
    setOpen(false);
  };
  useEffect(() => {
    refetch();
  }, [refetch, sort]);
  const apply = () => {
    refetch();
  };

  const params = new URLSearchParams(search);
  const cat = params.get("cat");
  const searchTerm = params.get("search");
  const heading = searchTerm
    ? `Results for "${searchTerm}"`
    : categoryTitle(cat || undefined);

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">
          <Link className="link" to="/">
            fiverr
          </Link>{" "}
          &gt; {heading} &gt;
        </span>
        <h1>{heading}</h1>
        <p>
          {searchTerm
            ? "Services matching your search."
            : cat
            ? `Browse every service in ${categoryTitle(cat)}.`
            : "Browse every service on the marketplace."}
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" min="0" placeholder="min" />
            <input ref={maxRef} type="number" min="0" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales"
                ? "Best Selling"
                : sort === "totalStars"
                ? "Top Rated"
                : "Newest"}
            </span>
            <img src="/img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              /* "Popular" used to re-trigger the same "sales" sort as "Best
                 Selling"; it now sorts by rating, which is a distinct order. */
              <div className="rightMenu">
                {sort !== "sales" && (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                {sort !== "createdAt" && (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                )}
                {sort !== "totalStars" && (
                  <span onClick={() => reSort("totalStars")}>Top Rated</span>
                )}
              </div>
            )}
          </div>
        </div>

        {isLoading || isFetching ? (
          <Loader label="Loading services..." />
        ) : error ? (
          <EmptyState
            variant="error"
            title="Couldn't load services"
            message={getErrorMessage(error)}
            actionLabel="Try again"
            onAction={() => refetch()}
          />
        ) : data?.length ? (
          <div className="cards">
            {data.map((gig: any) => (
              <GigCard key={gig._id} item={gig} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title="No services found"
            message={
              searchTerm || cat
                ? "Nothing matches these filters yet. Try a different category or widen your budget range."
                : "No services have been published yet."
            }
            actionLabel="Browse all services"
            actionTo="/gigs"
          />
        )}
      </div>
    </div>
  );
};

export default Gigs;
