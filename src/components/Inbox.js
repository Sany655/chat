import React from 'react'
import ChatBox from './ChatBox'
import Friends from './Friends'
import Peoples from './Peoples'

const Inbox = () => {
  return (
    <div className="container-fluid my-4">
      <div className="row">
        <Friends />
        <ChatBox />
        <Peoples />
      </div>
    </div>
  )
}

export default Inbox