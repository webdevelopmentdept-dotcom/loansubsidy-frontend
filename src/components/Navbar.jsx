import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/schemes", label: "Government Schemes" },
  { to: "/business-ideas", label: "Business Ideas" },
  { to: "/eligibility", label: "Eligibility" },
  { to: "/about", label: "About / Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          BUSINESSLOAN<span className="accent">SUBSIDY</span>
        </NavLink>

        <nav className="nav-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <NavLink to="/eligibility" className="btn btn-primary nav-cta">
          Check Eligibility
        </NavLink>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="nav-mobile">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/eligibility" className="nav-cta-mobile" onClick={() => setOpen(false)}>
            Check Eligibility →
          </NavLink>
        </div>
      )}
    </header>
  );
}
