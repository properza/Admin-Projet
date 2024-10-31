import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setPageTitle, showNotification } from "../common/headerSlice"
import DocComponentsContent from "./components/DocComponentsContent"



function DocComponents(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "รางวัล"}))
      }, [])


    return(
        <>
            <DocComponentsContent />
        </>
    )
}

export default DocComponents