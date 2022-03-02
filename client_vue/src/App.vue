<template>
    <v-app>
        <v-app-bar app color="primary" dark >
            <v-toolbar-title>Trello Clone</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="!user">
                <v-btn text :to="{ name: 'login' }">Login</v-btn>
                <v-btn text :to="{ name: 'signup' }">SignUp</v-btn>
            </v-toolbar-items>
            <v-toolbar-items v-if="user">
                <v-layout justify-content align-center>
                    <h3>{{user.displayName}}</h3>
                    <v-avatar :size="40" color="grey lighten-4">
                        <img :src="user.imageUrl" alt="avatar">
                    </v-avatar>
                </v-layout>
                <v-btn text @click="logout">Logout</v-btn>
            </v-toolbar-items>
            </v-app-bar>

        <v-main>
            <router-view/>
        </v-main>
    </v-app>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex'
    export default {
        name: 'App',
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
               this.authLogout().then( () => this.$router.push('/login')  )
           }
       }
    }
</script>
