/* require modules */
import { lazy } from 'react'

/* create an array for routes to various pages */
const routes = [
    {
        path: '/',
        guest: true,
        component: lazy(() => import('../pages/user/login'))
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
    //department_menu
    {
        path: '/department/list',
        guest: false,
        component: lazy(() => import('../pages/department/lists'))
    },
    {
        path: '/department/create',
        guest: false,
        component: lazy(() => import('../pages/department/create'))
    },
   
   
    //maintanance menu
    {
        path: '/maintanance/create',
        guest: false,
        component: lazy(() => import('../pages/maintanance/create'))
    },
    {
        path: '/maintanance/list',
        guest: false,
        component: lazy(() => import('../pages/maintanance/lists'))
    },
    {
        path: '/maintanance/inspection',
        guest: false,
        component: lazy(() => import('../pages/maintanance/inspection'))
    },
    {
        path: '/maintanance/inspection-report',
        guest: false,
        component: lazy(() => import('../pages/maintanance/inspection_report'))
    },
    {
        path: '/maintanance/service',
        guest: false,
        component: lazy(() => import('../pages/maintanance/service'))
    },


    //job menu
    {
        path: '/job/list',
        guest: false,
        component: lazy(() => import('../pages/job/lists'))
    },
    {
        path: '/job/create',
        guest: false,
        component: lazy(() => import('../pages/job/create'))
    },
    {
        path: '/job/attempt',
        guest: false,
        component: lazy(() => import('../pages/job/attempt'))
    },
    {
        path: '/job/assigned',
        guest: false,
        component: lazy(() => import('../pages/job/assigned'))
    },
    {
        path: '/job/report',
        guest: false,
        component: lazy(() => import('../pages/job/report'))
    },
    //task
    /*
    {
        path: '/job/task',
        guest: false,
        component: lazy(() => import('../pages/job/task'))
    },
    {
        path: '/job/task_attempt',
        guest: false,
        component: lazy(() => import('../pages/job/task_attempt'))
    },*/



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