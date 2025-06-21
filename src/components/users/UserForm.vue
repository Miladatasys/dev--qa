<template>
    <form @submit.prevent="handleSubmit">
    <div class="grid">
        <label>
        RUT *
        <input v-model="form.rut" type="text" :disabled="isEditMode" required />
        </label>

        <label>
        Nombre completo *
        <input v-model="form.name" type="text" required />
        </label>

        <label>
        Fecha de nacimiento *
        <input v-model="form.birthDate" type="date" required />
        </label>

        <label>
        Cantidad de hijos *
        <input v-model.number="form.children" type="number" min="0" required />
        </label>

        <label>
        Email *
        <input v-model="form.email" type="email" required />
        </label>
    </div>

    <!-- Teléfonos -->
    <fieldset>
      <legend>Teléfonos *</legend>
        <div v-for="(phone, index) in form.phones" :key="index" class="grid">
        <input v-model="phone.number" type="text" placeholder="+56912345678" required />
        <select v-model="phone.type">
            <option>Móvil</option>
            <option>Trabajo</option>
        </select>
        <button type="button" @click="removePhone(index)">Borrar</button>
        </div>
        <button type="button" @click="addPhone">Agregar teléfono</button>
    </fieldset>

    <!-- Direcciones -->
    <fieldset>
      <legend>Direcciones *</legend>
        <div v-for="(addr, index) in form.addresses" :key="index" class="grid">
        <input v-model="addr.street" type="text" placeholder="Calle / Avenida" required />
        <input v-model="addr.city" type="text" placeholder="Ciudad" required />
        <input v-model="addr.region" type="text" placeholder="Región" required />
        <button type="button" @click="removeAddress(index)">Borrar</button>
        </div>
        <button type="button" @click="addAddress">Agregar dirección</button>
    </fieldset>

    <div class="form-actions">
        <button type="submit" class="btn-primary">
        {{ isEditMode ? 'Guardar cambios' : 'Crear Usuario' }}
        </button>
        <button type="button" @click="cancelar">Cancelar</button>
    </div>
    </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { addUser, getUsers, updateUser } from '@/services/userService'
import type { User } from '@/types/User'


const props = defineProps<{
    userToEdit?: User
}>()

const isEditMode = computed(() => props.userToEdit !== undefined && props.userToEdit !== null)

const form = ref<User>({
    id: '',
    rut: '',
    name: '',
    birthDate: '',
    children: 0,
    email: '',
    phones: [{ number: '', type: 'Móvil' }],
    addresses: [{ street: '', city: '', region: '' }]
})

watch(
    () => props.userToEdit,
    (user) => {
    if (user) {
        form.value = JSON.parse(JSON.stringify(user))
    }
    },
    { immediate: true }
)

const router = useRouter()

async function handleSubmit() {
    if (!isValidRUT(form.value.rut)) {
    alert('El RUT ingresado no es válido.');
    return;
    }

    if (!isValidName(form.value.name)) {
    alert('El nombre solo debe contener letras y espacios.');
    return;
    }

    if (!isValidEmail(form.value.email)) {
    alert('El correo electrónico no es válido.');
    return;
    }

    if (
    form.value.phones.length === 0 ||
    form.value.phones.some(p => !isValidPhone(p.number))
    ) {
    alert('Debe ingresar al menos un número de teléfono válido (ej: +56912345678).');
    return;
    }

    if (
    form.value.addresses.length === 0 ||
    form.value.addresses.some(addr =>
        !isValidAddressField(addr.street) ||
        !isValidAddressField(addr.city) ||
        !isValidAddressField(addr.region)
    )
    ) {
    alert('Debe ingresar al menos una dirección válida (sin caracteres inválidos).');
    return;
    }

    try {
    if (!isEditMode.value) {
        const existingUsers = await getUsers();
        const rutExiste = existingUsers.some(u => u.rut === form.value.rut);
        if (rutExiste) {
        alert('El RUT ya está registrado.');
        return;
        }

        const newUser: User = {
        id: crypto.randomUUID(),
        rut: form.value.rut,
        name: form.value.name,
        birthDate: form.value.birthDate,
        children: form.value.children,
        email: form.value.email,
        phones: JSON.parse(JSON.stringify(form.value.phones)),
        addresses: JSON.parse(JSON.stringify(form.value.addresses))
        };

        await addUser(newUser);
    } else {
        await updateUser(form.value);
    }

    router.push('/home');
    } catch (error) {
    console.error("Error al guardar usuario:", error);
    alert("Hubo un error al guardar el usuario.");
    } 
}

function addPhone() {
    form.value.phones.push({ number: '', type: 'Móvil' })
}

function removePhone(index: number) {
    form.value.phones.splice(index, 1)
}

function addAddress() {
    form.value.addresses.push({ street: '', city: '', region: '' })
}

function removeAddress(index: number) {
    form.value.addresses.splice(index, 1)
}

function cancelar() {
    router.push('/home')
}

function isValidName(name: string): boolean {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(name.trim())
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function isValidPhone(number: string): boolean {
    return /^\+?56\s?9\d{8}$/.test(number.trim()) || /^\+?569\d{8}$/.test(number.trim())
}

function isValidAddressField(value: string): boolean {
    return /^[\w\sáéíóúÁÉÍÓÚñÑ,.-]+$/.test(value.trim())
}

function isValidRUT(rut: string): boolean {

    rut = rut.replace(/\./g, '').toUpperCase();

    const rutRegex = /^(\d{7,8})\-([\dK])$/;
    const match = rut.match(rutRegex);
    if (!match) return false;

    const body = match[1];
    const dv = match[2];

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body.charAt(i)) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedDV = 11 - (sum % 11);
    const expected = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();

    return dv === expected;
}
</script>
