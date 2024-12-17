export default {
  template: `
  
  <div class="fade-in" style="padding: 10px;margin-left: 25px; margin-right:25px;">
    <h2 style="margin-top:10px;">Admin Dashboard</h2>
    <br>

    <!-- Service Requests Table -->
    <div>
      <h3 style=display:inline>Service Requests</h3>
      <!-- Add Download CSV Button -->
      <div style=display:inline>
        <a @click="download_sr_csv" class="link-success" style="cursor: pointer;"> <i style="margin:10px" class="bi bi-download h4"></i></a>
      </div>
    </div>
    <hr>
    <div class="table-responsive">
      <table class="table table-striped table-dark table-hover table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>SR ID</th>
            <th>Service ID</th>
            <th>Customer ID</th>
            <th>Professional ID</th>
            <th>Date of Request</th>
            <th>Date of Completion</th>
            <th>Service Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sr, index) in serviceRequests" :key="sr.id">
            <td>{{ index + 1 }}</td>
            <td>{{ sr.id }}</td>
            <td>{{ sr.service_id}}</td>
            <td>{{ sr.customer_id }}</td>
            <td>{{ sr.professional.name ? sr.professional.name : 'Not Assigned' }}</td>
            <td>{{ new Date(sr.date_of_request).toLocaleString() }}</td>
            <td>{{new Date(sr.date_of_completion).toLocaleString()}}</td>
            <td>{{sr.service_status}}</td>
            <td>{{sr.remarks}}</td>
          </tr>
        </tbody>
      </table>
    </div>















    <!-- Services Table -->
    <div>
      <h3 style=display:inline>Services</h3>
      <!-- Add Service Modal Trigger -->
      <div style=display:inline>
        <a @click="openAddServiceModal()" class="link-success" style="cursor: pointer;"> <i style="margin:10px" data-bs-toggle="modal" data-bs-target="#addServiceModal" class="bi bi-plus-circle-fill h4"></i></a>
      </div>
    </div>
    <hr>
    <div class="table-responsive">
      <table class="table table-striped table-dark table-hover table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Service ID</th>
            <th>Service Type</th>
            <th>Name</th>
            <th>Description</th>
            <th width="10%">Price</th>
            <th>Time Required</th>
            <th width="12%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in services" :key="service.id">
            <td>{{ index + 1 }}</td>
            <td>{{ service.id }}</td>
            <td>{{ service.service_type.name}}</td>
            <td>{{ service.name }}</td>
            <td>{{ service.description }}</td>
            <td>INR {{ service.price }} /-</td>
            <td>{{ service.time_required }} min</td>
            <td>
              <button @click="openEditModal(service)" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editServiceModal">Edit</button>
              <button @click="deleteService(service.id)" class="btn btn-danger btn-sm">Delete</button>

            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <!-- Edit Service Modal -->
    <div class="modal fade" id="editServiceModal" tabindex="-1" aria-labelledby="editServiceModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editServiceModalLabel">Edit Service</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateService">
              <div class="mb-3">
                <label for="serviceName" class="form-label">Name</label>
                <input type="text" class="form-control" id="serviceName" v-model="selectedService.name" required>
              </div>
              <div class="mb-3">
                <label for="serviceDescription" class="form-label">Description</label>
                <input type="text" class="form-control" id="serviceDescription" v-model="selectedService.description" required>
              </div>
              <div class="mb-3">
                <label for="servicePrice" class="form-label">Price</label>
                <input type="number" class="form-control" id="servicePrice" v-model="selectedService.price" required>
              </div>
              <div class="mb-3">
                <label for="serviceTime" class="form-label">Time Required (min)</label>
                <input type="number" class="form-control" id="serviceTime" v-model="selectedService.time_required" required>
              </div>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
  </div>

   <!-- Add New Service Modal -->
   <div class="modal fade" id="addServiceModal" tabindex="-1" aria-labelledby="addServiceModalLabel" aria-hidden="true">
   <div class="modal-dialog">
     <div class="modal-content">
       <div class="modal-header">
         <h5 class="modal-title" id="addServiceModalLabel">Add Service</h5>
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body">
         <form @submit.prevent="addService">
            <div class="mb-3">
              <select class="form-select" v-model="selectedService.service_type_id" aria-label="Select Search Type">
                <option disabled value="">Select a Service Type</option>
                <option v-for="type in serviceTypes" :key="type.id" :value="type.id">{{type.name}}</option>
            </select>
            </div>
           <div class="mb-3">
             <label for="serviceName" class="form-label">Name</label>
             <input type="text" class="form-control" id="serviceName" v-model="selectedService.name" placeholder="Please add the name of your service" required>
           </div>
           <div class="mb-3">
             <label for="serviceDescription" class="form-label">Description</label>
             <input type="text" class="form-control" id="serviceDescription" placeholder="Please add a meaningful description of your service" v-model="selectedService.description" required>
           </div>
           <div class="mb-3">
             <label for="servicePrice" class="form-label">Price</label>
             <input type="number" class="form-control" id="servicePrice" v-model="selectedService.price" required>
           </div>
           <div class="mb-3">
             <label for="serviceTime" class="form-label">Time Required (min)</label>
             <input type="number" class="form-control" id="serviceTime" v-model="selectedService.time_required" required>
           </div>
           <button type="submit" class="btn btn-success">Add New Service</button>
         </form>
       </div>
     </div>
   </div>
</div>








    <!-- Additional tables for Customers, Service Professionals, Service Requests would follow a similar format -->
    <br>
    <!-- Customers Table -->
    <h3>Customers</h3>
    <hr>
    <div class="table-responsive">
      <table class="table table-striped table-light table-hover table-bordered">
        <thead class="table-success">
          <tr>
            <th>#</th>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Pincode</th>
            <th>Active Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(customer, index) in customers" :key="customer.id">
            <td>{{ index + 1 }}</td>
            <td>{{ customer.id }}</td>
            <td>{{ customer.name }}</td>
            <td>{{ customer.user.email }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.address }}</td>
            <td>{{ customer.pincode }}</td>
            <td v-if="customer.user.active==1">Active</td>
            <td v-else-if="customer.user.active==0">Pending Approval</td>
            <td v-else>Blocked</td>
            <td>
              <button v-if="customer.user.active !== 1" @click="approveUser(customer.user.id)" class="btn btn-success btn-sm">Approve</button>
              <button v-if="customer.user.active !== 2" @click="blockUser(customer.user.id)" class="btn btn-danger btn-sm">Block</button>
              <button @click="deleteCustomer(customer.id)" class="btn btn-danger btn-sm">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
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
           <tr v-for="(professional, index) in professionals" :key="professional.id">
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
      serviceRequests: [],
      services: [],
      customers: [],
      professionals: [],
      serviceTypes: [],

      selectedService: {
        id: null,
        service_type_id: 1,
        name: "",
        description: "",
        price: 0,
        time_required: 0,
      },
    };
  },

  async mounted() {
    await this.fetchServiceTypes();
    this.fetchServices();
    this.fetchCustomers();
    this.fetchProfessionals();
    this.fetchServiceRequests();
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

    async download_sr_csv() {
      const res = await fetch(location.origin + "/create-sr-csv");
      if (res.ok) {
        const task_id = (await res.json()).task_id;
        const interval = setInterval(async () => {
          const res = await fetch(location.origin + "/get-sr-csv/" + task_id);
          if (res.ok) {
            console.log("data is ready");
            window.open(location.origin + "/get-sr-csv/" + task_id);
            clearInterval(interval);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(intervalId);
          console.log("Interval stopped");
        }, 30000); // Stops after 30 seconds
      }
    },

    //end of methods
  },
};
