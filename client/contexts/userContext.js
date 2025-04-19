import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export function UserProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) return;

		axios
			.get('http://localhost:3001/api/auth/me', {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setUser(res.data))
			.catch(() => {
				setUser(null);
				localStorage.removeItem('token');
			});
	}, []);

	const logout = () => {
		setUser(null);
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	};

	return (
		<UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>
	);
}
