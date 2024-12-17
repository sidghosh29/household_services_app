import Home from "../pages/HomePage.js";
import LoginPage from "../pages/LoginPage.js";
import CustomerRegisterPage from "../pages/CustomerRegisterPage.js";
import CustomerDashboardPage from "../pages/CustomerDashboardPage.js";
import CustomerDashboardRequestsPage from "../pages/CustomerDashboardRequestsPage.js";
import CustomerDashboardSearchPage from "../pages/CustomerDashboardSearchPage.js";
import SPDashboardPage from "../pages/SPDashboardPage.js";
import SPRegisterPage from "../pages/SPRegisterPage.js";
import AdminDashboardPage from "../pages/AdminDashboardPage.js";
import AdminDashboardMasterPage from "../pages/AdminDashboardMasterPage.js";
import AdminDashboardSearchPage from "../pages/AdminDashboardSearchPage.js";
import AdminDashboardSummaryPage from "../pages/AdminDashboardSummaryPage.js";

import store from "./store.js";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: LoginPage },
  { path: "/customer-register", component: CustomerRegisterPage },
  { path: "/sp-register", component: SPRegisterPage },

  {
    path: "/admin-dashboard",
    component: AdminDashboardPage,
    meta: { requiresLogin: true, role: "admin" },
  },

  {
    path: "/admin-dashboard-master",
    component: AdminDashboardMasterPage,
    meta: { requiresLogin: true, role: "admin" },
  },

  {
    path: "/admin-dashboard-search",
    component: AdminDashboardSearchPage,
    meta: { requiresLogin: true, role: "admin" },
  },

  {
    path: "/admin-dashboard-summary",
    component: AdminDashboardSummaryPage,
    meta: { requiresLogin: true, role: "admin" },
  },

  {
    path: "/customer-dashboard",
    component: CustomerDashboardPage,
    meta: { requiresLogin: true, role: "customer" },
  },

  {
    path: "/customer-dashboard-requests",
    component: CustomerDashboardRequestsPage,
    meta: { requiresLogin: true, role: "customer" },
  },

  {
    path: "/customer-dashboard-search",
    component: CustomerDashboardSearchPage,
    meta: { requiresLogin: true, role: "customer" },
  },

  {
    path: "/sp-dashboard",
    component: SPDashboardPage,
    meta: { requiresLogin: true, role: "service_professional" },
  },
];

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

//navigation guards
router.beforeEach((to, from, next) => {
  if (to.path == "/") {
    if (!store.state.loggedIn) {
      next();
    } else if (store.state.loggedIn && store.state.role == "admin") {
      next("/admin-dashboard");
    } else if (store.state.loggedIn && store.state.role == "customer") {
      next("/customer-dashboard");
    } else if (
      store.state.loggedIn &&
      store.state.role == "service_professional"
    ) {
      next("/sp-dashboard");
    }
  }

  if (to.matched.some((record) => record.meta.requiresLogin)) {
    if (!store.state.loggedIn) {
      next({ path: "/login" });
    } else if (to.meta.role && to.meta.role != store.state.role) {
      alert("Role not authorized");
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
