import React from "react";

const Footer = React.memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="footer hide-on-print">
      {/* Company Info */}
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
