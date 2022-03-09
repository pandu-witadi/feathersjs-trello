<template>
    <div>
        <v-container fluid>
            <v-slide-y-transition mode="out-in">
                <v-layout column align-center>
                    <v-form
                        v-if="!loading"
                        v-model="valid"
                        @submit.prevent="signUp"
                        @keydown.prevent.enter
                      >
                        <v-text-field
                          v-model="user.email"
                          :rules="notEmptyRules"
                          label="Email"
                          required
                        ></v-text-field>

                        <v-text-field
                          v-model="user.displayName"
                          :rules="notEmptyRules"
                          label="displayName"
                          required
                        ></v-text-field>

                        <v-text-field
                          v-model="user.password"
                          :rules="notEmptyRules"
                          label="password"
                          type="password"
                          required
                        ></v-text-field>

                        <v-text-field
                          v-model="user.confirmPassword"
                          :rules="confirmPasswordRules"
                          label="confirmPassword"
                          type="password"
                          required
                        ></v-text-field>


                        <v-text-field
                          v-model="user.imageUrl"
                          :rules="notEmptyRules"
                          label="image Url"
                          type="imageUrl"
                          required
                        ></v-text-field>

                        <v-btn type="submit" :disabled="!valid">SignUp</v-btn>
                      </v-form>
                      <v-progress-circular
                        v-if="loading"
                        :size="70"
                        :width="7"
                        indetermine
                        color="primary">
                      </v-progress-circular>
                </v-layout>
            </v-slide-y-transition>
        </v-container>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { notEmptyRules } from '@/util/validators'

    export default {
        name: 'signUp',
        data: (vm) => ({
            valid: false,
            user: {
                email: '',
                password: '',
                confirmPassword: '',
                displayName: '',
                imageUrl: ''
            },
            notEmptyRules,
            confirmPasswordRules: [ (confirmPassword) => confirmPassword === vm.user.password || 'password must match']
        }),
        computed: {
            ...mapState('users', { loading: 'isCreatePending' })
        },
        methods: {
            signUp() {
                if (this.valid) {
                    const { User } = this.$FeathersVuex.api
                    const user = new User(this.user)
                    user.save().then( (user) => {
                        console.log(user)
                        this.$router.push('/login')
                    })
                }
            }
        }
    }
</script>
