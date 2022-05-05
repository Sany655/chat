import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AudioCall from '../components/AudioCall'
import ChatBox from '../components/ChatBox'
import Footer from '../components/Footer'
import Friends from '../components/Friends'
import Header from '../components/Header'
import Peoples from '../components/Peoples'
import Profile from '../components/Profile'
import VideoCall from '../components/VideoCall'
import Home from '../pages/Home'

const Default = () => {
    return (
        <main>
            <Header />
            {/* <div className="container "> */}
                <Routes>
                    {/* <Route path='/*' element={<Default />} /> */}
                    <Route path='/*' element={<Friends />} />
                    <Route path='peoples/*' element={<Peoples />} />
                    <Route path='chat/*' element={<ChatBox />} />
                    <Route path='profile/*' element={<Profile />} />
                    <Route path='audio-calling/*' element={<AudioCall />} />
                    <Route path='video-calling/*' element={<VideoCall />} />
                </Routes>
            {/* </div> */}
            {/* <Footer /> */}
        </main>
    )
}

export default Default