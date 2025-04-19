import '@/styles/globals.css';
import { UserProvider } from '@/contexts/userContext';
import Header from '@/components/header';

export default function App({ Component, pageProps }) {
	return (
		<UserProvider>
			<Header />
			<Component {...pageProps} />
		</UserProvider>
	);
}
