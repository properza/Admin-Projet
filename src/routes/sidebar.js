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
    path: '', // url
    name: 'กิจกรรม', // name that appear in Sidebar
  },
  {
    path: '/app/home',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'กิจกรรมทั้งหมด',
  },
  {
    path: '/app/history', // url
    icon: <CurrencyDollarIcon className={iconClasses}/>, // icon component
    name: 'ประวัติกิจกรรม', // name that appear in Sidebar
  },
  {
    path: '', // url
    name: 'รายชื่อนักศึกษา', // name that appear in Sidebar
  },
  {
    path: '/app/general-st', // url
    icon: <ChartBarIcon className={iconClasses}/>, // icon component
    name: 'รายชื่อนักศึกษาทั่วไป', // name that appear in Sidebar
  },
  {
    path: '/app/specail-st', // url
    icon: <BoltIcon className={iconClasses}/>, // icon component
    name: 'รายชื่อนักศึกษา กยศ.', // name that appear in Sidebar
  },
  {
    path: '', // url
    name: 'รางวัล', // name that appear in Sidebar
  },
  {
    path: '/app/reward-st', // url
    icon: <CalendarDaysIcon className={iconClasses}/>, // icon component
    name: 'ของรางวัล', // name that appear in Sidebar
  },
  {
    path: '', // url
    name: 'ผู้ดูแล', // name that appear in Sidebar
    onlySuperAdmin: true,
  },
  {
    path: '/app/admin', 
    icon: <UsersIcon className={iconClasses}/>, 
    name: 'รายชื่อผู้ดูแล',  
    onlySuperAdmin: true,    // เพิ่ม property พิเศษ สำหรับเช็กสิทธิ์
  },
]

export default routes


