import { describe, it, expect } from "vitest";
import { getUsers } from "@/services/userService";

import { User } from '@/types/User'
import { addUser } from "@/services/userService";
import { updateUser } from "@/services/userService";
import { deleteUser } from "@/services/userService";

describe('userService - getUsers', () => {
    it('debería retornar la lista de usuarios mockeada', async () => {
        const users: User[] = await getUsers()

        expect(Array.isArray(users)).toBe(true)
        expect(users.length).toBeGreaterThan(0)

        expect(users[0]).toMatchObject({
            id: '1',
            rut: '18516078-5',
            name: 'Juanita Pérez',
            email: 'juanitap@gmail.com'
        })
    })
})

it('Debería agregar un usuario correctamente', async () => {
    const newUser = {
        id: '2',
        rut: '39749228-1',
        name: 'Lucia Magnolia',
        birthDate: '1997-07-23',
        children: 1,
        email: 'lucym@testing.com',
        phones: [{ number: '+56989898989', type: 'Trabajo' }],
        addresses: [{ street: 'Las lilas', city: 'Santiago', region: 'RM' }]
    }

    await expect(addUser(newUser)).resolves.not.toThrow()
})

it('Dbería actualizar un usuario correctamente', async () => {
    const updatedUser: User = {
        id: '1',
        rut: '18516078-5',
        name: 'Juana Pérez',
        birthDate: '1991-01-01',
        children: 4,
        email: 'juanita@actualizada.com',
        phones: [{ number: '+5622222222', type: 'Trabajo'}],
        addresses: [{ street: 'Calle actualizada', city: 'Santiago', region: 'RM'}]
    }

    await expect(updateUser(updatedUser)).resolves.not.toThrow()
})

it('Debería eliminar un usuario correctamente', async () => {
    await expect(deleteUser('1')).resolves.not.toThrow()
})
