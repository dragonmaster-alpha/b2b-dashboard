import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { store } from './components/Auth/helpers';
import { App } from './App/App.js';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "./assets/css/custom.css";
import "@fortawesome/fontawesome-free/css/all.min.css";


render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
