import React, { useState, useEffect, useContext } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { AuthContext } from '../context/AuthContext.js'
import { ChatContext } from '../context/ChatContext.js'

function Chats() {

	const [chats, setChats] = useState([])

	const { currentUser } = useContext(AuthContext)
	const { dispatch } = useContext(ChatContext)

	useEffect(() => {

		const getChats = () => {

			// onSnapshot allow to subscribe on realtime updates
			const unsubscribe = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
				setChats(doc.data())
			})

			return () => {
				unsubscribe()
			}
		}

		currentUser.uid && getChats()

	}, [currentUser.uid])

	const handleSelect = (user) => {
		dispatch({
			type: 'CHANGE-USER',
			payload: user
		})
	}

	return (
		<div className='chats'>
			{
				Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => {
					return (
						<div key={chat[0]} className='userChat' onClick={() => handleSelect(chat[1].userInfo)}>
							<img src={chat[1].userInfo.photoURL} alt='' />
							<div className='userChatInfo'>
								<span>{chat[1].userInfo.displayName}</span>
								<p>{chat[1].lastMessage?.text}</p>
							</div>
						</div>
					)
				})
			}
		</div>
	)
}

export default Chats