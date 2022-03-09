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
                              <single-list
                                :list="list"
                                :setDroppingList="setDroppingList"
                                :droppingList="droppingList"
                                :cardsByListId="cardsByListId"
                                :startDraggingCard="startDraggingCard"
                                :dropCard="dropCard"
                                :createActivity="createActivity"
                                :user="user ? user.user : {}"
                              ></single-list>
                              <!-- <v-card @dragover="setDroppingList($event, list)" :class="{ 'green lighten-4': droppingList == list}">
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

                              </v-card> -->
                          </v-flex>

                          <new-list-form
                              :creatingList="creatingList"
                              :createList="createList"
                            ></new-list-form>

                        </v-layout>

                        <v-progress-circular
                        v-if="creatingList"
                        :size="70"
                        :width="7"
                        indeterminate
                        color="primary">
                        </v-progress-circular>

                    </v-flex>
                    <v-flex xs2>
                        <activities :activitiesByDate="activitiesByDate"></activities>
                    </v-flex>

                </v-layout>
        </v-container>
    </div>
</template>

<script>
    import { mapState, mapActions, mapGetters } from 'vuex'

    import { notEmptyRules } from '@/util/validators'
    import NewListForm from '@/components/NewListForm'
    import SingleList from '@/components/SingleList'
    import Activities from '@/components/Activities'

    export default {
        name: 'board',
        components: {
            'new-list-form': NewListForm,
            'single-list': SingleList,
            'activities': Activities
        },
        data: () => ({
            board: {},
            notEmptyRules ,
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
                return this.findListsInStore({ query: { boardId: this.$route.params.id } }).data
            },
            cards() {
                return this.findCardsInStore({ query: { boardId: this.$route.params.id } }).data
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
                return this.findActivitiesInStore({ query: { boardId: this.$route.params.id } }).data
            },
            activitiesByDate() {
                return this.activities.slice().reverse();
            }
        },
        methods: {
        // ...mapMutations('board', ['setDroppingList', 'setDraggingCard']),
        ...mapActions('boards',  { getBoard: 'get' }),

        ...mapActions('lists',  { findLists: 'find' }),
        async createList(list) {
            const { List } = this.$FeathersVuex.api
            list.boardId = this.$route.params.id
            const newList = new List(list)
            newList.save()
                .then( () => {
                    this.list = {
                        name: '',
                        order: 0,
                        archived: false
                    }
                    const { Activity } = this.$FeathersVuex.api
                    const activity = new Activity()
                    activity.text = `${this.user.displayName} created list ${list.name}`
                    activity.boardId = this.$route.params.id
                    activity.save()
                })

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
            async createActivity(text) {
                const { Activity } = this.$FeathersVuex.api;
                const activity = new Activity();
                activity.text = text;
                activity.boardId = this.$route.params.id;
                activity.userId = this.user.userId;
                await activity.save();
            }
       },
       mounted() {
           this.getBoard( this.$route.params.id )
           this.findLists( { query: { boardId: this.$route.params.id} })
           this.findCards( { query: { boardId: this.$route.params.id} })
           this.findActivities( { query: { boardId: this.$route.params.id} })
       }
    }
</script>

<style scope></style>
