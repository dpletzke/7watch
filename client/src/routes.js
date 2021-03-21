/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Icons from "./views/Icons";
import Config from "./views/Config";
import Logs from "./views/Logs";
import GridView from "./views/GridView";

const dashboardRoutes = [
  {
    upgrade: true,
    path: "/upgrade",
    name: "Placeholder",
    icon: "nc-icon nc-alien-33",
    component: <div />,
    layout: "/admin",
  },
  {
    path: "/grid",
    name: "Grid",
    icon: "nc-icon nc-grid-45",
    component: GridView,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin",
  },
  {
    path: "/logs",
    name: "Hl7 Logs",
    icon: "nc-icon nc-single-copy-04",
    component: Logs,
    layout: "/admin",
  },
  {
    path: "/configuration",
    name: "Configuration",
    icon: "nc-icon nc-settings-gear-64",
    component: Config,
    layout: "/admin",
  },
];

export default dashboardRoutes;
