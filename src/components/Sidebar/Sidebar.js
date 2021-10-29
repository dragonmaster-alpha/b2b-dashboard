import React from "react";
import { useLocation, NavLink } from "react-router-dom";

import { Nav } from "react-bootstrap";

import { useTranslation } from 'react-i18next';

function Sidebar({routes }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  let user = JSON.parse(localStorage.getItem('user'));
  return (  
    <div className="sidebar">
  
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <a
            href="#"
            className="simple-text logo-mini mx-1"
          >
            <div >
              <img className="logo-img"
                src={require("assets/img/element/logo.png").default}
                alt="..."
              />
            </div>
          </a>          
        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (!user.superadmin && prop.name == "Users")
              return null;
            else {
            if (!prop.redirect)
              return (
                <li
                  className={
                    prop.upgrade
                      ? "active active-pro"
                      : activeRoute(prop.layout + prop.path)
                  }
                  key={key}
                >
                  <NavLink style={{"width":"230px"}}
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i style={{"marginLeft":"20px"}} className={prop.icon} />                    
                    <p>{t(prop.name)}</p>
                  </NavLink>
                </li>
              );
            }
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
