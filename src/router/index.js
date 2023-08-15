import Vue from 'vue'
import VueRouter from 'vue-router'
import BasicLayout from '@/views/Layout/BasicLayout'
import EmptyRouterView from '@/views/Layout/EmptyRouterView'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: BasicLayout,
        redirect: '/live-list/6'
        // children: [
        //     {
        //         path: '/home',
        //         name: 'Home',
        //         component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue'),
        //         meta: {
        //             icon: 'home',
        //             key: 'Home'
        //         }
        //     }
        // ]
    },
    {
        path: '/user',
        name: 'User',
        redirect: '/user/my',
        component: EmptyRouterView,
        children: [
            {
                path: '/user/my',
                name: 'My',
                component: () => import(/* webpackChunkName: "My" */ '../views/User/MyT.vue'),
                meta: {
                    icon: 'person',
                    key: 'My',
                    hideHeader: true
                }
            },
            {
                path: '/user/login',
                name: 'Login',
                component: () => import(/* webpackChunkName: "Login" */ '../views/User/Login.vue'),
                meta: {
                    hideFooter: true,
                    hideHeader: true
                }
            },
            {
                path: '/user/register',
                name: 'Register',
                component: () => import(/* webpackChunkName: "Register" */ '../views/User/Register.vue'),
                meta: {
                    hideFooter: true,
                    hideHeader: true
                }
            },
            {
                path: '/user/update-password',
                name: 'UpdatePassword',
                component: () => import(/* webpackChunkName: "UpdatePassword" */ '../views/User/UpdatePassword.vue'),
                meta: {
                    hideFooter: true,
                    hideHeader: true,
                    requireAuthorization: true
                }
            },
            {
                path: '/user/subscribe-host',
                name: 'SubscribeHost',
                component: () => import(/* webpackChunkName: "SubscribeHost" */ '../views/User/SubscribeHost.vue'),
                meta: {
                    hideFooter: true,
                    hideHeader: true,
                    requireAuthorization: true
                }
            },
            {
                path: '/user/book-list',
                name: 'BookList',
                component: () => import(/* webpackChunkName: "BookList" */ '../views/User/BookedMatches.vue'),
                meta: {
                    hideFooter: true,
                    hideHeader: true,
                    requireAuthorization: true
                }
            },
            {
                path: '/user/feedback',
                name: 'Feedback',
                component: () => import(/* webpackChunkName: "Feedback" */ '../views/User/Feedback.vue'),
                meta: {
                    hideFooter: true,
                    hideHeader: true
                }
            },
            {
                path: '/user/update-info',
                name: 'UpdateUserInfo',
                component: () => import(/* webpackChunkName: "UpdateUserInfo" */ '../views/Settings/UpdateUserInfo.vue'),
                meta: {
                    hideFooter: true,
                    hideHeader: true,
                    requireAuthorization: true
                }
            },
            {
                path: '/user/apply-host',
                name: 'ApplyHost',
                component: () => import(/* webpackChunkName: "ApplyHost" */ '../views/User/ApplyHost.vue'),
                meta: {
                    hideFooter: true,
                    hideHeader: true,
                    requireAuthorization: true
                }
            },
            {
                path: '/user/apply-expert',
                name: 'ApplyExpert',
                component: () => import(/* webpackChunkName: "ApplyExpert" */ '../views/User/ApplyExpert.vue'),
                meta: {
                    hideFooter: true,
                    hideHeader: true,
                    requireAuthorization: true
                }
            },
            {
                path: '/user/to-logout',
                name: 'ToLogout',
                component: () => import(/* webpackChunkName: "ToLogout" */ '../views/User/ToLogout.vue'),
                meta: {
                    hideFooter: true,
                    hideHeader: true,
                    requireAuthorization: true
                }
            }
        ]
    },
    {
        path: '/settings',
        name: 'Settings',
        component: EmptyRouterView,
        redirect: '/settings/index',
        meta: {
            hideFooter: true
        },
        children: [
            {
                path: '/settings/index',
                name: 'SettingIndex',
                component: () => import(/* webpackChunkName: "My" */ '../views/Settings/Index.vue'),
                meta: {
                    hideFooter: true,
                    hideHeader: true,
                    requireAuthorization: true
                }
            },
            {
                path: '/settings/forget-password',
                name: 'ForgetPassword',
                component: () => import(/* webpackChunkName: "My" */ '../views/User/UpdatePassword.vue'),
                meta: {
                    hideFooter: true,
                    hideHeader: true,
                    requireAuthorization: true
                }
            },
            {
                path: '/settings/update-phone',
                name: 'UpdatePhone',
                component: () => import(/* webpackChunkName: "My" */ '../views/User/UpdatePhone'),
                meta: {
                    hideFooter: true,
                    hideHeader: true,
                    requireAuthorization: true
                }
            }
        ]
    },
    {
        path: '/recommend',
        name: 'Recommend',
        component: () => import(/* webpackChunkName: "Recommend" */ '../views/Competition/Recommend.vue'),
        meta: {
            name: 'Recommend',
            key: 'LiveList',
            icon: 'competition'
        }
    },
    {
        path: '/live-list/:tab?',
        name: 'LiveList',
        component: () => import(/* webpackChunkName: "Recommend" */ '../views/Broadcast/live.vue'),
        meta: {
            name: 'LiveList',
            key: 'LiveList',
            icon: 'LiveList',
            hideHeader: true
        }
    },
    {
        path: '/download',
        name: 'Download',
        component: () => import(/* webpackChunkName: "Download" */ '../views/Broadcast/live.vue'),
        meta: {
            name: 'Download',
            icon: 'Download'
        }
    },
    {
        path: '/search-page',
        name: 'SearchPage',
        component: () => import(/* webpackChunkName: "SearchPage" */ '../views/SearchPage/Index.vue'),
        meta: {
            hideHeader: true,
            hideFooter: true
        }
    },
    {
        path: '/competition/:leagueType?',
        name: 'Competition',
        component: () => import(/* webpackChunkName: "Competition" */ '../views/Competition/Competition.vue'),
        meta: {
            name: 'Competition',
            key: 'Competition',
            icon: 'competition',
            hideHeader: true
        }
    },
    {
        path: '/broadcast/:id',
        name: 'Broadcast',
        component: () => import(/* webpackChunkName: "Broadcast" */ '../views/Broadcast/Index.vue'),
        props: true,
        meta: {
            hideFooter: true,
            hideHeader: true,
            icon: 'competition'
        }
    },
    {
        path: '/virutal-live/:id',
        name: 'VirtualLive',
        component: () => import(/* webpackChunkName: "VirtualLive" */ '../views/VirtualLive/Index.vue'),
        props: true,
        meta: {
            hideFooter: true,
            hideHeader: true,
            icon: 'competition'
        }
    },
    {
        path: '/guide',
        name: 'Guide',
        component: () => import(/* webpackChunkName: "Guide" */ '../views/Guide/Index.vue'),
        props: true,
        meta: {
            hideHeader: true,
            key: 'Guide'
        }
    },
    {
        path: '/news',
        redirect: '/news/index',
        name: 'News',
        component: EmptyRouterView,
        children: [
            {
                path: '/news/index',
                component: () => import(/* webpackChunkName: "Broadcast" */ '../views/News/Index.vue'),
                meta: {
                    key: 'News',
                    hideHeader: true
                }
            },
            {
                path: '/news/detail/:id',
                name: 'NewsDetail',
                component: () => import(/* webpackChunkName: "Broadcast" */ '../views/News/Detail.vue'),
                meta: {
                    key: 'News',
                    hideHeader: true
                }
            }
        ]
    },
    {
        path: '/about',
        name: 'About',
        component: EmptyRouterView,
        redirect: '/about/index',
        meta: {
            hideFooter: true,
            hideHeader: true,
            icon: 'competition'
        },
        children: [
            {
                path: '/about/index',
                name: 'AboutIndex',
                component: () => import(/* webpackChunkName: "My" */ '../views/About/Index'),
                meta: {
                    hideHeader: true,
                    hideFooter: true
                }
            },
            {
                path: '/about/protocol',
                name: 'Protocol',
                component: () => import(/* webpackChunkName: "My" */ '../views/About/Protocol'),
                meta: {
                    hideHeader: true,
                    hideFooter: true
                }
            },
            {
                path: '/about/policy',
                name: 'Policy',
                component: () => import(/* webpackChunkName: "My" */ '../views/About/Policy'),
                meta: {
                    hideHeader: true,
                    hideFooter: true
                }
            }
        ]
    },
    {
        path: '/events',
        name: 'Events',
        component: EmptyRouterView,
        redirect: '/event/index',
        meta: {
            hideFooter: true,
            icon: ''
        },
        children: [
            {
                path: '/event/index',
                name: 'EventIndex',
                component: () => import(/* webpackChunkName: "My" */ '../views/Event/Index'),
                meta: {
                    hideFooter: true
                }
            }
        ]
    }
    // {
    //     path: '/world-cup',
    //     name: 'WorldCup',
    //     component: () => import(/* webpackChunkName: "Home" */ '../views/WorldCup/index'),
    //     meta: {
    //         hideFooter: true
    //     }
    // }
]

const router = new VueRouter({
    routes
})

export default router
