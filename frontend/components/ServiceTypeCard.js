export default {
  props: ["type"],
  template: `
    <div style="width: 18rem;">
        <div class="card" style="width: 18rem;">
            <img :src="type.type_image" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">{{type.name}}</h5>
                <a @click="fetchSpecificServices(type.id)" class="btn btn-success" data-bs-toggle="modal" :data-bs-target="'#modal-' + type.id">Choose a Service</a>
            </div>
        </div>

        <div class="modal fade" :id="'modal-' + type.id" tabindex="-1" :aria-labelledby="'modalLabel-' + type.id" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="'modalLabel-' + type.id">Book Your Service</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="list-group">
                            <p v-if="filtered_services.length===0">No Services available for booking yet.</p>
                            <button v-else v-for="service in filtered_services" :key="service.id" type="button" class="list-group-item list-group-item-action" :class="{ 'bg-success text-white': isHovered === service.id }" @mouseover="isHovered = service.id" @click="createServiceRequest(service.id, 'modal-' + type.id)">
                            <h6>{{service.name}} | {{service.description}} | INR {{service.price}} /- | {{service.time_required}} min.</h6>
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    `,

  data() {
    return {
      services: [],
      filtered_services: [],
      service_requests: [],
      isHovered: null,
    };
  },
  computed: {
    formattedDate() {
      return new Date(this.date).toLocaleString();
    },
  },

  methods: {
    async fetchSpecificServices(type_id) {
      try {
        this.filtered_services = [];
        const res = await fetch(location.origin + "/api/services");
        if (res.ok) {
          const data = await res.json();
          this.services = data;
          console.log("All Services fetched: ", this.services);
          this.filtered_services = this.services.filter(
            (s) => s.service_type_id === type_id
          );
          console.log(
            this.type.name,
            "Specific Services fetched: ",
            this.filtered_services
          );

          console.log(this.filtered_services[0].name);
        } else {
          console.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },

    async createServiceRequest(service_id, modal_id) {
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
          this.$emit("service-request-created"); // Emit event to parent
          alert("New Service Request added successfully!");
          // Close the modal after successful update.
          const modalElement = document.getElementById(modal_id);
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
          this.$router.push("/customer-dashboard-requests");
        } else {
          console.error("Failed to add a new service request");
        }
      } catch (error) {
        console.error("Error adding a new service request:", error);
      }
    },
  },
};
