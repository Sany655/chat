import React from 'react'
import ChatBox from './ChatBox'
import Peoples from './Peoples'
import UserList from './UserList'

const Inbox = () => {
  return (
    <div className="container-fluid my-4">
      <div className="row">
        <UserList />
        <ChatBox />
        <Peoples />
      </div>
    </div>
  )
}

export default Inbox