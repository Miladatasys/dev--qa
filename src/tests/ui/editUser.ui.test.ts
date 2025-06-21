import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import { createRouter, createWebHistory } from "vue-router";
import userEvent from "@testing-library/user-event";

import EditUserView from "@/views/EditUserView.vue";
import HomeView from "@/views/HomeView.vue";

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

const router = createRouter({
    history: createWebHistory(),
    routes: [
    { path: "/", component: HomeView },
    { path: "/edit/:id", component: EditUserView }
    ] 
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("UI - Editar usuario", () => {
    it("Debería cargar datos y permitir editar el usuario", async () => {
    vi.stubGlobal("alert", vi.fn());

    vi.stubGlobal("fetch", vi.fn((url, options) => {
        if (options && options.method === "PUT") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        }

        return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockUser])
        });
    }));

    router.push("/edit/123");
    await router.isReady();

    render(EditUserView, {
        global: {
        plugins: [router]
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
        expect(router.currentRoute.value.fullPath).toBe("/");
    });
    });
});
