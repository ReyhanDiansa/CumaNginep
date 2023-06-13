import React from 'react'
import Drawer from "../../../components/Drawer"
import GetTransaction from './GetTransaction/getTransaction'

const index = () => {
  return (
    <div style={{display:"flex"}}>
        <div>
            <Drawer/>
        </div>
        <div style={{margin:"3rem"}}>
            <GetTransaction/>
        </div>
    </div>
  )
}

export default index