import { http } from 'msw'
import { User } from '@/types/User'

let mockUsers: User[] = [
    {
    id: '1',
    rut: '18516078-5',
    name: 'Juanita Pérez',
    birthDate: '1991-01-01',
    children: 3,
    email: 'juanitap@gmail.com',
    phones: [{ number: '+5621212121', type: 'Móvil' }],
    addresses: [{ street: 'Av Wallaby', city: 'Sidney', region: 'Metropolitana' }]
    }
]

export const handlers = [
  // GET
    http.get('/api/users', () => {
    return Response.json(mockUsers)
    }),

  // POST (agregar)
    http.post('/api/users', async ({ request }) => {
    const newUser = await request.json() as User
    mockUsers.push(newUser)
    return Response.json(newUser, { status: 201 })
    }),

  // PUT (actualizar)
    http.put('/api/users/:id', async ({ request, params }) => {
    const updatedUser = await request.json() as User
    const { id } = params

    mockUsers = mockUsers.map(user =>
        user.id === id ? { ...updatedUser, id } : user
    )

    return Response.json({ ...updatedUser, id }, { status: 200 })
    }),

  // DELETE
    http.delete('/api/users/:id', ({ params }) => {
    const { id } = params

    mockUsers = mockUsers.filter(user => user.id !== id)

    return new Response(null, { status: 204 })
    }),
]
