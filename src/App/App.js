import React, { useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { history } from '../components/Auth/helpers';
import { alertActions } from '../components/Auth/actions';
import { PrivateRoute } from '../components/Auth/route/PrivateRoute.js';
import LoginPage from '../components/Auth/LoginPage/Login.js';
import RegisterPage from '../components/Auth/RegisterPage/Register.js';
import VenueOverview from '../components/VenueOverview/Overview.js';
import VenueOverviewDetail from '../components/VenueOverview/OverviewDetail.js';
import AdminLayout from "layouts/Admin.js";
import PromiseService from '../services/PromiseService'

function App() {
    const alert = useSelector(state => state.alert);
    const dispatch = useDispatch();

    useEffect(() => {
        history.listen((location, action) => {
            // clear alert on location change
            // dispatch(alertActions.clear());
        });

    }, []);

    return (
        <div>
            {alert.message &&
                <div className={`alert ${alert.type}`}>{alert.message}</div>
            }
            <Router history={history}>
                <Switch>
                    <PrivateRoute exact path="/" component={LoginPage} />
                    <PrivateRoute path="/admin" component={AdminLayout} />
                    <Route path="/venueoverview" exact component={VenueOverview}/>
                    <Route path="/venueoverviewdetail" exact component={VenueOverviewDetail}/>
                    <Route path="/login" exact component={LoginPage} />
                    <Route path="/register" exact component={RegisterPage} />
                    <Redirect from="*" to="/" />

                </Switch>
            </Router>
        </div>
    );
}

export { App };
