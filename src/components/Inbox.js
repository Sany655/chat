import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import ChatBox from './ChatBox'
import Friends from './Friends'
import Peoples from './Peoples'

const Inbox = () => {
  const activeChatUser = useSelector(store => store.activeChatUser)
  const peopleShow = useSelector(store => store.peopleShow)
  return (
    <div className="container-fluid my-4">
      <div className="row">
        {window.innerWidth < 992 ? (
          peopleShow ? <Peoples /> : (Object.keys(activeChatUser).length ? <ChatBox /> : <Friends />)
        ) : (
          <>
            <Friends />
            <ChatBox />
            <Peoples />
          </>
        )}
      </div>
    </div>
  )
}

export default Inbox