const Home = {
  template: `
  <div>
    <div v-if="loading" class="loading-screen">
        <img src="./static/images/HSA Logo.png" alt="App Logo" class="loading-logo">
        <div class="loading-line"></div>
    </div>
    <div class="fade-in" style="padding:10px;margin-left: 25px; margin-right:25px">
      <h1>Home services at your finger tips</h1>
      <br>
      <div class="container text-center">
        <div class="row">
          <div v-for="type in serviceTypes" :key="type.id" class="col">
            <div class="card" style="width: 18rem;">
              <img :src="type.type_image" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">{{type.name}}</h5>
                
              </div>
            </div>
            <br>
          </div>

        </div>
      </div>
    </div>
    </div>`,

  data() {
    return {
      serviceTypes: [],
      loading: true,
    };
  },

  async mounted() {
    await this.fetchServiceTypes();
    setTimeout(() => {
      this.loading = false; // Hide loading screen after data is loaded
    }, 1500);
  },

  methods: {
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
  },
};

export default Home;
