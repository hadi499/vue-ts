<template>
  <div class="min-h-screen bg-gray-50">

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-medium text-gray-900">User Information</h2>
          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-500">Username</label>
              <p class="mt-1 text-sm text-gray-900">{{ authStore.user?.username }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">Email</label>
              <p class="mt-1 text-sm text-gray-900">{{ authStore.user?.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">User ID</label>
              <p class="mt-1 text-sm text-gray-900">{{ authStore.user?.id }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()

</script>