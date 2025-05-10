<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'
import { useAuthStore } from '../stores/auth'

// Definisi tipe untuk User dan Product
interface User {
  id: number
  username: string
}

const router = useRouter()
const authStore = useAuthStore()

// Ref untuk form input
const form = ref<{
  name: string
  price: string
  image: File | null
}>({
  name: '',
  price: '',
  image: null
})

const error = ref<string | null>(null)
const isLoading = ref<boolean>(false)
const previewImage = ref<string | null>(null)

// Handler perubahan file
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    const file = files[0]
    form.value.image = file

    // Buat preview gambar
    const reader = new FileReader()
    reader.onload = (event) => {
      previewImage.value = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Submit form
const handleSubmit = async () => {
  if (!form.value.name || !form.value.price) {
    error.value = 'Name and price are required'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('price', form.value.price)
    formData.append('user_id', String(authStore.user?.id)) // Asumsikan user.id ada

    if (form.value.image) {
      formData.append('image', form.value.image)
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    router.push({
      name: 'product-detail',
      params: { id: response.data.product.id }
    })
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to create product'
    console.error('Error creating product:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <div class="p-6 mt-6 border rounded-md shadow-md flex flex-col gap-3">
      <h1 class="text-2xl text-center font-bold text-gray-800 mb-6">Add New Product</h1>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
          <input v-model="form.name" type="text" id="name" required
            class="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        <div>
          <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
          <input v-model="form.price" type="number" id="price" required min="0"
            class="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        <div>
          <label for="image" class="block text-sm font-medium text-gray-700">Product Image</label>
          <input @change="handleFileChange" type="file" id="image" accept="image/*"
            class="mt-1 block w-full p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />

          <div v-if="previewImage" class="mt-2">
            <img :src="previewImage" alt="Preview" class="h-32 object-cover rounded-md" />
          </div>
        </div>

        <button type="submit" :disabled="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {{ isLoading ? 'Creating...' : 'Create Product' }}
        </button>
      </form>
    </div>
  </div>
</template>