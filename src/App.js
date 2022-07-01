import React, { useState } from 'react';
import './global.css';
import Routes from './routes';
import PusherContext from './context/PusherContext';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function App() {
  const [pedido, setPedido] = useState({});
  
  // require('dotenv').config();
  return (
    <PusherContext.Provider value={{pedido, setPedido}}>
    <Routes />
    </PusherContext.Provider>
  );
}

export default App;
