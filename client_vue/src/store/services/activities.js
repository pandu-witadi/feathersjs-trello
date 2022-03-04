// src/store/services/users.js
import feathersClient, {
    makeServicePlugin,
    BaseModel
} from '../../feathers-client'

class Activity extends BaseModel {
    constructor(data, options) {
        super(data, options)
    }

    // Required for $FeathersVuex plugin to work after production transpile.
    static modelName = 'Activity'

    // Define default properties here
    static instanceDefaults() {
        return {
            text: '',
            boardId: '',
            userId: null,
            user: null
        }
    }

    // Updates `data.user` to be an instance of the `User` class.
    static setupInstance(data, { models }) {
        if (data.user) {
            data.user = new models.api.User(data.user)
        }
        return data
    }
}
const servicePath = 'activities'
const servicePlugin = makeServicePlugin({
    Model: Activity,
    service: feathersClient.service(servicePath),
    servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
    before: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },
    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },
    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
})

export default servicePlugin
