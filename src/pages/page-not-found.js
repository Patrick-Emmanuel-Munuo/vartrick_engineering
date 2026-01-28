import React from 'react';
import { Link } from 'react-router-dom';

const Found = React.memo(() => {
  // Set document title on mount
  React.useEffect(() => {
    document.title = 'Application | Page Not Found';
  }, []);

  return (
    <div className="section page-not-found d-flex flex-column align-items-center justify-content-center text-center">
      <h1 className="display-1 fw-bold mb-3">404</h1>
      <h2 className="mb-4 text-muted">The page you are looking for doesn't exist.</h2>
      
      <Link className="btn btn-info animate-fade" to="/dashboard">
        Back to Home
      </Link>
    </div>
  );
});

export default Found;
