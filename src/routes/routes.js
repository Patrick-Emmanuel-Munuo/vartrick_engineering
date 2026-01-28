/* require modules */
import { lazy } from 'react'

/* create an array for routes to various pages */
const routes = [
    {
        path: '/',
        guest: true,
        component: lazy(() => import('../pages/home'))
    },
    {
        path: '/forgot-password',
        guest: true,
        component: lazy(() => import('../pages/user/forgot-password'))
    },
    {
        path: '/registration',
        guest: true,
        component: lazy(() => import('../pages/user/registration'))
    },
    {
        path: '/dashboard',
        guest: false,
        component: lazy(() => import('../pages/dashboard')) //test
    },
    //shop_menu
    {
        path: '/shop/list',
        guest: false,
        component: lazy(() => import('../pages/department/lists'))
    },
    {
        path: '/shop/create',
        guest: false,
        component: lazy(() => import('../pages/department/create'))
    },

    //product menu
    {
        path: '/product/list',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
    },
    {
        path: '/product/create',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
    },
    //selling menu
    {
        path: '/selling/list',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
    },
    {
        path: '/selling/create',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
        //component: lazy(() => import('../pages/selling/create'))
    },
    {
        path: '/selling/attempt',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
    },
    {
        path: '/selling/assigned',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
    },
    {
        path: '/selling/report',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
    },

    //role menu
    {
        path: '/role/list',
        guest: false,
        component: lazy(() => import('../pages/roles/lists'))
    },
    {
        path: '/role/create',
        guest: false,
        component: lazy(() => import('../pages/roles/create'))
    },
    //user_menu
    {
        path: '/user/list',
        guest: false,
        component: lazy(() => import('../pages/user/list'))
    },
    {
        path: '/user/create',
        guest: false,
        component: lazy(() => import('../pages/user/create'))
    },
    {
        path: '/user/bulk',
        guest: false,
        component: lazy(() => import('../pages/user/bulk'))
    },
    {
        path: '/user/history',
        guest: false,
        component: lazy(() => import('../pages/user/history'))
    },
    {
        path: '/user/forgot-password',
        guest: true,
        component: lazy(() => import('../pages/user/forgot-password'))
    },
    {
        path: '/user/password',
        guest: false,
        component: lazy(() => import('../pages/user/password'))
    },
    {
        path: '/user/reset-password',
        guest: false,
        component: lazy(() => import('../pages/user/reset-password'))
    },


    
    // error path routers should be at the bottom always
    {
        path: 'not-found',
        guest: false,
        component: lazy(() => import('../pages/page-not-found'))
    },
    {
        path: '*',
        guest: false,
        component: lazy(() => import('../pages/page-not-found'))
    },
    {
        path: '*',
        guest: true,
        component: lazy(() => import('../pages/user/login'))
    }
]

/* export routes for global accessibility */
export default routes