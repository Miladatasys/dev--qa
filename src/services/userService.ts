import { User } from "@/types/User"

const API_URL = '/api/users'

export async function getUsers(): Promise<User[]> {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error("Error al obtener usuarios")
    return await res.json()
}

export async function addUser(user: User): Promise<void> {
    const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
    })
    if (!res.ok) throw new Error("Error al agregar usuario")
}

export async function updateUser(updatedUser: User): Promise<void> {
    const res = await fetch(`${API_URL}/${updatedUser.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser),
    })
    if (!res.ok) throw new Error("Error al actualizar usuario")
}

export async function deleteUser(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    })
    if (!res.ok) throw new Error("Error al eliminar usuario")
}
