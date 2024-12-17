export default {
  template: `

    <div id="panel fade-in">
            <div id="input-form" style="height:90%">
                <h2 class="center">Customer Sign-up</h2>
                <form @submit.prevent="submitRegister" method="POST" style="margin:10px">

                    <div class="mb-3">
                        <label for="email" class="form-label">Email ID</label>
                        <input type="email" class="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter Email ID" v-model="email" required>
                        <div id="emailHelp" class="form-text">We'll never share your Email ID with anyone else.</div>
                    </div>
      
                    <div class="mb-3">
                        <label for="fullname" class="form-label">Full Name</label>
                        <input type="text" class="form-control" id="fullname" name="fullname" aria-describedby="userHelp" placeholder="Enter Your Full Name" v-model="name" required>
                    </div>

    
                    <div class="mb-3">
                      <label for="pwd" class="form-label">Password</label>
                      <input type="password" class="form-control" id="pwd" name="password" placeholder="Enter Your Password" v-model="password" required>
                    </div>
    
                    <div class="mb-3">
                        <label for="address" class="form-label">Address</label>
                        <input type="text" class="form-control" id="address" name="address" placeholder="Enter your address" v-model="address" required>
                    </div>

                    <div class="mb-3">
                        <label for="phone" class="form-label">Phone Number</label>
                        <input type="tel" class="form-control" id="phone" name="phone" placeholder="Enter your phone number" pattern="\d{3}[\-]\d{3}[\-]\d{4}" v-model="phone" required>
                        <div class="form-text">Format: 123-456-7890</div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="pincode" class="form-label">Pincode</label>
                        <input type="number" class="form-control" id="pincode" name="pincode" placeholder="Enter 6-digit pincode" pattern="\d{6}" maxlength="6" v-model="pincode" required>
                        
                    </div>

                    <button type="submit" class="btn btn-success" style="margin-top:10px">Register</button> <br><br>
                    
                    <div>Existing User? <router-link to='/login' style="margin-bottom:5px" class="btn btn-success">Login</router-link></div>      
                  </form>
            </div>
            
        </div>




    `,
  data() {
    return {
      email: null,
      password: null,
      role: "customer",
      name: null,
      address: null,
      phone: null,
      pincode: null,
    };
  },
  methods: {
    async submitRegister() {
      try {
        const res = await fetch(location.origin + "/customer-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            role: this.role,
            name: this.name,
            address: this.address,
            phone: this.phone,
            pincode: this.pincode,
          }),
        });
        if (res.ok) {
          console.log("Registration successful");
          console.log(res);
          this.$router.push("/login");
        } else {
          console.error(`Registration failed: ${res.status} ${res.statusText}`);
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    },
  },
};
