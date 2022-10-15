import React, { useState, useContext } from 'react'
import Img from '../img/img.png'
import Attach from '../img/attach.png'
import { AuthContext } from '../context/AuthContext.js'
import { ChatContext } from '../context/ChatContext.js'
import { arrayUnion, doc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import { v4 as uuid } from 'uuid' // for making unique id
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase.js'

function Input() {

	const [text, setText] = useState('')
	const [image, setImage] = useState(null)

	const { currentUser } = useContext(AuthContext)
	const { data } = useContext(ChatContext)

	const handleSend = async () => {
		if (image) {
			// bugs
			const storageRef = ref(storage, uuid())
			const uploadTask = uploadBytesResumable(storageRef, image)
			uploadTask.on((error) => { console.log(error) },
		    	() => {
		    		// upload text and image
		        	getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
						await updateDoc(doc(db, 'chats', data.chatId), {
							messages: arrayUnion({
								id: uuid(),
								text,
								senderId: currentUser.uid,
								date: Timestamp.now(),
								image: downloadURL
							})
						})
	        		})
		    	}
			)
		} else {
			// upload text only
			await updateDoc(doc(db, 'chats', data.chatId), {
				messages: arrayUnion({
					id: uuid(),
					text,
					senderId: currentUser.uid,
					date: Timestamp.now()
				})
			})
		}

		await updateDoc(doc(db, 'userChats', currentUser.uid), {
			[data.chatId + '.lastMessage']: {
				text
			},
			[data.chatId + '.date']: serverTimestamp()
		})

		await updateDoc(doc(db, 'userChats', data.user.uid), {
			[data.chatId + '.lastMessage']: {
				text
			},
			[data.chatId + '.date']: serverTimestamp()
		})

		setText('')
		setImage(null)
	}

	return (
		<div className='input'>
			<input 
				value={text}
				type='text' 
				placeholder='Type something...'
				onChange={(event) => setText(event.target.value)}
			/>
			<div className='send'>
				<img src={Attach} alt='Attach' />
				<input 
					style={{display: 'none'}} 
					type='file' 
					id='file'
					onChange={(event) => setImage(event.target.files[0])}
				/>
				<label htmlFor='file'>
					<img src={Img} alt='Image' />
				</label>
				<button onClick={handleSend}>Send</button>
			</div>
		</div>
	)
}

export default Input