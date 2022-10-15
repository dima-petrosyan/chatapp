import React, { useState } from 'react'
import Add from '../img/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, storage, db } from '../firebase.js'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'

function Register(props) {

	const [error, setError] = useState(false)
	const navigate = useNavigate()

	const handleSubmit = async (event) => {
		event.preventDefault()

		const displayName = event.target[0].value
		const email = event.target[1].value
		const password = event.target[2].value
		const file = event.target[3].files[0]

		try {
			const response = await createUserWithEmailAndPassword(auth, email, password) // return user data

			// upload image to storage and set user data in firestore
			const storageRef = ref(storage, displayName) // displayName is a name for image in firebase storage
			const uploadTask = uploadBytesResumable(storageRef, file)
			uploadTask.on((error) => { setError(true) },
		    	() => {
		        	getDownloadURL(uploadTask.snapshot.ref)
		        		.then( async (downloadURL) => {

		        			// update user data
		        			await updateProfile(response.user, {
		        				displayName,
		        				photoURL: downloadURL,
		        			})

		        			// set user data in cloud firestore using where the key is user's unique id
		        			// then we use this data to find users which are registered in our app
		        			await setDoc(doc(db, 'users', response.user.uid), {
								uid: response.user.uid,
								displayName,
								email,
								photoURL: downloadURL,
							})

							// create empty user's chat collection
							await setDoc(doc(db, 'userChats', response.user.uid), {})
		        			
		        			// navigate to home page after successful authentification
		        			navigate('/')
		        		}
		        	)
		    	}
			)
		} catch (error) {
		    setError(true)
		}
			
	}

	return (
		<div className='formContainer'>
			<div className='formWrapper'>
				<span className='logo'>Lama Chat</span>
				<span className='title'>Register</span>
				<form onSubmit={handleSubmit}>
					<input type='text' placeholder='display name' />
					<input type='email' placeholder='email' />
					<input type='password' placeholder='password' />
					<input style={{display: 'none'}} type='file' id='file' />
					<label htmlFor='file'>
						<img src={Add} alt='Add avatar' />
						<span>Add an avatar</span>
					</label>
					<button>Sign up</button>
					{
						error && <span>Something went wrong</span>
					}
				</form>
				<p>You do have an account? <Link to='/login'>Login</Link></p>
			</div>
		</div>
	)
}

export default Register