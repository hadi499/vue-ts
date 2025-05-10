<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../api'
import { useAuthStore } from '../stores/auth'
import { Product } from '../types'


interface ProductResponse {
  product: Product
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Form state
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
const isSubmitting = ref<boolean>(false)
const previewImage = ref<string | null>(null)
const currentImage = ref<string | null>(null)

// Fetch produk saat mounted
onMounted(async () => {
  try {
    isLoading.value = true

    const response = await api.get<ProductResponse>(`/products/${route.params.id}`)

    const product = response.data.product

    form.value.name = product.name
    form.value.price = product.price.toString()

    if (product.image) {
      currentImage.value = `${api.defaults.baseURL}/${product.image.replace(/\\/g, '/')}`
      previewImage.value = currentImage.value
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to load product data'
  } finally {
    isLoading.value = false
  }
})

// Handler perubahan file gambar
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    const file = files[0]
    form.value.image = file

    // Preview
    const reader = new FileReader()
    reader.onload = (event) => {
      previewImage.value = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Submit handler untuk update produk
const handleSubmit = async () => {
  if (!form.value.name || !form.value.price) {
    error.value = 'Name and price are required'
    return
  }

  isSubmitting.value = true
  error.value = null

  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('price', form.value.price)
    formData.append('user_id', String(authStore.user?.id))

    if (form.value.image) {
      formData.append('image', form.value.image)
    }

    await api.put(`/products/${route.params.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    router.push({
      name: 'product-detail',
      params: { id: route.params.id }
    })
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to update product'
    console.error('Error updating product:', err)
  } finally {
    isSubmitting.value = false
  }
}

// Hapus perubahan gambar (kembali ke gambar lama)
const removeImage = () => {
  form.value.image = null
  previewImage.value = currentImage.value
}
</script>

<template>
  <div class="max-w-xl mx-auto mt-8">
    <div class="p-6 mt-6 border rounded-md shadow-md flex flex-col gap-3">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Edit Product</h1>

      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-2">Loading product data...</p>
      </div>

      <template v-else>
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
            <input v-model="form.name" type="text" id="name" required
              class="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
            <input v-model="form.price" type="number" id="price" required min="0"
              class="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          <div>
            <label for="image" class="block text-sm font-medium text-gray-700">Product Image</label>

            <div v-if="previewImage" class="mt-2 mb-4">
              <img :src="previewImage" alt="Preview" class="h-32 object-cover rounded-md border" />
              <button v-if="form.image" @click.prevent="removeImage" type="button"
                class="mt-2 text-sm text-red-600 hover:text-red-800">
                Cancel Change
              </button>
            </div>

            <input @change="handleFileChange" type="file" id="image" accept="image/*"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <p class="mt-1 text-sm text-gray-500">Leave empty to keep current image</p>
          </div>

          <div class="flex space-x-4 pt-2">
            <button type="submit" :disabled="isSubmitting"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
              {{ isSubmitting ? 'Updating...' : 'Update Product' }}
            </button>

            <router-link :to="{ name: 'product-detail', params: { id: route.params.id } }"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Cancel
            </router-link>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>