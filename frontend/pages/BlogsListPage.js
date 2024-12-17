import BlogCard from "../components/ServiceTypeCard.js";

export default {
  template: `
    <div class="p-4">
        <h1>Blog List</h1>
        <h6>{{$store.state.auth_token}}</h6>
        
        <BlogCard v-for="blog in blogs" :key="blog.id" :title="blog.title" :date="blog.timestamp" :author_id="blog.user_id" :blog_id="blog.id"></BlogCard>
      
        
        
    </div>
    `,

  data() {
    return {
      blogs: [],
    };
  },

  async mounted() {
    console.log("Token: ", JSON.parse(localStorage.getItem("user")).token);

    const res = await fetch(location.origin + "/api/blogs", {
      headers: {
        "Authentication-Token": this.$store.state.auth_token,
      },
    });

    this.blogs = await res.json();
  },

  components: {
    BlogCard,
  },
};
