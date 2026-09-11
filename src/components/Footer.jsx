import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>BUSINESSLOANSUBSIDY.in</h4>
            <p style={{ color: "#cfd9e6", maxWidth: "42ch" }}>
              Government scheme information and business-loan assistance for entrepreneurs in
              Tamil Nadu.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <p><Link to="/schemes">Government Schemes</Link></p>
            <p><Link to="/business-ideas">Business Ideas</Link></p>
          </div>
          <div>
            <h4>Support</h4>
            <p><Link to="/eligibility">Check Eligibility</Link></p>
            <p><Link to="/about">Contact Us</Link></p>
          </div>
          <div>
            <h4>Legal</h4>
            <p><Link to="/about#terms">Terms &amp; Fee Disclosure</Link></p>
            <p><Link to="/about#privacy">Privacy</Link></p>
          </div>
        </div>

        <div className="footer-legal">
          <strong>Fee disclosure:</strong> No upfront payment is required for basic assistance.
          If a service/success fee applies, the exact amount and trigger will be disclosed to the
          customer in writing before any obligation arises. BUSINESSLOANSUBSIDY.in is a private
          assistance platform — not a Government of India or Government of Tamil Nadu website —
          and does not guarantee loan or subsidy approval.
          <br />
          © {year} BUSINESSLOANSUBSIDY.in. Scheme information is subject to change and to the
          latest official guidelines.
        </div>
      </div>
    </footer>
  );
}
