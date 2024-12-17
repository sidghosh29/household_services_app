export default {
  template: `
    <!--<div>
        <input placeholder="email" v-model="email"/>
        <input placeholder="password" v-model="password"/>
        <button class='btn btn-primary' @click="submitLogin">Login</button>
    </div>-->

    <div id="panel" class="fade-in">
            <div id="input-form">
                <h1 class="center">User Login</h1>
                
                <form @submit.prevent="submitLogin" method="POST" style="margin:10px">
                    <div class="mb-3">
                        <label for="emailid" class="form-label">Email ID</label>
                        <input type="email" v-model="email" class="form-control" id="emailid" aria-describedby="userHelp" name="username" placeholder="Enter your registered email id..." required>
                        <div id="userHelp" class="form-text">We'll never share your username with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label for="pwd" class="form-label">Password</label>
                        <input type="password" v-model="password" class="form-control" id="pwd" name="password" placeholder="Enter Password" required>
                    </div>

                    <div v-if="loginError" class="alert alert-danger" style="padding:5px" role="alert">
                      {{ loginError }}
                    </div>
                                
                    <button type="submit" style="margin-top:10px" class="btn btn-success">Login</button><br><br>
                    <div>New to HSA? <router-link to='/customer-register' style="margin-bottom:5px" class="btn btn-success">Register as a Customer</router-link></div>      
                </form>
                  
            </div>
            <br>
        </div>
    `,
  data() {
    return {
      email: null,
      password: null,
      loginError: null,
    };
  },
  methods: {
    async submitLogin() {
      try {
        const res = await fetch(location.origin + "/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        if (res.ok) {
          console.log("we are logged in");
          console.log(res);
          const data =
            await res.json(); /*declaring the variable 'data' is mandatory
                    because modern JavaScript environments, including most ES modules and frameworks like Vue, 
                    enforce strict mode by default. In strict mode, any attempt to assign a value to an undeclared 
                    variable throws a ReferenceError. This mode is automatically enabled in modules, which are the 
                    standard for structuring JavaScript in frameworks and modern browsers.
                    */
          console.log("Login Response Data: ", data);
          console.log("After serializing: ", JSON.stringify(data));
          localStorage.setItem("user", JSON.stringify(data));
          this.$store.commit("setUser");

          this.loginError = null;
          if (data.role == "admin") {
            this.$router.push("admin-dashboard");
          } else if (data.role == "customer") {
            this.$router.push("customer-dashboard");
          } else if (data.role == "service_professional") {
            console.log("Pushing to SP dashboard");
            this.$router.push("sp-dashboard");
          }
        } else {
          const data = await res.json();
          if (data.message.includes("block")) {
            this.loginError = data.message;
            console.log(data.message);
          } else if (data.message.includes("review")) {
            this.loginError = data.message;
            console.log(data.message);
          } else {
            this.loginError =
              "Wrong email or password. Try again, create an account, or reach out to the admin.";
            console.error(`Login failed: ${res.status} ${res.statusText}`);
          }
        }
      } catch (error) {
        console.error("Error during login:", error);
        this.loginError = "An error occurred. Please try again later.";
      }
    },
  },
};
