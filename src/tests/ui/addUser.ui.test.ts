import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import { testRouter } from '@/tests/utils/testRouter'


import CreateUserView from "@/views/CreateUserView.vue";
import userEvent from '@testing-library/user-event'

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

        testRouter.push('/new')
        await testRouter.isReady()

        render(CreateUserView, {
            global: {
                plugins: [testRouter],
            }
        });

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
            expect(testRouter.currentRoute.value.fullPath).toBe('/home')
        })
    })
})