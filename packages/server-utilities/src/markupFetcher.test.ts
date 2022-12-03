import { describe, expect, it, afterEach, beforeEach, vi } from 'vitest'
import { isProduction } from "./markupFetcher";

const env = process.env;
const importMeta = import.meta;

beforeEach(() => {
    globalThis.process = {env: {}} as any
    globalThis.import = { meta: {env: {}}};

    vi.resetModules();

    process.env = { ...env }
    globalThis.import.meta = {env: {...env}}
})

afterEach(() => {
    process = {env: {}} as any
    process.env = env

    globalThis.import.meta.env = importMeta;
});

describe("isProduction()", () => {
    it("handles undefined", () => {
        process = undefined;
        (import.meta as any).env = undefined;

        const result = isProduction();
        
        expect(result).toBe(false);
    });

    describe("process is set", () => {
        it("production", () => {
            globalThis.process = { env: {
                NODE_ENV: 'production'
            }} as any

            const result = isProduction();
            
            expect(result).toBe(true);
        });

        it("development", () => {
            globalThis.process = { env: {
                NODE_ENV: 'development'
            }} as any

            const result = isProduction();
            
            expect(result).toBe(false);
        });
    })

    describe("import.meta is set", () => {
        it.only("production", () => {
            process.env = undefined;

            globalThis.import = { meta: {
                env: {
                    NODE_ENV: 'production'
                }
            }} as any

            const result = isProduction();
            
            expect(result).toBe(true);
        });

        it("development", () => {
            process.env = undefined;

            globalThis.import = { meta: {
                env: {
                    NODE_ENV: 'development'
                }
            }} as any

            const result = isProduction();
            
            expect(result).toBe(false);
        });
    })
});
