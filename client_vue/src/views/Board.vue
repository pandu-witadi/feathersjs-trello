<template>
    <div>
        <!-- <pre>{{ board }}</pre> -->

        <v-container fluid>
                <v-layout>
                    <v-flex xs10>
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

                        <v-progress-circular


                    </v-flex>
                    <v-flex xs2>
                        <v-card>
                            <v-card-title primary-title>
                                <div><h3 class="headline mb-0">Activities</h3></div>
                            </v-card-title>
                            <v-list three-line>
                                <v-list-tile v-for="activity in activities" :key="activity._id" @click="">
                                    <v-list-tile-action>
                                        <v-icon color="green">mdi-ticket</v-icon>
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        <v-list-tile-sub-title v-text="activity.text"></v-list-tile-sub-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list>
                        </v-card>
                    </v-flex>

                </v-layout>
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
            ...mapGetters('auth', { user: 'user' }),

            ...mapState('boards ', {
                loadingBoard: 'isGetPending',
                // boardsError: 'errorOnGet'
            }),
            ...mapState('lists ', {
                loadingLists: 'isFindPending',
                creatingList: 'isCreatePending',
                // listsError: 'errorOnFind'
            }),
            // ...mapState('cards ', {
            //     cardsError: 'errorOnFind'
            // }),
            ...mapGetters('lists', { findListsInStore: 'find'}),
            ...mapGetters('cards', { findCardsInStore: 'find' }),
            lists() {
                return this.findListsInStore({
                            query: { boardId: this.$route.params.id }
                       }).data
            },
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
            },

            ...mapGetters('activities', { findActivitiesInStore: 'find' }),
            activities() {
                return this.findActivitiesInStore({
                            query: { boardId: this.$route.params.id }
                       }).data
            },

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
                            const { Activity } = this.$FeathersVuex.api
                            const activity = new Activity()
                            activity.text = `${this. user.displayName} created List ${list.name}`
                            activity.boardId = this.$route.params.id
                            activity.save()
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
            },

            ...mapActions('activities',  { findActivities: 'find' }),
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

           this.findActivities( { query: { boardId: this.$route.params.id} })
           .then( response => {
                this.activities = response.data || response
           })

       }
    }
</script>

<style scope></style>
