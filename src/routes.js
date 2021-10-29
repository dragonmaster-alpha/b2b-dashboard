import Home from "components/Home/Home.js";
import User from "components/User/User.js";
import Company from "components/Company/Company.js";
import Venue from "components/Venue/Venue.js";
import Setting from "components/Setting/Setting.js";

const HomeRoutes = [    
  {    
    path: "/home",
    name: "Home",
    icon: "nc-icon nc-bank",
    component: Home,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "Users",
    icon: "nc-icon nc-circle-09",
    component: User,
    layout: "/admin",
  },
  {
    path: "/company",
    name: "Companies",
    icon: "nc-icon nc-grid-45",
    component: Company,
    layout: "/admin",
  },
  {
    path: "/venue",
    name: "Venues",
    icon: "nc-icon nc-layers-3",
    component: Venue,
    layout: "/admin",
  },
  {
    path: "/setting",
    name: "Settings",
    icon: "nc-icon nc-settings-gear-64",
    component: Setting,
    layout: "/admin",
  } 
];

export default HomeRoutes;
