import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios, { AxiosError } from 'axios';

// Definisikan tipe user
interface User {
  id: number;
  username: string;
  email: string;
}

// Definisikan struktur respons login
interface LoginResponse {
  id: number;
  username: string;
  email: string;
  token: string;
}

// Definisikan tipe credentials
interface LoginCredentials {
  username: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  );
  const token = ref<string | null>(localStorage.getItem('token') || null);
  const router = useRouter();

  // Set header jika token ada
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>('http://localhost:8080/login', credentials);

      const { id, username, email, token: responseToken } = response.data;

      user.value = { id, username, email };
      token.value = responseToken;

      localStorage.setItem('user', JSON.stringify(user.value));
      localStorage.setItem('token', token.value);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      throw err;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  return { user, token, login, logout };
});