<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../api'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { Product } from '../types'


interface ProductData {
  product: Product
}

const route = useRoute()
const router = useRouter()

const productData = ref<ProductData | null>(null)
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await api.get<ProductData>(`/products/${route.params.id}`)
    productData.value = response.data
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to fetch product details'
  } finally {
    isLoading.value = false
  }
})

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await api.delete(`/products/${route.params.id}`)
      router.push('/products')
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to delete product'
    }
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center">
      <LoadingSpinner />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow">
      {{ error }}
    </div>

    <!-- Product Detail -->
    <div v-else-if="productData?.product" class="bg-white rounded-xl shadow-md overflow-hidden p-4 space-y-4">
      <!-- Gambar -->
      <img :src="`${api.defaults.baseURL}/${productData.product.image.replace(/\\/g, '/')}`"
        :alt="productData.product.name" class="w-full h-[400px] rounded-lg object-cover shadow-md" />

      <!-- Info -->
      <div class="space-y-4">
        <h1 class="text-3xl font-semibold text-gray-800">
          {{ productData.product.name }}
        </h1>
        <p class="text-2xl text-indigo-600 font-bold">
          ${{ productData.product.price }}
        </p>
        <p class="text-gray-500">
          Posted by: {{ productData.product.user?.username }}
        </p>
      </div>

      <!-- Tombol -->
      <div class="flex flex-wrap gap-4">
        <router-link :to="`/products/${productData.product.id}/edit`"
          class="px-5 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">
          Edit
        </router-link>
        <button @click="handleDelete" class="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
          Delete
        </button>
      </div>
    </div>

    <!-- Fallback -->
    <div v-else class="text-center py-12">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Product data not available</h2>
      <router-link to="/products"
        class="inline-block px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
        Back to Products
      </router-link>
    </div>
  </div>
</template>