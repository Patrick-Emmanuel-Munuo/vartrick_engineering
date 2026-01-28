import React from 'react';

const Footer = React.memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="footer hide-on-print">
      <div className="copyright">
        <strong>
          <a href="https://bmh.or.tz">
            Benjamin Mkapa Hospital BMH @ {currentYear}
          </a>
        </strong>
        . All Rights Reserved.
      </div>
      <div className="credits">
        Designed by <a href="tel:+25562544995">BMH Developer Team</a>
      </div>
    </footer>
  );
});

export default Footer;
