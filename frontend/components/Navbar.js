export default {
  template: `
  <div style="display: flex;justify-content: space-between;align-items: center;padding: 10px;border-bottom: 1px solid #ddd;">
  <div id="nav-bar">
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">
          <router-link to="/">
            <img
              src="./static/images/HSA Logo.png"
              style="padding: 10px"
              width="150"
              height="60"
            />
          </router-link>
          <span v-if="$store.state.loggedIn">Welcome, {{$store.state.email_id}}</span>
        </span>

        <div v-if="$store.state.loggedIn" class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- Admin Navbar Items-->
          <ul v-if="$store.state.role==='admin'" class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>

            <li class="nav-item">
                <router-link class="nav-link" to="/admin-dashboard-search">Search</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/admin-dashboard-summary">Summary</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/admin-dashboard-master">Master Data</router-link>
            </li>
          </ul>

          <!-- Customer Navbar Items-->
          <ul v-else-if="$store.state.role==='customer'" class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>

            <li class="nav-item">
                <router-link class="nav-link" to="/customer-dashboard-search">Search</router-link>
            </li>

            <li class="nav-item">
                <router-link class="nav-link" to="/customer-dashboard-requests">Service Requests</router-link>
            </li>
            
            
          </ul>



        </div>
      </div>
    </nav>
  </div>

  <div>
    <button v-if="$store.state.loggedIn" class="btn btn-secondary" style="margin-right:25px" @click="handleLogout">Logout</button>

    <router-link
      v-if="!$store.state.loggedIn && $route.path !== '/login'"
      to="/login"
      title="Login"
      style="color: seagreen"
      ><i class="bi bi-person h4" style="margin: 10px; cursor: pointer"></i
    ></router-link>
    <router-link
      v-if="!$store.state.loggedIn && $route.path == '/login'"
      to="/sp-register"
      class="btn btn-primary"
      style="background-color: #6e43e5; border-color: #6e43e5"
      >Register as a Professional</router-link
    >
  </div>
</div>

    `,

  methods: {
    handleLogout() {
      this.$store.commit("logout");
      this.$router.push("/"); // Redirect to the home screen
    },
  },
};

//#6e43e5
