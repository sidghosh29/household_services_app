const store = new Vuex.Store({
  state: {
    auth_token: null,
    role: null,
    loggedIn: false,
    user_id: null,
    email_id: null,
    customer_id: null,
    SP_id: null,
  },
  mutations: {
    setUser(state) {
      try {
        console.log("Inside setUser");
        if (JSON.parse(localStorage.getItem("user"))) {
          console.log("User Logged In");
          const user = JSON.parse(localStorage.getItem("user"));
          state.auth_token = user.token;
          state.role = user.role;
          state.loggedIn = true;
          state.user_id = user.id;
          state.email_id = user.email;
          state.SP_id = user.sp_id;
          state.customer_id = user.customer_id;
        }
      } catch (e) {
        console.warn("Not logged in");
        console.log(e);
      }
    },
    logout(state) {
      state.auth_token = null;
      state.role = null;
      state.loggedIn = false;
      state.user_id = null;

      localStorage.removeItem("user");
      //localStorage.removeItem("customer_id");
    },
  },
  actions: {
    //actions commit mutations and can be async
  },
});

/*store.commit("setUser");
console.log("Right after we commit setUser");
console.log(store.state);
if (store.state.role === "customer") {
  store.dispatch("fetchCustomerId");
}
if (store.state.role === "service_professional") {
  store.dispatch("fetchSPId");
}*/

store.commit("setUser");

export default store;
