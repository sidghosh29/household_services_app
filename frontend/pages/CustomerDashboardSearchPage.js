export default {
  template: `
  
  <div class="fade-in" style="padding: 10px;margin-left: 25px; margin-right:25px;">
    <h2>Customer Dashboard - Search Services</h2>
    <br>
    <h5 style="text-align: center;">What service are you looking for?</h5>
    
    <div class="search-container p-3 bg-light rounded shadow-sm">
      <div class="row g-3 align-items-center">
      <!-- Search Input -->
        <div class="col-md-6 col-lg-4">
          <div class="input-group">
            <span class="input-group-text bg-success text-white"><i class="bi bi-search"></i></span>
            <input
              type="text"
              class="form-control"
              v-model="searchTerm"
              placeholder="Search..."
            />
          </div>
        </div>

        <!-- Dropdown for Search Type -->
        <div class="col-md-4 col-lg-3">
        <select
          class="form-select"
          v-model="searchType"
          aria-label="Select Search Type"
        >
          <option disabled value="">Select a Search Criteria</option>
          <option value="service_name">Service Name</option>
          <option value="service_type_name">Service Type Name</option>
          <option value="pincode">Pin Code</option>
          <option value="address">Address</option>
        </select>
      </div>

    <!-- Search Button -->
    <div class="col-md-2 col-lg-2">
      <button
        class="btn btn-success w-100 d-flex align-items-center justify-content-center"
        @click=""
      >
        <i class="bi bi-search me-2"></i> Search
      </button>
    </div>
  </div>
</div>
<br>
    <!-- All Services -->

    <div>
      <h3 style=display:inline>Services</h3>
      <!-- Add Service Modal Trigger -->
    </div>
    <hr>
    <div class="table-responsive">
      <table class="table table-striped table-dark table-hover table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Service ID</th>
            <th width="12%">Service Type</th>
            <th>Name</th>
            <th>Description</th>
            <th width="10%">Price</th>
            <th>Time Required</th>
            <th width="12%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in filteredServices" :key="service.id">
            <td>{{ index + 1 }}</td>
            <td>{{ service.id }}</td>
            <td>{{ service.service_type.name}}</td>
            <td>{{ service.name }}</td>
            <td>{{ service.description }}</td>
            <td>INR {{ service.price }} /-</td>
            <td>{{ service.time_required }} min</td>
            <td>
            <button class="btn btn-success" @click="createServiceRequest(service.id)">Request</button>

            </td>
          </tr>
        </tbody>
      </table>
    </div>






  </div>
  
  `,

  data() {
    return {
      serviceProfessionals: [],
      serviceTypes: [],
      services: [],
      selectedServiceType: {
        id: null,
        name: "",
        type_name: "",
      },
      selectedService: {
        id: null,
        service_type_id: null,
        name: "",
        description: "",
        price: 0,
        time_required: 0,
      },

      searchType: "service_name",
      searchTerm: "",
    };
  },

  mounted() {
    this.fetchServices();
    this.fetchServiceTypes();
    this.fetchServiceProfessionals();
  },

  computed: {
    filteredServices() {
      if (!this.searchTerm.trim()) {
        return this.services;
      }
      const term = this.searchTerm.toLowerCase();
      if (this.searchType === "service_name") {
        return this.services.filter((service) =>
          service.name.toLowerCase().includes(term)
        );
      } else if (this.searchType === "service_type_name") {
        return this.services.filter((service) =>
          service.service_type.name.toLowerCase().includes(term)
        );
      } else if (this.searchType === "pincode") {
        console.log("Search Type is", "pincode");
        // Filter by services whose service_type_id matches the service professionals with the given pincode
        const matchingServiceTypeIds = this.getServiceTypeIdsForPincode(term);
        console.log("matchingServiceTypeIDs:", matchingServiceTypeIds);
        return this.services.filter((service) =>
          matchingServiceTypeIds.includes(service.service_type_id)
        );
      } else if (this.searchType === "address") {
        console.log("Search Type is", "address");
        // Filter by services whose service_type_id matches the service professionals with the given address
        const matchingServiceTypeIds = this.getServiceTypeIdsForAddress(term);
        console.log("matchingServiceTypeIDs:", matchingServiceTypeIds);
        return this.services.filter((service) =>
          matchingServiceTypeIds.includes(service.service_type_id)
        );
      }
      return this.services;
    },
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

    async fetchServiceProfessionals() {
      try {
        const res = await fetch(location.origin + "/api/professionals");
        if (res.ok) {
          const data = await res.json();
          this.serviceProfessionals = data;
          console.log(
            "Service Professionals fetched: ",
            this.serviceProfessionals
          );
        } else {
          console.error("Failed to fetch service professionals");
        }
      } catch (error) {
        console.error("Error fetching service professionals:", error);
      }
    },

    async createServiceRequest(service_id) {
      try {
        const response = await fetch(`/api/service-requests`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.$store.state.auth_token,
          },
          body: JSON.stringify({
            service_id,
            user_id: this.$store.state.user_id,
          }),
        });
        if (response.ok) {
          alert("New Service Request added successfully!");

          this.$router.push("/customer-dashboard-requests");
        } else {
          console.error("Failed to add a new service request");
        }
      } catch (error) {
        console.error("Error adding a new service request:", error);
      }
    },

    getServiceTypeIdsForPincode(pincode) {
      // Assuming `serviceProfessionals` contains all the ServiceProfessional data
      const matchingProfessionals = this.serviceProfessionals.filter(
        (professional) => professional.pincode.includes(pincode)
      );

      console.log("Post Pincode Filtering", this.matchingProfessionals);
      // Extract service_type_id from the matching professionals
      return matchingProfessionals.map(
        (professional) => professional.service_type_id
      );
    },

    getServiceTypeIdsForAddress(address) {
      console.log("address: ", address);
      // Assuming `serviceProfessionals` contains all the ServiceProfessional data
      const matchingProfessionals = this.serviceProfessionals.filter(
        (professional) => professional.address.includes(address)
      );

      console.log("Post Address Filtering", this.matchingProfessionals);
      // Extract service_type_id from the matching professionals
      return matchingProfessionals.map(
        (professional) => professional.service_type_id
      );
    },
    //end of methods
  },
};
