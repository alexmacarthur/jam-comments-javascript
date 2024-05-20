import { describe, it, vi, expect } from "vitest";
import CommentRequest from "./CommentRequest";

describe("CommentRequest", () => {
  it("should make successful request", async () => {
    const commentMock = vi.fn();
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 200,
        ok: true,
        json: () => ({ data: commentMock }),
      };
    });

    const request = CommentRequest(
      {
        endpoint: "https://go.jamcomments.com",
        apiKey: "123abc",
        platform: "test",
        path: "/test",
        domain: "test.com",
      },
      fetchMock,
    );

    const result = await request.post({
      content: "hello",
      name: "alex",
      email: "example@test.com",
      time_to_comment: 0,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer 123abc",
          "X-Platform": "test",
        }),
        body: JSON.stringify({
          content: "hello",
          name: "alex",
          email: "example@test.com",
          time_to_comment: 0,
          path: "/test",
          domain: "test.com",
          should_stub: false,
        }),
      }),
    );

    expect(result.data).toEqual(commentMock);
  });

  it("should stub request", async () => {
    const commentMock = vi.fn();
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 200,
        ok: true,
        json: () => ({ data: commentMock }),
      };
    });

    const request = CommentRequest(
      {
        endpoint: "https://go.jamcomments.com",
        apiKey: "123abc",
        platform: "test",
        path: "/test",
        domain: "test.com",
        should_stub: true,
      },
      fetchMock,
    );

    const result = await request.post({
      content: "hello",
      name: "alex",
      email: "example@test.com",
      time_to_comment: 0,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer 123abc",
          "X-Platform": "test",
        }),
        body: JSON.stringify({
          content: "hello",
          name: "alex",
          email: "example@test.com",
          time_to_comment: 0,
          path: "/test",
          domain: "test.com",
          should_stub: true,
        }),
      }),
    );

    expect(result.data).toEqual(commentMock);
  });

  it("should throw error on failed request", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 401,
        ok: false,
        json: () => ({ message: "badness happened" }),
      };
    });

    const request = CommentRequest(
      {
        endpoint: "https://go.jamcomments.com",
        apiKey: "123abc",
        platform: "test",
        path: "/test",
        domain: "test.com",
      },
      fetchMock,
    );

    expect(async () => {
      await request.post({
        content: "hello",
        name: "alex",
        email: "example@test.com",
        time_to_comment: 0,
      });
    }).rejects.toThrow("badness happened");
  });
});
