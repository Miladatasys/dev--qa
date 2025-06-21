import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import CreateUserView from "@/views/CreateUserView.vue";
import * as userService from '@/services/userService';


const mockUsers = [
    {
        id: "1",
        rut: "12345678-5",
        name: "Camila Morales",
        birthDate: "1995-06-19",
        children: 2,
        email: "camila@gmail.com",
        phones: [{ number: "+56987654321", type: "Móvil" }],
        addresses: [
        { street: "Providencia 123", city: "Santiago", region: "Metropolitana" },
    ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: HomeView },
        { path: "/new", component: CreateUserView },
    ],
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("UI - Eliminar usuario", () => {
    it("Debería permitir eliminar un usuario con confirmación", async () => {

        vi.stubGlobal("confirm", vi.fn(() => true));
        const deleteUserMock = vi
        .spyOn(userService, "deleteUser")
        .mockResolvedValue();

        vi.spyOn(userService, "getUsers").mockResolvedValue(mockUsers);

        render(HomeView, {
            global: {
                plugins: [router],
            },
        });

        const deleteButtons = await screen.findAllByRole("button", { name: /eliminar/i });
        await fireEvent.click(deleteButtons[0]);

        expect(confirm).toHaveBeenCalled();

        expect(deleteUserMock).toHaveBeenCalledWith("1");
    });
});