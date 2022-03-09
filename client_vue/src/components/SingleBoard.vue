<template>
    <div>
        <v-card>
            <v-img
            height="200px"
            :src="board.background"
            ></v-img>
            <v-card-title primary-title>
                <div class="headline">{{board.name}}</div>
            </v-card-title>
            <v-card-actions>
                <v-btn color="primary" :to="{ name: 'board', params: { id: board._id } }">Go</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    export default {
        props: ['board'],
    }
</script>
