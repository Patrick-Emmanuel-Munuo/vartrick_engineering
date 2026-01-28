import React from "react";

const Footer = React.memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="footer hide-on-print">
      <div className="footer-container">

        {/* Company Info */}
        <div className="footer-section">
          <h4>Vartrick Engineering</h4>
          <p>
            Professional electrical engineering, supply, installation, and
            maintenance services across Tanzania.
          </p>
        </div>

        {/* Contact Details */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p><strong>Phone:</strong> +255 625 449 995</p>
          <p><strong>Email:</strong> info@vartrick.or.tz</p>
          <p><strong>Location:</strong> Dodoma, Tanzania</p>
        </div>
,
        {/* Quick Links */}


      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="copyright">
          © {currentYear}{" "}
          <a href="https://vartrick.or.tz">
            <strong>Vartrick Engineering</strong>
          </a>
          . All Rights Reserved.
        </div>

        <div className="credits">
          Designed by{" "}
          <a href="tel:+25562544995">Vartrick Developer Team</a>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
