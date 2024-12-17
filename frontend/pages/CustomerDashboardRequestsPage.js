export default {
  template: `
  
  <div class="fade-in" style="padding: 10px;margin-left: 25px; margin-right:25px;">
    <h2>Customer Dashboard - Service Requests</h2>
    <br>
    
    <!-- Service Requests Table -->

    <div class="table-responsive">
      <table class="table table-striped table-dark table-hover table-bordered">
        <thead>
          <tr>
            <th>#</th>
            
            <th>Service Name</th>
            
            <th>Professional Name</th>
            <th>Date of Request</th>
            <th>Date of Completion</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Rating</th>
            <th>Actions</th>
           
          </tr>
        </thead>
        <tbody>
          <tr v-for="(request, index) in serviceRequests" :key="request.id">
            <td>{{ index + 1 }}</td>
            
            <td>{{request.service.name}}</td>
            
            <td>{{ request.professional.name ? request.professional.name : 'Not Assigned' }}</td>
            <td>{{ new Date(request.date_of_request).toLocaleString() }}</td>
            <td v-if="request.service_status === 'completed' || request.service_status === 'closed'">{{ new Date(request.date_of_completion).toLocaleString() }}</td>
            <td v-else>NA</td>
            <td>{{ request.service_status }}</td>
            <td>{{ request.remarks }}</td>
            <td v-if="request.rating!==0">{{ request.rating }}</td>
            <td v-else>NA</td>
            <td>
            
            <!--  <button v-if="request.service_status !== 'closed'" 
                      @click="markAsCompleted(request.id)" 
                      class="btn btn-success btn-sm">Mark as Completed</button>
              <button v-if="request.service_status !== 'closed'" @click="deleteRequest(request.id)" class="btn btn-danger btn-sm">Delete</button>-->

              <button v-if="request.service_status !== 'closed' && request.service_status !== 'completed'" 
                      @click="openEditModal(request)" 
                      class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#editServiceRequestModal">Mark Completed</button>
              <button v-if="request.service_status === 'requested'" @click="deleteRequest(request.id)" class="btn btn-danger btn-sm">Delete</button>
            </td>
           
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Update Service Request Modal -->
    <div class="modal fade" id="editServiceRequestModal" tabindex="-1" aria-labelledby="editServiceRequestModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editServiceRequestModalLabel">Please provide a service rating</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="markAsCompleted(selectedServiceRequest.id)">
              <div class="mb-3">
                <label for="rating" class="form-label">Rating</label>
                <select v-model="selectedServiceRequest.rating" class="form-control" id="rating" required>
                  <option disabled value="">Select a rating</option>
                  <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
                <div id="stars">
                  <span data-value="1">★</span>
                  <span data-value="2">★</span>
                  <span data-value="3">★</span>
                  <span data-value="4">★</span>
                  <span data-value="5">★</span>
                </div>
              </div>

              <div class="mb-3">
                <label for="remarks" class="form-label">Remarks</label>
                <input type="text" class="form-control" id="remarks" v-model="selectedServiceRequest.remarks">
              </div>
              <button type="submit" class="btn btn-primary">Mark As Completed</button>
            </form>
          </div>
        </div>
      </div>
  </div>




  </div>
  
  `,

  data() {
    return {
      serviceRequests: [],
      selectedServiceRequest: {},
    };
  },

  mounted() {
    this.fetchServiceRequests();
  },

  methods: {
    openEditModal(request) {
      request.rating = 5;
      this.selectedServiceRequest = { ...request }; // Shallow copy to avoid mutating the original data

      const starsContainer = document.getElementById("stars");

      // Update stars based on the current rating
      const updateStars = (value) => {
        document.querySelectorAll("#stars span").forEach((s) => {
          s.style.color = s.dataset.value <= value ? "gold" : "gray";
        });
      };

      // Initial setup: show the current rating
      updateStars(this.selectedServiceRequest.rating);

      document.querySelectorAll("#stars span").forEach((star) => {
        star.addEventListener("click", () => {
          const value = star.dataset.value;
          this.selectedServiceRequest.rating = value; // Update the rating
          updateStars(value); // Reflect the new rating
        });

        star.addEventListener("mouseover", () => {
          const value = star.dataset.value;
          updateStars(value); // Temporarily show hovered rating
        });
      });

      starsContainer.addEventListener("mouseleave", () => {
        updateStars(this.selectedServiceRequest.rating);
      });
    },

    async fetchServiceRequests() {
      try {
        this.service_requests = [];
        const res = await fetch(location.origin + "/api/service-requests");
        if (res.ok) {
          const data = await res.json();
          this.serviceRequests = data;
          console.log("All Service Requests fetched: ", this.serviceRequests);
          this.serviceRequests = this.serviceRequests.filter(
            (r) => r.customer_id === this.$store.state.customer_id
          );
          console.log(
            "Customer Service Requests fetched: ",
            this.serviceRequests
          );
        } else {
          console.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },

    async markAsCompleted(requestId) {
      try {
        const payload = {
          service_status: "completed",
          rating: this.selectedServiceRequest.rating,
          remarks: this.selectedServiceRequest.remarks,
        };
        const res = await fetch(
          `${location.origin}/api/service-requests/${requestId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": this.$store.state.auth_token, // Adjust as needed
            },
            body: JSON.stringify(payload),
          }
        );

        if (res.ok) {
          // Close the modal after successful update.
          const modalElement = document.getElementById(
            "editServiceRequestModal"
          );
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

          console.log(`Service Request ${requestId} closed successfully.`);
          this.fetchServiceRequests(); // Refresh the data
        } else {
          console.error(`Failed to close Service Request ${requestId}`);
        }
      } catch (error) {
        console.error(`Error closing Service Request ${requestId}:`, error);
      }
    },

    async deleteRequest(id) {
      try {
        const res = await fetch(`/api/service-requests/${id}`, {
          method: "DELETE",
          headers: { "Authentication-Token": this.$store.state.auth_token },
        });
        if (res.ok) {
          this.fetchServiceRequests();
          alert("Service Request deleted successfully!");
        } else {
          console.error(`Failed to delete service request: ${res.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting service request:", error);
      }
    },

    //end of methods
  },
};
