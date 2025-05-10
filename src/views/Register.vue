<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input id="username" v-model="form.username" type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" v-model="form.email" type="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" v-model="form.password" type="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>
        </div>

        <!-- Error Global -->
        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <!-- Tombol Submit -->
        <div>
          <button type="submit" :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed">
            <span v-if="!loading">Register</span>
            <svg v-else class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </button>
        </div>

        <!-- Link Login -->
        <div class="flex items-center justify-between">
          <router-link to="/login" class="text-sm text-indigo-600 hover:text-indigo-500">
            Already have an account? Sign in
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { z } from 'zod'

// 🔹 Schema Registrasi
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

// 🔹 Types
type RegisterForm = z.infer<typeof registerSchema>
interface RegisterErrors {
  username: string
  email: string
  password: string
}

// 🔹 State Form
const router = useRouter()
const form = ref<RegisterForm>({
  username: '',
  email: '',
  password: ''
})
const errors = ref<RegisterErrors>({
  username: '',
  email: '',
  password: ''
})
const loading = ref<boolean>(false)
const error = ref<string>('')

// 🔹 Handle Submit
const handleRegister = async () => {
  // Reset error
  error.value = ''
  errors.value = {
    username: '',
    email: '',
    password: ''
  }

  try {
    loading.value = true
    const validatedData = registerSchema.parse(form.value)

    await axios.post('http://localhost:8080/register', validatedData)

    // Redirect ke login
    router.push({ path: '/login', query: { registered: 'true' } })
  } catch (err: any) {
    if (err.name === 'ZodError') {
      err.errors.forEach((e: any) => {
        const field = e.path[0] as keyof RegisterErrors
        errors.value[field] = e.message
      })
    } else {
      error.value = 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>