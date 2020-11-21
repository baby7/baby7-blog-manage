import Main from '@/view/main/index'

export default [
    {
        path: '/login',
        component: () => import('@/view/login/login')
    },
    {
        path: '/',
        name: '_home',
        redirect: '/index',
        component: Main,
        children: [
            {
                /*主页*/
                path: '/index',
                name: 'index',
                component: () => import('@/view/index/index')
            },
            {
                /*博客列表页*/
                path: '/myBlog',
                name: 'myBlog',
                component: () => import('@/view/blog/index')
            },
            {
                /*博客编辑页*/
                path: '/edit',
                name: 'edit',
                component: () => import('@/view/edit/index')
            },
            {
                /*博客分类页*/
                path: '/menu',
                name: 'menu',
                component: () => import('@/view/menu/index')
            },
            {
                /*博客标签页*/
                path: '/label',
                name: 'label',
                component: () => import('@/view/label/index')
            },
            {
                /*友链管理页*/
                path: '/link',
                name: 'link',
                component: () => import('@/view/link/index')
            },
            {
                /*留言板管理*/
                path: '/comment',
                name: 'comment',
                component: () => import('@/view/comment/index')
            },
            {
                /*博主介绍页*/
                path: '/my',
                name: 'my',
                component: () => import('@/view/my/index')
            },
            {
                /*博客设置页*/
                path: '/setting',
                name: 'setting',
                component: () => import('@/view/setting/index')
            },
            {
                /*管理员信息修改*/
                path: '/manager',
                name: 'manager',
                component: () => import('@/view/manager/index')
            }
        ]
    },
    {
        path: '/401',
        name: 'error_401',
        component: () => import('@/view/error-page/401.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        component: () => import('@/view/error-page/500.vue')
    },
    {
        path: '*',
        name: 'error_404',
        component: () => import('@/view/error-page/404.vue')
    }
]
