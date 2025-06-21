import { describe, it, expect } from "vitest";
import { getUsers, addUser, updateUser, deleteUser } from "@/services/userService";
import type { User } from '@/types/User'

describe('Integración API de usuarios', () => {
    it('Debería realizar el flujo completo: agregar, obtener, actualizar y eliminar', async () => {
        
        const newUser: User = {
            id: '999',
            rut: '12345678-9',
            name: 'User test',
            birthDate: '2001-01-01',
            children: 1,
            email: 'test@user.com',
            phones: [{ number: '+56912345678', type: 'Móvil'}],
            addresses: [{ street: 'Calle Wallaby', city: 'Sidney', region: 'RM'}]
        }

        await expect(addUser(newUser)).resolves.not.toThrow()

        const users = await getUsers()
        const addedUser = users.find(u => u.id === newUser.id)
        expect(addedUser).toBeDefined()
        expect(addedUser?.name).toBe('User test')

        const updatedUser = { ...newUser, name: 'Usuario Actualizado' }
        await expect(updateUser(updatedUser)).resolves.not.toThrow()

        const updatedUsers = await getUsers()
        const foundUser = updatedUsers.find(u => u.id === updatedUser.id)
        expect(foundUser?.name).toBe('Usuario Actualizado')

        await expect(deleteUser(updatedUser.id)).resolves.not.toThrow()
    })
})