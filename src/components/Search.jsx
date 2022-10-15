import React, { useState, useContext } from 'react'
import { collection, query, where, setDoc,
	getDocs, getDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import { AuthContext } from '../context/AuthContext.js'

function Search() {

	const [username, setUsername] = useState('')
	const [user, setUser] = useState(null)
	const [error, setError] = useState(false)

	const { currentUser } = useContext(AuthContext)

	const handleSearch = async () => {
		const q = query(
			collection(db, 'users'), 
			where('displayName', '==', username)
		)

		try {
			const querySnapshot = await getDocs(q)
			querySnapshot.forEach((doc) => {
				setUser(doc.data())
			})
		} catch (error) {
			setError(true)
		}
		
	}

	const handleKey = (event) => {
		event.code === 'Enter' && handleSearch()	
	}

	const handleSelect = async () => {

		// check whether the group(chats collection in firestore) exists or not
		// if doesn't exist, then create a new one
		const combinedID = 
			currentUser.uid > user.uid ? 
			currentUser.uid + user.uid : 
			user.uid + currentUser.uid
		try {
			const response = await getDoc(doc(db, 'chats', combinedID))
			if (!response.exists()) {

				// create chat in chats collection
				await setDoc(doc(db, 'chats', combinedID), {messages: []})
				
				// create user chats
				await updateDoc(doc(db, 'userChats', currentUser.uid), {
					[combinedID + '.userInfo']: {
						uid: user.uid,
						displayName: user.displayName,
						photoURL: user.photoURL
					},
					[combinedID + '.date']: serverTimestamp()
				})

				await updateDoc(doc(db, 'userChats', user.uid), {
					[combinedID + '.userInfo']: {
						uid: currentUser.uid,
						displayName: currentUser.displayName,
						photoURL: currentUser.photoURL
					},
					[combinedID + '.date']: serverTimestamp()
				})

			}
		} catch (error) {

		}

		setUser(null)
		setUsername('')

	}

	return (
		<div className='search'>
			<div className='searchForm'>
				<input 
					value={username}
					onChange={(event) => setUsername(event.target.value)} 
					onKeyDown={handleKey}
					type='text' 
					placeholder='Find a user' />
			</div>
			{
				error && <span>User not found</span>
			}
			{
				user && 
				<div className='userChat' onClick={handleSelect}>
					<img src={user.photoURL} alt='' />
					<div className='userChatInfo'>
						<span>{user.displayName}</span>
					</div>
				</div>
			}
		</div>
	)
}

export default Search