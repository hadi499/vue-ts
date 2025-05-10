<script setup lang="ts">
import {  Product } from '../types';

// Mendefinisikan props dengan type safety
defineProps < {
  product: Product
} > ()
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
    <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover" />
    <div class="p-4">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-gray-800">{{ product.name }}</h3>
        <span class="text-indigo-600 font-bold">${{ product.price }}</span>
      </div>
      <p class="text-sm text-gray-500 mt-1">Posted by: {{ product.user?.username }}</p>
      <router-link :to="`/products/${product.id}`"
        class="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
        View Details
      </router-link>
    </div>
  </div>
</template>