import React, { useEffect, useState } from 'react'
import WritePost from "../components/WritePost"
import Posts from "../components/Posts"
import Peoples from "../components/Peoples"
import Friends from '../components/Friends'
import ChatBox from '../components/ChatBox'
import { Route, Routes } from 'react-router-dom'
import Profile from '../components/Profile'

const Home = () => {
    const [navbarHeight, setNavbarHeight] = useState()

    useEffect(() => {
        // setNavbarHeight(document.querySelector(".navbar").offsetHeight)
        // 100-((navbarHeight)*(100/window.innerHeight))+ = view of height without any element
    }, [])


    return (
        <div className="row">
            <div className={`col-12 col-lg-2 ${window.location.pathname==='/profile'?"d-none":null}`}>
                <Friends />
            </div>
            <div className={`d-none d-lg-block col-12 col-lg-8`}>
                <Routes>
                    <Route path='/*' element={<ChatBox />} />
                    <Route path='profile/*' element={<Profile />} />
                </Routes>
            </div>
            <div className="d-none d-lg-block col-2" >
                <Peoples />
            </div>
        </div>
    )
}

export default Home