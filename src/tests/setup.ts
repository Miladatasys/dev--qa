import '@testing-library/jest-dom'
import { server } from './mocks/server'
import { afterAll, afterEach, beforeAll } from 'vitest'

declare module '@testing-library/user-event';
declare module '@testing-library/user-event';

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
