import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.request.use(
	(config) => {
		console.log('API Request:', config.method?.toUpperCase(), config.url);
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response) => {
		console.log('API Response:', response.status, response.config.url);
		return response;
	},
	(error) => {
		console.error('API Error:', error.response?.status, error.response?.data);
		return Promise.reject(error);
	}
);

export interface RegisterUserData {
	username: string;
	password: string;
	name?: string;
	email?: string;
}

export interface OTPData {
	username: string;
	otp: string;
}

export interface LoginData {
	username: string;
	password: string;
}

export interface ScoreData {
	score: number;
}

export const registerUser = async (userData: RegisterUserData) => {
	try {
		const response = await apiClient.post('/register', userData);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Registration failed');
	}
};

export const verifyOTP = async (otpData: OTPData) => {
	try {
		const response = await apiClient.post('/verify-otp', otpData);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'OTP verification failed');
	}
};

export const resendOTP = async (username: string) => {
	try {
		const response = await apiClient.post('/resend-otp', { username });
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to resend OTP');
	}
};

export const loginUser = async (loginData: LoginData) => {
	try {
		const response = await apiClient.post('/login', loginData);
		return response.data;
	} catch (error: any) {
		if (error.response?.data?.message === 'UserNotConfirmedException') {
			throw new Error('UserNotConfirmedException');
		}
		throw new Error(error.response?.data?.message || 'Login failed');
	}
};

export const submitScore = async (scoreData: ScoreData) => {
	try {
		const userData = localStorage.getItem('user');
		const token = userData ? JSON.parse(userData).accessToken : null;

		const config: AxiosRequestConfig = {
			headers: {
				'Content-Type': 'application/json',
				...(token && { 'Authorization': `Bearer ${token}` })
			}
		};

		const response = await apiClient.post('/score', scoreData, config);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to submit score');
	}
};

export const getLeaderboard = async () => {
	try {
		const response = await apiClient.get('/leaderboard');
		return response.data.data || [];
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to fetch leaderboard');
	}
};

export const deleteLeaderboard = async () => {
	try {
		const userData = localStorage.getItem('user');
		const token = userData ? JSON.parse(userData).accessToken : null;

		const config: AxiosRequestConfig = {
			headers: {
				'Content-Type': 'application/json',
				...(token && { 'Authorization': `Bearer ${token}` })
			}
		};

		const response = await apiClient.delete('/leaderboard', config);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to delete leaderboard');
	}
};

export default apiClient;
