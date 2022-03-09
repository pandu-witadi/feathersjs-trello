<template>
    <div>
        <v-app-bar app color="primary" dark >

            <v-toolbar-title>
                <v-btn text :to="{ name: 'home' }">Trello Clone</v-btn>
            </v-toolbar-title>

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
    </div>
</template>

<script>
    export default {
        props: [ 'user', 'logout']
    }
</script>
