import ServiceTypeCard from "../components/ServiceTypeCard.js";
export default {
  template: `
  
  <div class="fade-in" style="padding: 10px;margin-left: 25px; margin-right:25px;">
    <h2>Customer Dashboard</h2>
    <br>
    <h5 style="text-align: center;">What are you looking for?</h5>
    <hr>
    <!-- Service Types -->
    <div class="container text-center">
      <div class="row">
        <div v-for="type in serviceTypes" :key="type.id" class="col-4">
          <ServiceTypeCard @service-request-created="fetchServiceRequests" :type="type"></ServiceTypeCard>
          <br>
        </div>
      </div>
    </div>
  </div>
  
  `,

  data() {
    return {
      serviceTypes: [],
      service_requests: [],
      selectedServiceTypeType: {
        id: null,
        name: "",
        type_name: "",
      },
    };
  },

  mounted() {
    this.fetchServiceTypes();
    this.fetchServiceRequests();
  },

  methods: {
    async fetchServiceRequests() {
      try {
        this.service_requests = [];
        const res = await fetch(location.origin + "/api/service-requests");
        if (res.ok) {
          const data = await res.json();
          this.service_requests = data;
          console.log("All Service Requests fetched: ", this.service_requests);
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

    //end of methods
  },

  components: {
    ServiceTypeCard,
  },
};
