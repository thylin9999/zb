
if (process.env.VUE_APP_MOCK) {
    require('mockjs')
    require('./modules/user')
    require('./modules/permission')
    require('./modules/competition')
}
