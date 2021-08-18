import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = "dev-lcyvugei.us.auth0.com";
const clientId = "tmWAmjhQbctY6Jv85jkQpp0FERgbSLqp"        // "jOBsoqPwliei6fEOsjsvPz1JRQIucGQx";
const audience = "https://dev-lcyvugei.us.auth0.com/api/v2/";
const scope = "read:current_user update:current_user_metadata";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        redirectUri={window.location.origin}
        audience={audience}
        scope={scope}
      >
        <App />
      </Auth0Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

