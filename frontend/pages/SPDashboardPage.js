export default {
  template: `
  
  <div class="fade-in" style="padding: 10px;margin-left: 25px; margin-right:25px;">
    <h2>Service Professional Dashboard</h2>
    <br>
    <h5 style="text-align: center;">Service Requests from Customers in {{type.name}}</h5>
    <hr>

    <div class="table-responsive">
  <table class="table table-striped table-dark table-hover table-bordered">
    <thead>
      <tr>
        <th>#</th>
        
        <th>Service Name</th>
        <th>Customer Name</th>
        <th>Professional Name</th>
        <th>Date of Request</th>
        <th>Date of Completion</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(request, index) in spServiceRequests" :key="request.id">
        <td>{{ index + 1 }}</td>
        
        <td>{{request.service.name}}</td>
        <td>{{request.customer.name}}</td>
        <td>{{ request.professional.name ? request.professional.name : 'Not Assigned' }}</td>
        <td>{{ new Date(request.date_of_request).toLocaleString() }}</td>
        <td v-if="request.service_status === 'completed' || request.service_status === 'closed'">{{ new Date(request.date_of_completion).toLocaleString() }}</td>
        <td v-else>Service Yet to be Completed or Closed</td>
        <td>{{ request.service_status }}</td>
        <td>
         
          <button v-if="request.service_status === 'requested'" 
                  @click="accept(request.id)" 
                  class="btn btn-success btn-sm">Accept</button>
          
          <button v-else-if="request.service_status !== 'requested' && request.service_status !== 'closed'" @click="close(request.id)" class="btn btn-secondary btn-sm">Close</button>
          <p v-else>No Further Action Required</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

    
    </div>
  </div>
  
  `,

  data() {
    return {
      type: {},
      serviceTypes: [],
      serviceRequests: [],
      spServiceRequests: [],
    };
  },

  created() {
    this.fetchSPServiceType();
  },

  methods: {
    async fetchSPServiceRequests() {
      try {
        this.serviceRequests = [];
        const res = await fetch(location.origin + "/api/service-requests");
        if (res.ok) {
          const data = await res.json();
          this.serviceRequests = data;
          console.log("All Service Requests fetched: ", this.serviceRequests);

          this.spServiceRequests = this.serviceRequests.filter(
            (r) =>
              r.service.service_type_id === this.type.id &&
              (r.professional_id === this.$store.state.SP_id ||
                r.service_status === "requested")
          );
          console.log("SP Service Requests: ", this.spServiceRequests);
        } else {
          console.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },
    async fetchSPServiceType() {
      try {
        const res = await fetch(location.origin + "/api/service-types");
        if (res.ok) {
          const data = await res.json();
          this.serviceTypes = data;
          console.log("Service Types fetched: ", this.serviceTypes);

          const response = await fetch(
            location.origin + "/api/professionals/" + this.$store.state.SP_id
          );
          if (response.ok) {
            const data = await response.json();
            const type_id = data.service_type_id;
            console.log("typeid", type_id);
            this.type = this.serviceTypes.filter(
              (type) => type.id === type_id
            )[0];
            console.log("type", this.type);
            this.fetchSPServiceRequests();
          } else {
            console.error("Failed to fetch professional");
          }
        } else {
          console.error("Failed to fetch service types");
        }
      } catch (error) {
        console.error("Failed to get service type of professional");
      }
    },

    async accept(requestId) {
      try {
        const payload = {
          service_status: "accepted",
          professional_id: this.$store.state.SP_id,
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
          console.log(`Service Request ${requestId} accepted successfully.`);
          this.fetchSPServiceRequests(); // Refresh the data
        } else {
          console.error(`Failed to accept Service Request ${requestId}`);
        }
      } catch (error) {
        console.error(`Error accepting Service Request ${requestId}:`, error);
      }
    },

    async close(requestId) {
      try {
        const payload = {
          service_status: "closed",
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
          console.log(`Service Request ${requestId} closed successfully.`);
          this.fetchSPServiceRequests(); // Refresh the data
        } else {
          console.error(`Failed to close Service Request ${requestId}`);
        }
      } catch (error) {
        console.error(`Error closing Service Request ${requestId}:`, error);
      }
    },

    //end of methods
  },
};
