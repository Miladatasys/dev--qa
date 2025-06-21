import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import { createRouter, createWebHistory } from "vue-router";

import CreateUserView from "@/views/CreateUserView.vue";
import HomeView from "@/views/HomeView.vue";

import userEvent from '@testing-library/user-event'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView },
        { path: '/new', component: CreateUserView },
    ],
})

afterEach(() => {
    vi.unstubAllGlobals();
})

describe('UI -Agregar usuario', () => {
    it('Debería permitir completar y enviar el formulario correctamente', async () => {
        vi.stubGlobal('alert', vi.fn());

        vi.stubGlobal('fetch', vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        ));
        
        render(CreateUserView, {
            global: {
                plugins: [router],
            }
        })

        await userEvent.type(screen.getByLabelText(/RUT \*/), '12345678-5')
        await userEvent.type(screen.getByLabelText(/Nombre completo \*/), 'Camila Morales')
        await userEvent.type(screen.getByLabelText(/Fecha de nacimiento \*/), '1995-06-19')
        await userEvent.type(screen.getByLabelText(/Cantidad de hijos \*/), '2')
        await userEvent.type(screen.getByLabelText(/Email \*/), 'camila@gmail.com')

        await userEvent.type(screen.getByPlaceholderText('+56912345678'), '+56987654321')

        await userEvent.type(screen.getByPlaceholderText('Calle / Avenida'), 'Providencia 123')
        await userEvent.type(screen.getByPlaceholderText('Ciudad'), 'Santiago')
        await userEvent.type(screen.getByPlaceholderText('Región'), 'Metropolitana')

        const submitButton = screen.getByRole('button', { name: /crear usuario/i })
        await fireEvent.click(submitButton)

        await waitFor(() => {
            expect(router.currentRoute.value.fullPath).toBe('/')
        })
    })
})