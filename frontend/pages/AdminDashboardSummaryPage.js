export default {
  template: `
  
  <div class="fade-in" style="padding: 10px;margin-left: 25px; margin-right:25px;">
    <h2 style="margin-top:10px;">Admin Dashboard - Summary</h2>

    <div>
      <canvas id="totalUsers"></canvas>
    </div>
    <hr>
    <div>
      <canvas id="serviceRequests"></canvas>
    </div>


    
  </div>
  
  `,

  data() {
    return {
      serviceRequests: [],
      services: [],
      customers: [],
      professionals: [],
      chart: null,
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

  async mounted() {
    await this.fetchServices();
    await this.fetchCustomers();
    await this.fetchProfessionals();
    await this.fetchServiceRequests();
    this.renderChart();
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

    renderChart() {
      const ctx1 = document.getElementById("totalUsers");
      this.chart = new Chart(ctx1, {
        type: "pie",
        data: {
          labels: ["Admin", "Customers", "Service Professionals"],
          datasets: [
            {
              label: "Total Users",
              data: [1, this.customers.length, this.professionals.length],
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
              ],
              //backgroundColor: "rgba(60, 179, 113,0.5)",
            },
          ],
        },
        options: {
          responsive: true,
        },
      });

      const requestedSRs = this.serviceRequests.filter(
        (r) => r.service_status === "requested"
      );

      const acceptedSRs = this.serviceRequests.filter(
        (r) => r.service_status === "accepted"
      );

      const finishedSRs = this.serviceRequests.filter(
        (r) => r.service_status === "completed" || r.service_status === "closed"
      );

      const ctx2 = document.getElementById("serviceRequests");
      this.chart = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: ["Total", "Requested", "Accepted", "Completed/Closed"],
          datasets: [
            {
              label: "Service Request Stats",
              data: [
                this.serviceRequests.length,
                requestedSRs.length,
                acceptedSRs.length,
                finishedSRs.length,
              ],
              backgroundColor: "rgba(60, 179, 113,0.5)",
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    },

    //end of methods
  },
};
