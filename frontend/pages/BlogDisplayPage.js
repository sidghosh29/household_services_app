export default {
    props: ['id'],
    template: `
    <div>
        <h1>{{ blog?.title || 'Loading...' }}</h1>
        <p>Published: {{ formattedDate }}</p>
        <p>{{ blog?.caption || 'Loading...' }}</p>
        <img :src="blog.image_url"/>

        


    </div>
    `
    ,
    async created(){
        const res = await fetch(location.origin+"/api/blogs/"+this.id, {
            headers:{
                'Authentication-Token': this.$store.state.auth_token
            }});

            if(res.ok){
                this.blog = await res.json()
            }
            
    },

    data(){
        return {
            blog: null
        }
    },

    computed: {
        formattedDate(){
            if (this.blog){
                return new Date(this.blog.timestamp).toLocaleString()
            }
            else{
                return ''
            }
        }
    },
}