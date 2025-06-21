<template>
    <section class="container">
    <h1 class="section-title text-center">Editar usuario</h1>
    <div v-if="userToEdit">
        <UserForm :userToEdit="userToEdit" />
    </div>
    <div v-else class="text-center">
        <p>Usuario no encontrado.</p>
    </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getUsers } from '@/services/userService'
import UserForm from '@/components/users/UserForm.vue'
import type { User } from '@/types/User'

const route = useRoute()
const userToEdit = ref<User | null>(null)

onMounted(async () => {
    try {
    const userId = route.params.id as string
    const users = await getUsers() 
    const user = users.find(u => u.id === userId)
    userToEdit.value = user || null
    } catch (error) {
    console.error('Error al cargar usuario para editar:', error)
    }
})
</script>

