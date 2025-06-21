export interface User {
    id: string
    rut: string
    name: string
    birthDate: string
    children: number
    email: string
    password?: string
    phones: {
        number: string
        type: string
    }[]
    addresses: {
        street: string
        city: string
        region: string
    }[]
}
