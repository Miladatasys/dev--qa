import { ref } from 'vue'
import { getUsers } from '@/services/userService'
import type { User } from '@/types/User'

const currentUser = ref<User | null>(null)

export function useAuth() {
    const login = async (email: string, value: string): Promise<boolean> => {
    const users = await getUsers()
    const found = users.find((u) => u.email === email)

    if (found) {
        currentUser.value = found
        return true
    }
    return false
    }

    const logout = () => {
    currentUser.value = null
    }

    return {
    currentUser,
    login,
    logout
    }
}

export function isAuthenticated() {
    return !!currentUser.value
}