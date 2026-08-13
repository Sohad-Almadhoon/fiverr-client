import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";
import { categories } from "../../data";

// The four "Popular:" chips were dead buttons with invented labels. These come
// from the shared category list and actually filter.
const POPULAR = categories.slice(0, 4);

function Featured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // A real <form>, so pressing Enter in the field searches. Before, only the
  // button worked and Enter did nothing at all.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = input.trim();
    navigate(term ? `/gigs?search=${encodeURIComponent(term)}` : "/gigs");
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span>freelance</span> services for your business
          </h1>
          <form className="search" onSubmit={handleSubmit}>
            <div className="searchInput">
              <img src="/img/search.png" alt="" />
              <input
                type="text"
                value={input}
                placeholder='Try "building a mobile app"'
                aria-label="Search services"
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button type="submit">Search</button>
          </form>
          <div className="popular">
            <span>Popular:</span>
            {POPULAR.map((category) => (
              <button
                type="button"
                key={category.cat}
                onClick={() => navigate(`/gigs?cat=${category.cat}`)}>
                {category.title}
              </button>
            ))}
          </div>
        </div>
        <div className="right">
          <img src="/img/man.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Featured;
