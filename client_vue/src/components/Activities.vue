<template>
    <v-layout row fill-height style="align-items:stretch;">
        <v-flex xs12>
            <v-card height="100%">
                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0">Activities</h3>
                    </div>
                </v-card-title>
                <v-list three-line>
                    <v-list-item v-for="activity in activitiesByDate" :key="activity._id" @click="">
                        <v-list-item-action>
                            <v-icon color="green">mdi-ticket</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <!-- <v-list-tile-title v-text="activity.userId"></v-list-tile-title> -->
                            <v-list-item-subtitle  v-text="activity.text"></v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        props: ['activitiesByDate']
    }
</script>
