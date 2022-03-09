<template>
    <div>
        <v-container fluid>
            <v-slide-y-transition mode="out-in">
                <v-layout column align-center>
                    <v-form
                        v-if="!loading"
                        v-model="valid"
                        @submit.prevent="login"
                        @keydown.prevent.enter
                      >
                        <v-text-field
                          v-model="user.email"
                          :rules="notEmptyRules"
                          label="Email"
                          required
                        ></v-text-field>

                        <v-text-field
                          v-model="user.password"
                          :rules="notEmptyRules"
                          label="password"
                          type="password"
                          required
                        ></v-text-field>


                        <v-btn type="submit" :disabled="!valid">Login</v-btn>
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
    import { mapState, mapActions } from 'vuex'
    import { notEmptyRules } from '@/util/validators'

    export default {
        name: 'Login',
        data: (vm) => ({
            valid: false,
            user: {
                email: '',
                password: ''
            },
            notEmptyRules
        }),
        computed: {
            ...mapState('auth', { loading: 'isAuthenticatePending' })
        },
        methods: {
            ...mapActions('auth', ['authenticate']),
            login() {
                if (this.valid) {
                    this.authenticate({
                        strategy: 'local',
                        email: this.user.email,
                        password: this.user.password
                    }).then( () => {
                        this.$router.push('/boards')
                    }).catch( e => {
                        console.log('authentication error', e)
                    })
                }
            }
        }
    }
</script>

<style scope></style>
