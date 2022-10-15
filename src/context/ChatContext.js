import { createContext, useContext, useReducer } from 'react'
import { auth } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { AuthContext } from './AuthContext.js'

export const ChatContext = createContext()

// create context provider to allow access to chat from all components
export const ChatContextProvider = ({children}) => {
	
	const { currentUser } = useContext(AuthContext)

	const initial_state = {
		chatId: 'null',
		user: {},
	}

	const chatReducer = (state, action) => {
		switch (action.type) {
			case 'CHANGE-USER': 
				return {
					user: action.payload,
					chatId: currentUser.uid > action.payload.uid ?
							currentUser.uid + action.payload.uid :
							action.payload.uid + currentUser.uid
				}
			default: 
				return state
		}
	}

	const [state, dispatch] = useReducer(chatReducer, initial_state)

	return (
		<ChatContext.Provider value={{ data: state, dispatch }}>
			{children}
		</ChatContext.Provider>
	)

}