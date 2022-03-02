<template>
    <div>
        <v-flex sm12 pa-2 >
           <v-card-title primary-title style="flex-direction: column">
               <div class="headline">Create Card </div>
               <div>
                   <v-form
                       v-if="!creatingCard"
                       v-model="validCard"
                       @submit.prevent="createCard"
                       @keydown.prevent.enter>
                       <v-text-field
                         v-model="card.title"
                         :rules="notEmptyRules"
                         label="Title"
                         required
                       ></v-text-field>

                       <v-btn type="submit" :disabled="!validCard">Create Card</v-btn>
                   </v-form>
                   <v-progress-circular
                     v-if="creatingCard"
                     :size="70"
                     :width="7"
                     indetermine
                     color="primary">
                   </v-progress-circular>
               </div>
           </v-card-title>
        </v-flex>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name: 'create-card',
        props: [ 'listId', 'boardId'],
        data: () => ({
            validCard: false,
            creatingCard: false,
            card: {
                title: '',
                members: []
            },
            notEmptyRules: [ (value) => !!value || 'cannot be empty']
        }),
        computed: {
            ...mapState('cards', {
                creatingCard: 'isCreatePending'
            })
        },
        methods: {
            createCard() {
                if (this.validCard) {
                    const { Card } = this.$FeathersVuex.api
                    this.card.boardId = this.boardId
                    this.card.listId = this.listId
                    const card = new Card(this.card)
                    this.creatingCard = true
                    card.save()
                        .then( () => {
                            this.card = {
                                title: '',
                                members: []
                            }
                            this.creatingCard = false
                    })

                }
            }
        }
    }
</script>
