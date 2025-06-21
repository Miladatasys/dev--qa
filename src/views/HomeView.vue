<template>
    <section class="container">
    <h1 class="section-title text-center">Sistema de Gestión de usuarios</h1>
    <p class="text-center">{{ users.length }} usuarios registrados</p>

    <div class="text-center">
        <router-link to="/new" class="btn btn-primary" style="margin-bottom: 2rem;">
        Agregar usuario
        </router-link>
    </div>

    <div v-if="users.length === 0" class="card text-center">
        No hay usuarios registrados aún.
    </div>

    <div v-else>
        <div v-for="user in users" :key="user.id" class="card">
        <div class="card-header">
            <h2>{{ user.name }}</h2>
            <div class="card-actions">
            <router-link :to="`/edit/${user.id}`" class="icon-button" title="Editar">
                <i class="pi pi-pencil"></i>
            </router-link>
            <button class="icon-button" @click="handleDelete(user.id, user.birthDate)" aria-label="Eliminar">
                <i class="pi pi-trash"></i>
            </button>
            </div>
        </div>

        <p><strong>RUT:</strong> {{ user.rut }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p>
            <strong>Teléfonos: </strong>
            <span v-for="phone in user.phones" :key="phone.number">
            {{ phone.type }}: {{ phone.number }}<br />
            </span>
        </p>
        <p><strong>Direcciones:</strong> {{ user.addresses.length }}</p>
        <p><strong>Fecha de nacimiento:</strong> {{ formatDate(user.birthDate) }}</p>
        </div>
    </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { deleteUser, getUsers } from '@/services/userService'
import type { User } from '@/types/User'

const users = ref<User[]>([])

async function loadUsers() {
    try {
    users.value = await getUsers()
    } catch (error) {
    console.error("Error al cargar usuarios:", error)
    }
}

onMounted(async () => {
    await loadUsers()
})

function formatDate(dateStr): string {
    const [year, month, day] = dateStr.split('-')
    const localDate = new Date(Number(year), Number(month) -1, Number(day))

    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }
    return localDate.toLocaleDateString('es-CL', options)
}

function Todaybirthday(dateStr: string): boolean {
    const [year, month, day] = dateStr.split('-').map(Number)
    const birth = new Date(year, month - 1, day)

    const today = new Date()

    return (
        birth.getDate() === today.getDate() &&
        birth.getMonth() === today.getMonth()
    )
}



async function handleDelete(id: string, birthDate: string): Promise<void> {
    if (Todaybirthday(birthDate)) {
    alert('No se puede eliminar un usuario de cumpleaños hoy')
    return
    }

    const confirmation = confirm('¿Estás seguro de eliminar este usuario?')
    if (confirmation) {
    try {
        await deleteUser(id)
        await loadUsers()
    } catch (error) {
        console.error("Error al eliminar usuario:", error)
    }
    }
}
</script>
