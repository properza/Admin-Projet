// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Charts = lazy(() => import('../pages/protected/Charts'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const Integration = lazy(() => import('../pages/protected/Integration'))
const Transactions = lazy(() => import('../pages/protected/Transactions'))
const DocComponents = lazy(() => import('../pages/DocComponents'))
const Rewarduse = lazy(() => import('../features/documentation/components/Rewarduse.js'))


const routes = [
  {
    path: '/home', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/history',
    component: Transactions,
  },
  {
    path: '/specail-st',
    component: Integration,
  },
  {
    path: '/general-st',
    component: Charts,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/reward-st',
    component: DocComponents,
  },
  {
    path: '/reward-use',
    component: Rewarduse,
  },
  {
    path: '/admin',
    component: Leads,
  },
  
]

export default routes
