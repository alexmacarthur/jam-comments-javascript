interface ICommentRequest {
    endpoint: string;
    apiKey: string;
    platform: string;
    path: string;
    domain: string;
}

const CommentRequest = ({
    endpoint,
    apiKey,
    platform,
    path,
    domain,
}: ICommentRequest) => {
    return {
        post: async (commentData) => {
            commentData.path = path;
            commentData.domain = domain;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                    "X-Platform": platform,
                },
                body: JSON.stringify(commentData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data;
        },
    };
};

export default CommentRequest;
