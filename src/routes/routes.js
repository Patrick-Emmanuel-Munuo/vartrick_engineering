import { lazy } from 'react'

const routes = [
    // ===== Guest routes =====
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

    // ===== Auth routes =====
    {
        path: '/dashboard',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
    },

    // ===== Product =====
    {
        path: '/product/create',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
    },
    {
        path: '/product/supply',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
    },
    {
        path: '/product/bulk-create',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
    },
    {
        path: '/product/stock-update',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
    },
    {
        path: '/product/list',
        guest: false,
        component: lazy(() => import('../pages/dashboard'))
    },

    // ===== Selling =====
    { 
        path: '/selling/list', 
        guest: false, 
        component: lazy(() => import('../pages/dashboard')) 
    },
    { 
        path: '/selling/create', 
        guest: false, 
        component: lazy(() => import('../pages/dashboard')) 
    },
    { 
        path: '/selling/customer', 
        guest: false, 
        component: lazy(() => import('../pages/dashboard')) 
    },
    { 
        path: '/selling/invoice', 
        guest: false, 
        component: lazy(() => import('../pages/dashboard')) 
    },
    { 
        path: '/selling/report', 
        guest: false, 
        component: lazy(() => import('../pages/dashboard')) 
    },
    // ===== Roles =====
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

    // ===== Users =====
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
        path: '/user/password',
        guest: false,
        component: lazy(() => import('../pages/user/password'))
    },
    {
        path: '/user/reset-password',
        guest: false,
        component: lazy(() => import('../pages/user/reset-password'))
    },

    // ===== Errors (ALWAYS LAST) =====
    {
        path: '/not-found',
        guest: false,
        component: lazy(() => import('../pages/page-not-found'))
    },
    {
        path: '*',
        guest: false,
        component: lazy(() => import('../pages/page-not-found'))
    }
]

export default routes
