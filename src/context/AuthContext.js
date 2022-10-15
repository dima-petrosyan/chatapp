import { createContext, useState, useEffect } from 'react'
import { auth } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

export const AuthContext = createContext()

// create context provider to allow access to current user from all components
export const AuthContextProvider = ({children}) => {
	
	const [currentUser, setCurrentUser] = useState({})
	
	useEffect(() => {
		
		// listening real time operation, so we must clean it
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user)
		})

		return () => {
			unsubscribe()
		}

	}, [])

	return (
		<AuthContext.Provider value={{currentUser}}>
			{children}
		</AuthContext.Provider>
	)

}