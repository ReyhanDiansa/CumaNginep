import React from 'react'
import Drawer from "../../../components/Drawer"
import GetType from './GetType/getType'
import withAuth from '../../withAuth'

const index = () => {
  return (
    <div style={{display:"flex"}}>
        <div>
            <Drawer/>
        </div>
        <div style={{margin:"3rem"}}>
            <GetType/>
        </div>
    </div>
  )
}

export default withAuth(index);