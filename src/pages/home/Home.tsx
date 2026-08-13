import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Featured from "../../components/featured/Featured";
import Slide from "../../components/slide/Slide";
import TrustedBy from "../../components/trustedBy/TrustedBy";
import GigCard from "../../components/gigCard/GigCard";
import CatCard from "../../components/catCard/CatCard";
import { Loader, EmptyState } from "../../components/state/State";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import { categories } from "../../data";
import "./Home.scss";

type CategoryCount = { cat: string; count: number };

const Home = () => {
  // Real per-category totals; the grid used to be a hardcoded list of labels
  // that linked nowhere useful.
  const { data: counts } = useQuery<CategoryCount[]>({
    queryKey: ["categoryCounts"],
    queryFn: () => newRequest.get("/gigs/categories").then((res) => res.data),
  });

  // The second carousel used to render invented "projects" from a static file.
  const {
    isLoading: loadingPopular,
    error: popularError,
    data: popular,
  } = useQuery({
    queryKey: ["gigs", "popular"],
    queryFn: () =>
      newRequest.get("/gigs?sort=sales&limit=8").then((res) => res.data),
  });

  const countFor = (cat: string) =>
    counts?.find((c) => c.cat === cat)?.count ?? null;

  return (
    <div className="home">
      <Featured />
      <TrustedBy />

      <Slide slidesToShow={5} arrowsScroll={1}>
        {categories.map((category) => (
          <CatCard key={category.cat} {...category} />
        ))}
      </Slide>

      <div className="features">
        <div className="container">
          <div className="item">
            <h1>A whole world of freelance talent at your fingertips</h1>
            <div className="title">
              <img src="/img/check.png" alt="" />
              The best for every budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just project-based pricing.
            </p>
            <div className="title">
              <img src="/img/check.png" alt="" />
              Quality work done quickly
            </div>
            <p>
              Find the right freelancer to begin working on your project within
              minutes.
            </p>
            <div className="title">
              <img src="/img/check.png" alt="" />
              Protected payments, every time
            </div>
            <p>
              Always know what you'll pay upfront. Your payment isn't released
              until you approve the work.
            </p>
            <div className="title">
              <img src="/img/check.png" alt="" />
              24/7 support
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just project-based pricing.
            </p>
          </div>
          <div className="item">
            {/* public/img/video.mp4 does not ship with this repo, so the
                original <video> rendered as a broken player. */}
            <img
              src="/img/man.png"
              alt="A whole world of freelance talent"
              className="illustration"
            />
          </div>
        </div>
      </div>

      <div className="explore">
        <div className="container">
          <h1>Explore the marketplace</h1>
          <div className="items">
            {categories.map((category) => {
              const count = countFor(category.cat);
              return (
                <Link
                  className="link item"
                  to={`/gigs?cat=${category.cat}`}
                  key={category.cat}>
                  <img src={category.icon} alt="" />
                  <div className="line"></div>
                  <span>{category.title}</span>
                  <small>
                    {count === null
                      ? " "
                      : `${count} ${count === 1 ? "gig" : "gigs"}`}
                  </small>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="features dark">
        <div className="container">
          <div className="item">
            <h1>
              fiverr <i>business</i>
            </h1>
            <h1>
              A business solution designed for <i>teams</i>
            </h1>
            <p>
              Upgrade to a curated experience packed with tools and benefits,
              dedicated to businesses
            </p>
            <div className="title">
              <img src="/img/check.png" alt="" />
              Connect to freelancers with proven business experience
            </div>
            <div className="title">
              <img src="/img/check.png" alt="" />
              Get matched with the perfect talent by a customer success manager
            </div>
            <div className="title">
              <img src="/img/check.png" alt="" />
              Manage teamwork and boost productivity with one powerful workspace
            </div>
            <Link className="link" to="/gigs">
              <button>Explore Liverr Business</button>
            </Link>
          </div>
          <div className="item">
            {/* The old fiverr-res.cloudinary.com asset now 404s; swapped for a
                source that actually resolves. */}
            <img
              src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="A team collaborating"
              className="illustration"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="popular">
        <div className="container">
          <h1>Popular services right now</h1>
          {loadingPopular ? (
            <Loader label="Loading popular services..." />
          ) : popularError ? (
            <EmptyState
              variant="error"
              title="Couldn't load services"
              message={getErrorMessage(popularError)}
            />
          ) : popular?.length ? (
            <Slide slidesToShow={4} arrowsScroll={2}>
              {popular.map((gig: any) => (
                <GigCard key={gig._id} item={gig} />
              ))}
            </Slide>
          ) : (
            <EmptyState
              icon="🛠️"
              title="No services yet"
              message="Nothing has been published on the marketplace so far. Be the first to add one."
              actionLabel="Create a gig"
              actionTo="/add"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
