import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Dashboard from '../../features/dashboard/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "กิจกรรมทั้งหมด"}))
      }, [])


    return(
        <Dashboard />
    )
}

export default InternalPage