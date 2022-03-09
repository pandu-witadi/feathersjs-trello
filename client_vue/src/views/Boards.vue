<template>
    <div>
        <v-container fluid>
            <v-slide-y-transition mode="out-in">
                <v-layout row align-center>

                    <v-progress-circular
                      v-if="loading"
                      :size="70"
                      :width="7"
                      indetermine
                      color="primary">
                    </v-progress-circular>

                    <v-flex v-if="!loading" sm3 pa-2 v-for="board in boards" :key="board._id">
                        <single-board :board="board"></single-board>
                    </v-flex>

                    <new-board-form :creating="creating" :createBoard="createBoard"></new-board-form>

                </v-layout>
            </v-slide-y-transition>
        </v-container>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex'
    import NewBoardForm from '@/components/NewBoardForm'
    import SingleBoard from '@/components/SingleBoard'

    export default {
        name: 'boards',
        components: {
            'new-board-form': NewBoardForm,
            'single-board': SingleBoard,
        },
        computed: {
            ...mapGetters('auth', { user: 'user' } ),
            ...mapState('boards', {
                loading: 'isFindPending',
                creating: 'isCreatePending'
            }),
            ...mapGetters('boards', { findBoardsInStore: 'find' }),
            boards() {
                return this.user ? this.findBoardsInStore({ query: {} }).data : []
            }
        },
        methods: {
            ...mapActions('boards', { findBoards: 'find' }),
            async createBoard(board) {
                const { Board } = this.$FeathersVuex.api
                const newBoard = new Board(board)
                await newBoard.save()
            },
        },
        mounted() {
            this.findBoards({ query: {} })
        }
    }
</script>

<style scope></style>
