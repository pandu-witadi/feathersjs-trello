<template>
    <div>
        <!-- <pre>{{ board }}</pre> -->
        <v-container fluid>
            <v-slide-y-transition mode="out-in">
                <v-layout row wrap>

                    <v-progress-circular
                      v-if="loadingBoard || loadingLists"
                      :size="70"
                      :width="7"
                      indetermine
                      color="primary">
                    </v-progress-circular>
                    <v-flex xs12>
                        <h2 v-if="board">{{ board.name }}</h2>
                    </v-flex>

                    <v-flex v-if="!loadingLists" sm3 pa-2 v-for="list in lists" :key="list._id">
                        <v-card @dragover="setDroppingList($event, list)" :class="{ 'green lighten-4': droppingList == list}">
                            <v-card-title primary-title>
                                <v-layout column>
                                    <v-flex xs12>
                                        <div class="headline">{{ list.name }}</div>
                                    </v-flex>

                                    <v-flex xs12 v-if="cardsByListId[list._id]" v-for="card in cardsByListId[list._id]" :key="card._id" class="pa-1">
                                        <v-card draggable="true" @dragstart="startDraggingCard(card)" @dragend="dropCard()">
                                            <v-container fluid grid-list-lg>
                                                <v-layout row>
                                                    <v-flex xs12>
                                                        <div class="headline">
                                                            {{ card.title }}
                                                        </div>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-card>
                                    </v-flex>

                                </v-layout>
                            </v-card-title>

                            <v-card-actions>
                                <create-card :listId="list._id" :boardId="$route.params.id"></create-card>
                            </v-card-actions>

                        </v-card>
                    </v-flex>

                    <v-flex sm4 pa-2 >
                        <v-card-title primary-title style="flex-direction: column">
                           <div class="headline">Create List</div>
                           <div>
                               <v-form
                                   v-if="!creatingList"
                                   v-model="validList"
                                   @submit.prevent="createList"
                                   @keydown.prevent.enter>
                                   <v-text-field
                                     v-model="list.name"
                                     :rules="notEmptyRules"
                                     label="Name"
                                     required
                                   ></v-text-field>

                                   <v-btn type="submit" :disabled="!validList">Create List</v-btn>
                               </v-form>
                               <v-progress-circular
                                 v-if="creatingList"
                                 :size="70"
                                 :width="7"
                                 indetermine
                                 color="primary">
                               </v-progress-circular>
                           </div>
                        </v-card-title>
                    </v-flex>

                </v-layout>
            </v-slide-y-transition>
        </v-container>
    </div>
</template>

<script>
    import { mapState, mapActions, mapGetters } from 'vuex'
    import CreateCard from '../components/CreateCard'

    export default {
        name: 'board',
        components: {
            CreateCard
        },
        data: () => ({
            board: {},

            validList: false,
            list: {
                name: '',
                order: 0,
                archived: false
            },
            notEmptyRules: [ (value) => !!value || 'cannot be empty'],
            droppingList: null,


            draggingCard: null
        }),
        computed: {
            ...mapState('boards ', {
                loadingBoard: 'isGetPending'
            }),
            ...mapState('lists ', {
                loadingLists: 'isFindPending',
                creatingList: 'isCreatePending'
            }),
            ...mapGetters('lists', { findListsInStore: 'find'}),
            lists() {
                return this.findListsInStore({
                            query: { boardId: this.$route.params.id }
                       }).data
            },

            ...mapGetters('cards', { findCardsInStore: 'find' }),
            cards() {
                return this.findCardsInStore({
                             query: { boardId: this.$route.params.id }
                        }).data
            },
            cardsByListId() {
                return this.cards.reduce( (byId, card) => {
                    byId[card.listId] = byId[card.listId] || []
                    byId[card.listId].push(card)
                    return byId
                }, {})
            }

        },
        methods: {
           ...mapActions('boards',  { getBoard: 'get' }),

           ...mapActions('lists',  { findLists: 'find' }),
            createList() {
                if (this.validList) {
                    const { List } = this.$FeathersVuex.api
                    this.list.boardId = this.$route.params.id
                    const list = new List(this.list)
                    list.save()
                        .then( () => {
                            this.list = {
                                name: '',
                                order: 0,
                                archived: false
                            }
                        })
                }
            },
            setDroppingList(event, list) {
                this.droppingList = list

                //allowed dropping event
                event.preventDefault()
            },


            ...mapActions('cards',  { findCards: 'find' }),
            startDraggingCard(card) {
                this.draggingCard = card
            },
            dropCard() {
                if (this.droppingList) {
                    this.draggingCard.listId = this.droppingList._id

                    // will automatically sync with feathersjs backend
                    this.draggingCard.save()
                }
                this.droppingList = null
                this.draggingCard = null
            }
       },
       mounted() {
           this.getBoard( this.$route.params.id )
           .then( response => {
                this.board = response.data || response
           })

           this.findLists( { query: { boardId: this.$route.params.id} })
           .then( response => {
                this.lists = response.data || response
           })

           this.findCards( { query: { boardId: this.$route.params.id} })
           .then( response => {
                this.cards = response.data || response
           })
       }
    }
</script>

<style scope></style>
