/** Icons are imported separatly to reduce build time */
import BellIcon from '@heroicons/react/24/outline/BellIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'
import CodeBracketSquareIcon from '@heroicons/react/24/outline/CodeBracketSquareIcon'
import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon'
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon'
import BoltIcon from '@heroicons/react/24/outline/BoltIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import KeyIcon from '@heroicons/react/24/outline/KeyIcon'
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon'

const iconClasses = `h-6 w-6`

const routes = [
  {
    path: '',
    name: 'กิจกรรม',
  },
  {
    path: '/app/home',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'กิจกรรมทั้งหมด',
  },
  {
    path: '/app/history',
    icon: <CurrencyDollarIcon className={iconClasses}/>,
    name: 'ประวัติกิจกรรม',
  },
  {
    path: '',
    name: 'รายชื่อนักศึกษา',
  },
  {
    path: '/app/general-st',
    icon: <ChartBarIcon className={iconClasses}/>,
    name: 'รายชื่อนักศึกษาทั่วไป',
    role: ['super_admin', 'normal']
  },
  {
    path: '/app/specail-st',
    icon: <BoltIcon className={iconClasses}/>,
    name: 'รายชื่อนักศึกษา กยศ.',
    role: ['super_admin', 'special']
  },
  {
    path: '',
    name: 'รางวัล',
    role: ['super_admin', 'normal']
  },
  {
    path: '/app/reward-st',
    icon: <CalendarDaysIcon className={iconClasses}/>,
    name: 'ของรางวัล',
    role: ['super_admin', 'normal']
  },
  {
    path: '/app/reward-use',
    icon: <CalendarDaysIcon className={iconClasses}/>,
    name: 'แลกใช้ของรางวัล',
    role: ['super_admin', 'normal']
  },
  {
    path: '',
    name: 'ผู้ดูแล',
    onlySuperAdmin: true,
  },
  {
    path: '/app/admin', 
    icon: <UsersIcon className={iconClasses}/>, 
    name: 'รายชื่อผู้ดูแล',  
    onlySuperAdmin: true,
  },
]

export default routes


