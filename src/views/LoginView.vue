<template>
    <section class="login-container">
    <h1>Iniciar Sesión</h1>
    <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Correo electrónico" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit">Ingresar</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const { login } = useAuth()

async function handleLogin() {
    const success = await login(email.value, password.value)
    if (success) {
    router.push('/home')
    } else {
    error.value = 'Credenciales inválidas'
    }
}
</script>
