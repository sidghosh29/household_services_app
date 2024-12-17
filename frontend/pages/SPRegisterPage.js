export default {
  template: `

    <div id="panel" class="fade-in">
            <div id="input-form" style="height:90%">
                <h2 class="center">Professional Sign-up</h2><br>
                
                <form @submit.prevent="submitRegister" method="POST" style="margin:10px" enctype="multipart/form-data">
                  

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
                        <input type="tel" class="form-control" id="phone" name="phone" placeholder="Enter your phone number" pattern="\\d{3}-\\d{3}-\\d{4}"  v-model="phone" required>
                        <div class="form-text">Format: 123-456-7890</div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="pincode" class="form-label">Pincode</label>
                        <input type="number" class="form-control" id="pincode" name="pincode" placeholder="Enter 6-digit pincode" pattern="\d{6}" maxlength="6" v-model="pincode" required>
                        
                    </div>

                    <div class="mb-3">
                      <label for="description" class="form-label">Description</label>
                      <textarea class="form-control" id="description" name="description" placeholder="Enter a brief description of your services" v-model="description"></textarea>
                    </div>

                    <div class="mb-3">
                      <label for="experience" class="form-label">Experience (in years)</label>
                      <input type="number" class="form-control" id="experience" name="experience" placeholder="Enter years of experience" v-model="experience" required>
                    </div>

                    <div class="mb-3">
                      <label for="service_type_id" class="form-label">Service Type</label>
                      <select class="form-control" id="service_type_id" v-model="service_type_id" required>
                        <option disabled value="">Select a Service Type</option>
                        <option v-for="serviceType in serviceTypes" :key="serviceType.id" :value="serviceType.id">{{ serviceType.name }}</option>
                      </select>
                    </div>

                    <div class="mb-3">
                      <label for="id_proof" class="form-label">Upload ID Proof</label>
                      <input type="file" class="form-control" id="id_proof" name="id_proof" @change="handleFileUpload" required>
                    </div>

                    <button type="submit" class="btn btn-success" style="background-color:#6e43e5; margin-top:10px">Register</button> <br><br>
                    <div v-if="message" :class="['alert', 'alert-' + messageType]" role="alert">
                      {{ message }}
                    </div>
                    <!-- Spinner (centered over the form) -->
                    <div v-if="loading" class="d-flex justify-content-center my-3">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div>Existing User? <router-link to='/login' style="margin-bottom:5px" class="btn btn-success">Login</router-link></div>      
                  </form>
            </div>
            
        </div>


    `,
  data() {
    return {
      email: null,
      password: null,
      role: "service_professionals",
      name: null,
      address: null,
      phone: null,
      pincode: null,
      description: null,
      experience: null,
      service_type_id: 1,
      services: [],
      serviceTypes: [],
      file: null,

      loading: false, // For managing the spinner
      message: null, // For success or error messages
      messageType: null, // To differentiate between success and error
    };
  },
  mounted() {
    this.fetchServices();
    this.fetchServiceTypes();
  },
  methods: {
    async fetchServices() {
      try {
        const res = await fetch(location.origin + "/api/services");
        if (res.ok) {
          const data = await res.json();
          this.services = data;
          console.log("Services fetched: ", this.services);
        } else {
          console.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },

    async fetchServiceTypes() {
      try {
        const res = await fetch(location.origin + "/api/service-types");
        if (res.ok) {
          const data = await res.json();
          this.serviceTypes = data;
          console.log("Service Types fetched: ", this.serviceTypes);
        } else {
          console.error("Failed to fetch service types");
        }
      } catch (error) {
        console.error("Error fetching service types:", error);
      }
    },

    // Handle the file input change event
    handleFileUpload(event) {
      this.file = event.target.files[0]; // Store the uploaded file
    },

    async submitRegister() {
      this.loading = true; // Show the spinner
      this.message = null; // Reset message
      this.messageType = null;

      if (
        !this.email ||
        !this.password ||
        !this.name ||
        !this.address ||
        !this.phone ||
        !this.pincode ||
        !this.service_type_id
      ) {
        alert("All fields are required.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("email", this.email);
        formData.append("password", this.password);
        formData.append("role", this.role);
        formData.append("name", this.name);
        formData.append("address", this.address);
        formData.append("phone", this.phone);
        formData.append("pincode", this.pincode);
        formData.append("description", this.description);
        formData.append("experience", this.experience);
        formData.append("service_type_id", this.service_type_id);

        if (this.file) {
          formData.append("file", this.file); // Append the file if selected
        }
        const res = await fetch(
          location.origin + "/service-professional-register",
          {
            method: "POST",
            body: formData,
          }
        );
        if (res.ok) {
          console.log("Registration successful");
          console.log(res);

          this.message = "Registration successful!";
          this.messageType = "success"; // Bootstrap success class

          setTimeout(() => {
            this.$router.push("/login");
          }, 3000); // 3 seconds delay
        } else {
          console.error(`Registration failed: ${res.status} ${res.statusText}`);
          this.message = `Registration failed: ${res.status} ${res.statusText}`;
          this.messageType = "danger"; // Bootstrap error class
        }
      } catch (error) {
        console.error("Error during registration:", error);
        this.message = `Error during registration: ${error.message}`;
        this.messageType = "danger";
      } finally {
        this.loading = false; // Hide the spinner
      }
    },
  },
};
