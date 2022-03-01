<template>
    <div>
        <pre>{{ boards }} </pre>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions } from 'vuex'

    export default {
        name: 'boards',
        data: () => ({
            valid: false,
            board: {
                name: '',
                background: ''
            },
            notEmptyRules: [ (value) => !!value || 'cannot be empty']
        }),
        computed: {
            // ...mapState('auth', { user: 'user' }),
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
            createBoard() {
                if (this.valid) {
                    const { Board } = this.$FeathersVuex.api
                    const board = new Board(this.board)
                    board.save()
                        .then( () => {
                            this.board = {
                                name: '',
                                background: ''
                            }
                    })
                }
            }
        },
        mounted() {
            this.findBoards({ query: {} })
            .then(response => {
                const boards = response.data || response
            })
        }
    }
</script>

<style scope></style>
