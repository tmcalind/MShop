import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';

import { 
  AUTH0_DOMAIN,
  AUTH0_CLIENTID,
  AUTH0_AUDIENCE,
  AUTH0_SCOPE
 } from './config'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={AUTH0_CLIENTID}
        redirectUri={window.location.origin}
        audience={AUTH0_AUDIENCE}
        scope={AUTH0_SCOPE}
      >
        <App />
      </Auth0Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

