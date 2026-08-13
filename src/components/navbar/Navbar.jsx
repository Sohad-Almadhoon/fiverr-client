import { useEffect, useRef, useState } from "react";
import "./Navbar.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import getCurrentUser from "../../utils/getUser";
import { categories } from "../../data";

// Small inline icons so the menu reads as a menu rather than a list of links.
const Icon = ({ name }) => {
  const paths = {
    gigs: "M3 7h18M3 12h18M3 17h12",
    add: "M12 5v14M5 12h14",
    orders: "M6 2h9l5 5v15H6zM15 2v5h5",
    messages: "M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
};

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  // Mobile nav panel, separate from the profile dropdown above.
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  // Close both panels on navigation, or the menu stays open over the new page.
  useEffect(() => {
    setMenuOpen(false);
    setOpen(false);
  }, [pathname]);

  // The dropdown used to stay open until you clicked the avatar again, even
  // after clicking elsewhere on the page.
  const userRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const currentUser = getCurrentUser();

  // One account can both sell and buy, like the real site. isSeller lives in
  // the JWT, so the API re-issues the cookie and we refresh local state.
  const switchMode = useMutation({
    mutationFn: (isSeller) => newRequest.put("/users/mode", { isSeller }),
    onSuccess: (res) => {
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      // Orders and conversations are scoped by role, so their cache is stale.
      queryClient.clear();
      navigate(res.data.isSeller ? "/mygigs" : "/orders");
    },
    onError: (err) => alert(getErrorMessage(err)),
  });

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      // removeItem, not setItem(null) which stored the string "null". Clearing
      // the cache stops the next user seeing the previous one's data.
      localStorage.removeItem("currentUser");
      queryClient.clear();
      navigate("/login");
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">fiverr</span>
          </Link>
          <span className="dot">.</span>
        </div>
        <button
          className="burger"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>
        <div className={menuOpen ? "links open" : "links"}>
          <Link className="link" to="/gigs">
            Explore
          </Link>

          {currentUser ? (
            <>
              <button
                className="modeSwitch"
                disabled={switchMode.isPending}
                onClick={() => switchMode.mutate(!currentUser.isSeller)}>
                {switchMode.isPending
                  ? "Switching..."
                  : currentUser.isSeller
                  ? "Switch to Buying"
                  : "Switch to Selling"}
              </button>

              <div className="user" ref={userRef}>
                <button
                  type="button"
                  className="userTrigger"
                  aria-haspopup="menu"
                  aria-expanded={open}
                  onClick={() => setOpen((v) => !v)}>
                  <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
                  <span className="uname">{currentUser?.username}</span>
                  {currentUser.isSeller && (
                    <span className="badge">Seller</span>
                  )}
                  <svg
                    className={open ? "caret up" : "caret"}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {open && (
                  <div className="options" role="menu">
                    {/* Identity header - the old menu was five grey links with
                        no indication of whose account it belonged to. */}
                    <div className="who">
                      <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
                      <div className="whoText">
                        <span className="n">{currentUser?.username}</span>
                        <span className="r">
                          {currentUser.isSeller ? "Selling" : "Buying"} mode
                        </span>
                      </div>
                    </div>

                    {currentUser.isSeller && (
                      <>
                        <Link className="link item" role="menuitem" to="/mygigs">
                          <Icon name="gigs" /> Gigs
                        </Link>
                        <Link className="link item" role="menuitem" to="/add">
                          <Icon name="add" /> Add New Gig
                        </Link>
                      </>
                    )}
                    <Link className="link item" role="menuitem" to="/orders">
                      <Icon name="orders" /> Orders
                    </Link>
                    <Link className="link item" role="menuitem" to="/messages">
                      <Icon name="messages" /> Messages
                    </Link>

                    <hr className="sep" />
                    <button
                      type="button"
                      className="item danger"
                      role="menuitem"
                      onClick={handleLogout}>
                      <Icon name="logout" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link className="link" to="/register">
                Become a Seller
              </Link>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}

          {/* The category strip below is hidden on small screens to save
              vertical space, which left phones with no way to browse
              categories at all. They live in the menu panel instead. */}
          <div className="mobileCategories">
            <span className="heading">Browse categories</span>
            {categories.map((category) => (
              <Link
                className="link"
                to={`/gigs?cat=${category.cat}`}
                key={category.cat}>
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          {/* Driven by the shared category list, and each entry now filters
              real results instead of linking back to "/". */}
          <div className="menu">
            {categories.map((category) => (
              <Link
                className="link menuLink"
                to={`/gigs?cat=${category.cat}`}
                key={category.cat}>
                {category.title}
              </Link>
            ))}
          </div>
          <hr />
        </>
      )}
    </div>
  );
};

export default Navbar;
