import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { testRouter } from '@/tests/utils/testRouter'

import EditUserView from "@/views/EditUserView.vue";
import * as userService from '@/services/userService'

const mockUser = {
    id: "123",
    rut: "12345678-5",
    name: "Camila Morales",
    birthDate: "1995-06-19",
    children: 2,
    email: "camila@gmail.com",
    phones: [{ number: "+56987654321", type: "Móvil" }],
    addresses: [
    { street: "Providencia 123", city: "Santiago", region: "Metropolitana" }
    ]
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("UI - Editar usuario", () => {
    it("Debería cargar datos y permitir editar el usuario", async () => {
    vi.stubGlobal("alert", vi.fn());

    vi.spyOn(userService, "getUsers").mockResolvedValue([mockUser])
    vi.spyOn(userService, "updateUser").mockResolvedValue()

    testRouter.push("/edit/123")
    await testRouter.isReady()

    render(EditUserView, {
        global: {
        plugins: [testRouter]
        }
    });

    await waitFor(() => {
        expect(screen.getByDisplayValue("Camila Morales")).toBeTruthy();
    });

    const nameInput = screen.getByLabelText(/Nombre completo \*/i);
    const emailInput = screen.getByLabelText(/Email \*/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Camila Editada");
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "editado@email.com");

    const submitButton = screen.getByRole("button", { name: /guardar cambios/i });
    await fireEvent.click(submitButton);

    await waitFor(() => {
        expect(testRouter.currentRoute.value.fullPath).toBe("/home");
    });
    });
});
