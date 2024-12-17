export default {
  template: `
  
  <div class="fade-in" style="padding: 10px;margin-left: 25px; margin-right:25px;">
    <h2 style="margin-top:10px">Admin Dashboard - Master Data</h2>
    <br>
    <!-- Services Type Table -->
    <div>
        <h3 style=display:inline>Service Types</h3>
        <!-- Add Service Modal Trigger -->
        <div style=display:inline>
            <a @click="openAddServiceTypeModal()" class="link-success"> <i style="margin:10px" data-bs-toggle="modal"
                    data-bs-target="#addServiceTypeModal" class="bi bi-plus-circle-fill h4"></i></a>
        </div>
    </div>
    <hr>
    <div class="table-responsive">
        <table class="table table-striped table-dark table-hover table-bordered">
            <thead>
                <tr>
                    <th>#</th>
                    <th width="12%">Service Type ID</th>
                    <th>Service Type Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(serviceType, index) in serviceTypes" :key="serviceType.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ serviceType.id }}</td>
                    <td>{{ serviceType.name}}</td>
                    
                    <td>
                        <button @click="openEditModal(serviceType)" class="btn btn-warning btn-sm" data-bs-toggle="modal"
                            data-bs-target="#editServiceTypeModal">Edit</button>
                        <button @click="deleteServiceType(serviceType.id)" class="btn btn-danger btn-sm">Delete</button>

                    </td>
                </tr>
            </tbody>
        </table>
    </div>


    <!-- Edit Service Modal -->
    <div class="modal fade" id="editServiceTypeModal" tabindex="-1" aria-labelledby="editServiceTypeModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editServiceTypeModalLabel">Edit Service Type</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="updateServiceType">
                        <div class="mb-3">
                            <label for="serviceTypeName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="serviceTypeName" v-model="selectedServiceType.name"
                                required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Add New Service Modal -->
    <div class="modal fade" id="addServiceTypeModal" tabindex="-1" aria-labelledby="addServiceTypeModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addServiceTypeModalLabel">Add Service Type</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="addServiceType">
                      <div class="mb-3">
                            <label for="serviceTypeName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="serviceTypeName" v-model="selectedServiceType.name"
                                required>
                      </div>
                      <button type="submit" class="btn btn-success">Add New Service</button>
                    </form>
                </div>
            </div>
        </div>
    </div>


</div>
  
  `,

  data() {
    return {
      serviceTypes: [],

      selectedServiceType: {
        id: null,
        name: "",
        type_image: "",
      },
    };
  },

  mounted() {
    this.fetchServiceTypes();
  },

  methods: {
    openEditModal(serviceType) {
      this.selectedServiceType = { ...serviceType }; // Shallow copy to avoid mutating the original data
    },
    openAddServiceTypeModal() {
      this.selectedServiceType = {
        id: null,
        name: "",
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
          console.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },

    async deleteServiceType(id) {
      try {
        const res = await fetch(`/api/service-types/${id}`, {
          method: "DELETE",
          headers: { "Authentication-Token": this.$store.state.auth_token },
        });
        if (res.ok) {
          this.serviceTypes = this.serviceTypes.filter((s) => s.id !== id);
          alert("Service Type deleted successfully!");
        } else {
          console.error(`Failed to delete service type: ${res.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    },

    async updateServiceType() {
      try {
        const response = await fetch(
          `/api/service-types/${this.selectedServiceType.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": this.$store.state.auth_token,
            },
            body: JSON.stringify(this.selectedServiceType),
          }
        );
        if (response.ok) {
          // Close the modal after successful update.
          const modalElement = document.getElementById("editServiceTypeModal");
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

          // Refresh services data
          this.fetchServiceTypes();
          alert("Service type updated successfully!");
        } else {
          console.error("Failed to update service type");
        }
      } catch (error) {
        console.error("Error updating service:", error);
      }
    },

    async addServiceType() {
      try {
        const response = await fetch(`/api/service-types`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.$store.state.auth_token,
          },
          body: JSON.stringify(this.selectedServiceType),
        });
        if (response.ok) {
          // Close the modal after successful update.
          const modalElement = document.getElementById("addServiceTypeModal");
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

          // Refresh services data
          this.fetchServiceTypes();
          alert("New Service Type added successfully!");
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
