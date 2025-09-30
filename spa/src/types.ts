declare global {
	type Post = {
		_id: string;
		title: string;
		author: string;
		image: string;
		content: string;
	};

	type User = {
		_id: string;
		createdAt: string;
		__v: number;
		email: string;
		firstName?: string;
		lastName?: string;
		roles: string[];
	};
	type LoginData = { email: string; password: string };

	type AuthContextType = {
		signedIn: boolean;
		user: User | null;
		handleSignIn: ({ email, password }: LoginData) => Promise<void>;
		handleSignOut: () => Promise<void>;
	};
}
