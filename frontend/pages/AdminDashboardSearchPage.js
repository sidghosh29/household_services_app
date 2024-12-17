export default {
  template: `
  
  <div class="fade-in" style="padding: 10px;margin-left: 25px; margin-right:25px;">
    <h2 style="margin-top:10px;">Admin Dashboard - Search Professionals</h2>
    <br>
    <h5 style="text-align: center;">What Service Professional are you looking for?</h5>

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

  </div>
</div>




    <br>
     <!-- Service Professionals Table -->
     <h3>Service Professionals</h3>
     <hr>
     <div class="table-responsive">
       <table class="table table-striped table-bordered">
         <thead class="table-warning">
           <tr>
             <th>#</th>
             <th>Professional ID</th>
             <th>Name</th>
             <th>Email</th>
             <th>Phone</th>
             <th>Address</th>
             <th>Pincode</th>
             <th>Experience</th>
             
             <th>Active Status</th>
             <th>Actions</th>
           </tr>
         </thead>
         <tbody>
           <tr v-for="(professional, index) in filteredProfessionals" :key="professional.id">
             <td>{{ index + 1 }}</td>
             <td>{{ professional.id }}</td>
             <td>{{ professional.name }}</td>
             <td>{{ professional.user.email }}</td>
             <td>{{ professional.phone }}</td>
             <td>{{ professional.address }}</td>
             <td>{{ professional.pincode }}</td>
             <td>{{ professional.experience }} years</td>
             


             <td v-if="professional.user.active==1">Active</td>
             <td v-else-if="professional.user.active==0">Pending Approval</td>
             <td v-else>Blocked</td>
             <td>
               <button v-if="professional.user.active !== 1" @click="approveUser(professional.user.id)" class="btn btn-success btn-sm">Approve</button>
               <button v-if="professional.user.active !== 2" @click="blockUser(professional.user.id)" class="btn btn-danger btn-sm">Block</button>
               <button @click="deleteSP(professional.id)" class="btn btn-danger btn-sm">Delete</button>
             </td>
           </tr>
         </tbody>
       </table>
     </div>

  </div>
  
  `,

  data() {
    return {
      searchTerm: "",
      serviceRequests: [],
      services: [],
      customers: [],
      professionals: [],

      selectedService: {
        id: null,
        service_type_id: null,
        name: "",
        description: "",
        price: 0,
        time_required: 0,
      },
    };
  },

  mounted() {
    this.fetchServices();
    this.fetchProfessionals();
    this.fetchServiceRequests();
  },

  computed: {
    filteredProfessionals() {
      if (!this.searchTerm.trim()) {
        return this.professionals;
      } else {
        const term = this.searchTerm.toLowerCase();
        return this.professionals.filter(
          (professional) =>
            professional.name.toLowerCase().includes(term) ||
            professional.user.email.toLowerCase().includes(term)
        );
      }
    },
  },

  methods: {
    openEditModal(service) {
      this.selectedService = { ...service }; // Shallow copy to avoid mutating the original data
    },
    openAddServiceModal() {
      this.selectedService = {
        id: null,
        service_type_id: null,
        name: "",
        description: "",
        price: 500,
        time_required: 0,
      };
    },

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

    async deleteService(service_id) {
      try {
        const res = await fetch(`/api/services/${service_id}`, {
          method: "DELETE",
          headers: { "Authentication-Token": this.$store.state.auth_token },
        });
        if (res.ok) {
          this.services = this.services.filter((s) => s.id !== service_id);
          alert("Service deleted successfully!");
        } else {
          console.error(`Failed to delete service: ${res.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    },

    async fetchServiceRequests() {
      try {
        this.serviceRequests = [];
        const res = await fetch(location.origin + "/api/service-requests");
        if (res.ok) {
          const data = await res.json();
          this.serviceRequests = data;
          console.log("All Service Requests fetched: ", this.serviceRequests);
        } else {
          console.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },

    // start of fetchCustomers()
    async fetchCustomers() {
      try {
        const res = await fetch(location.origin + "/api/customers");
        if (res.ok) {
          const data = await res.json();
          this.customers = data;
          console.log("Customers fetched: ", this.customers);
        } else {
          console.error("Failed to fetch customers");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    },

    // start of deleteCustomers()
    async deleteCustomer(customer_id) {
      try {
        const res = await fetch(`/api/customers/${customer_id}`, {
          method: "DELETE",
          headers: { "Authentication-Token": this.$store.state.auth_token },
        });
        if (res.ok) {
          this.customers = this.customers.filter((c) => c.id !== customer_id);
          alert("Customer deleted successfully!");
        } else {
          console.error(`Failed to delete customer: ${res.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    },

    // Start of fetchProfessionals()
    async fetchProfessionals() {
      try {
        const res = await fetch(location.origin + "/api/professionals");
        if (res.ok) {
          const data = await res.json();
          this.professionals = data;
          console.log("Professionals fetched: ", this.customers);
        } else {
          console.error("Failed to fetch professionals");
        }
      } catch (error) {
        console.error("Error fetching professionals:", error);
      }
    },

    // start of deleteSP()
    async deleteSP(id) {
      try {
        const res = await fetch(`/api/professionals/${id}`, {
          method: "DELETE",
          headers: { "Authentication-Token": this.$store.state.auth_token },
        });
        if (res.ok) {
          this.professionals = this.professionals.filter((sp) => sp.id !== id);
          alert("Service Professional deleted successfully!");
        } else {
          console.error(`Failed to delete professional: ${res.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting professional:", error);
      }
    },

    async approveUser(userId) {
      try {
        const response = await fetch(`/api/users/${userId}/approve`, {
          method: "POST",
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        });
        if (response.ok) {
          this.fetchCustomers();
          this.fetchProfessionals();
          alert("User approved successfully!");
        } else {
          console.error("Failed to approve user");
        }
      } catch (error) {
        console.error("Error approving user:", error);
      }
    },

    async blockUser(userId) {
      try {
        const response = await fetch(`/api/users/${userId}/block`, {
          method: "POST",
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        });
        if (response.ok) {
          this.fetchCustomers();
          this.fetchProfessionals();
          alert("User blocked successfully!");
        } else {
          console.error("Failed to block user");
        }
      } catch (error) {
        console.error("Error blocking user:", error);
      }
    },

    async updateService() {
      try {
        const response = await fetch(
          `/api/services/${this.selectedService.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": this.$store.state.auth_token,
            },
            body: JSON.stringify(this.selectedService),
          }
        );
        if (response.ok) {
          // Close the modal after successful update.
          const modalElement = document.getElementById("editServiceModal");
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

          // Refresh services data
          this.fetchServices();
          alert("Service updated successfully!");
        } else {
          console.error("Failed to update service");
        }
      } catch (error) {
        console.error("Error updating service:", error);
      }
    },

    async addService() {
      try {
        const response = await fetch(`/api/services`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.$store.state.auth_token,
          },
          body: JSON.stringify(this.selectedService),
        });
        if (response.ok) {
          // Close the modal after successful update.
          const modalElement = document.getElementById("addServiceModal");
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

          // Refresh services data
          this.fetchServices();
          alert("New Service added successfully!");
        } else {
          console.error("Failed to add a new service");
        }
      } catch (error) {
        console.error("Error adding a new service:", error);
      }
    },

    //end of methods
  },
};
