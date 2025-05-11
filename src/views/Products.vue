<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { api } from '../api'
import { Product } from '../types'

// Definisi tipe untuk produk
// interface Product {
//   id: number
//   name: string
//   description: string
//   price: number
//   image: string
// }

const products = ref<Product[]>([])
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await api.get<{ products: Product[] }>('/products')

    // Tambahkan base URL ke gambar jika diperlukan
    products.value = response.data.products.map(product => ({
      ...product,
      image: product.image
        ? (product.image.startsWith('http')
          ? product.image
          : `${api.defaults.baseURL}/${product.image.replace(/\\/g, '/')}`)
        : "/images/10grey.jpg"
    }))
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to load products'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-screen-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center mt-4">All Products</h1>

    <div class="mb-6">
      <router-link to="/products/create"
        class="px-5 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">
        Add Product
      </router-link>
    </div>

    <div v-if="isLoading">
      <LoadingSpinner />
    </div>

  

    <div>
      <div v-if="products.length === 0" class="text-center text-gray-500 text-lg p-6">
        No products here.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>