import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'

/************************************************************************/

Vue.use(Router);

const router = new Router({
    routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
    next()
});

router.afterEach(to => {
    window.scrollTo(0, 0)
});

export default router

/************************************************************************/

export const getRouteTitleHandled = (route) => {
    let router = {...route}
    let meta = {...route.meta}
    let title = ''
    if (meta.title) {
        if (typeof meta.title === 'function') title = meta.title(router)
        else title = meta.title
    }
    meta.title = title
    router.meta = meta
    return router
}

export const showTitle = (item) => ((item.meta && item.meta.title) || item.name)
