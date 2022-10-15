import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase.js'
import { Link, useNavigate } from 'react-router-dom'

function Login(props) {

	const [error, setError] = useState(false)
	const navigate = useNavigate()

	const handleSubmit = async (event) => {
		event.preventDefault()

		const email = event.target[0].value
		const password = event.target[1].value

		try {
			await signInWithEmailAndPassword(auth, email, password)
			navigate('/')
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
					<input type='email' placeholder='email' />
					<input type='password' placeholder='password' />
					<button>Sign in</button>
					{
						error && <span>Something went wrong</span>
					}
				</form>
				<p>You don't have an account? <Link to='/register'>Register</Link></p>
			</div>
		</div>
	)
}

export default Login