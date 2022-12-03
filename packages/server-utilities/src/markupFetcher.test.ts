import { describe, expect, it, vi} from 'vitest'
import { markupFetcher } from "./markupFetcher";

describe("markupFetcher", () => {
    it("constructs fetch request correctly", async () => {
        const fetchMock = vi.fn().mockImplementation(() => {
            return {
                status: 200, 
                ok: true, 
                text: () => "results!"
            }
        });

        const fetcher = markupFetcher("test", fetchMock);

        const result = await fetcher({
            path: "/test", 
            domain: "test.com", 
            apiKey: "123abc"
        });

        expect(fetchMock).toHaveBeenCalledWith(
            "https://go.jamcomments.com/api/markup?path=%2Ftest&domain=test.com", 
            expect.objectContaining({
                headers: expect.objectContaining({
                    Accept: "application/json", 
                    Authorization: "Bearer 123abc", 
                    "X-Platform": "test"
                }), 
                method: "GET"
            })
        );
        expect(result).toEqual("results!");
    }); 

    it("stubs comments", async () => {
        const fetchMock = vi.fn().mockImplementation(() => {
            return {
                status: 200, 
                ok: true, 
                text: () => "results!"
            }
        });

        const fetcher = markupFetcher("test", fetchMock);

        const result = await fetcher({
            path: "/test", 
            domain: "test.com", 
            apiKey: "123abc", 
            environment: "development"
        });

        expect(fetchMock).toHaveBeenCalledWith(
            "https://go.jamcomments.com/api/markup?path=%2Ftest&domain=test.com&stub=true", 
            expect.anything()
        );
        expect(result).toEqual("results!");
    }); 

    it("uses different base URL", async () => {
        const fetchMock = vi.fn().mockImplementation(() => {
            return {
                status: 200, 
                ok: true, 
                text: () => "results!"
            }
        });

        const fetcher = markupFetcher("test", fetchMock);

        const result = await fetcher({
            path: "/test", 
            domain: "test.com", 
            apiKey: "123abc", 
            baseUrl: "http://ur-mom.com"
        });

        expect(fetchMock).toHaveBeenCalledWith(
            "http://ur-mom.com/api/markup?path=%2Ftest&domain=test.com", 
            expect.anything()
        );
        expect(result).toEqual("results!");
    }); 

    it("falls back to root path", async () => {
        const fetchMock = vi.fn().mockImplementation(() => {
            return {
                status: 200, 
                ok: true, 
                text: () => "results!"
            }
        });

        const fetcher = markupFetcher("test", fetchMock);

        const result = await fetcher({
            path: null, 
            domain: "test.com"
        });

        expect(fetchMock).toHaveBeenCalledWith(
            "https://go.jamcomments.com/api/markup?path=%2F&domain=test.com", 
            expect.anything()
        );
        expect(result).toEqual("results!");
    }); 

    it("credentials are invalid", async () => {
        const fetchMock = vi.fn().mockImplementation(() => {
            return {
                status: 401, 
                ok: false, 
                text: () => "bad results!"
            }
        });

        const fetcher = markupFetcher("test", fetchMock);

        expect(fetcher({
            path: "/test", 
            domain: "test.com", 
            apiKey: "123abc"
        })).rejects.toThrowError(/Unauthorized!/);
    }); 

    it("response isn't ok", async () => {
        const fetchMock = vi.fn().mockImplementation(() => {
            return {
                status: 500, 
                ok: false, 
                text: () => "bad results!"
            }
        });

        const fetcher = markupFetcher("test", fetchMock);

        expect(fetcher({
            path: "/test", 
            domain: "test.com", 
            apiKey: "123abc"
        })).rejects.toThrowError(/request failed! Status code: 500/);
    }); 
})
