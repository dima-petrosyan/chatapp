import React, { useContext, useState, useEffect } from 'react'
import Message from './Message.jsx'
import { ChatContext } from '../context/ChatContext.js'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../firebase.js'

function Messages() {

	const { data } = useContext(ChatContext)
	const [messages, setMessages] = useState([])

	useEffect(() => {

		const unsubscribe = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
			doc.exists() && setMessages(doc.data().messages)
		})

		return () => {
			unsubscribe()
		}

	}, [data.chatId])

	return (
		<div className='messages'>
		{
			messages.map(message => {
				return <Message key={message.id} message={message} />
			})
		}
		</div>
	)
}

export default Messages





