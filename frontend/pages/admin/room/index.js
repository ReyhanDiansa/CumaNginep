import React from 'react'
import Drawer from "../../../components/Drawer"
import GetRoom from './GetRoom/getRoom'

const index = () => {
  return (
    <div style={{display:"flex"}}>
        <div>
            <Drawer/>
        </div>
        <div style={{margin:"3rem"}}>
            <GetRoom/>
        </div>
    </div>
  )
}

export default index