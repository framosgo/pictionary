import React from 'react';
import ReactDOM from 'react-dom';
import {SocketContext, socket} from './context/socket';
import Dummy from './components/Dummy';
import reportWebVitals from './reportWebVitals';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <Dummy />
    </SocketContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
