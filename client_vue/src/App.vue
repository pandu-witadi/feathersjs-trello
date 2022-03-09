<template>
    <v-app>
        <app-navbar
            :user="user"
            :logout="logout"
        >
        </app-navbar>
        <v-main>
            <router-view/>
        </v-main>
        <v-footer :fixed="fixed" app>
            <span>&copy; 2022-02 - P&U</span>
        </v-footer>
    </v-app>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex'
    import  AppNavBar from '@/components/AppNavBar'

    export default {
        name: 'App',
        components: {
            'app-navbar': AppNavBar
        },
        data()  {
           return {
               fixed: false
           }
       },
       computed: {
            ...mapGetters('auth', { user: 'user' })
        },
       methods: {
           ...mapActions('auth', { authLogout: 'logout' } ),
           logout() {
               this.authLogout()
                .then( () => this.$router.push('/login')  )
           }
       }
    }
</script>
