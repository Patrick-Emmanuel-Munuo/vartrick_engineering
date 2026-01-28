import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.css'  
//material design icon
import 'material-icons/iconfont/material-icons.css';
//bootsraps cssss
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <React.StrictMode>
     <App />
   </React.StrictMode>
);