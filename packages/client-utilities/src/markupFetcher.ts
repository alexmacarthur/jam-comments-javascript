interface IFetchData {
  path: string, 
  domain: string, 
  apiKey: string, 
  platform: string
}

const getBaseUrl = () => {
    if(typeof process !== 'undefined' && process.env?.JAM_COMMENTS_BASE_URL) {
        return process.env?.JAM_COMMENTS_BASE_URL;
    }

    return "https://go.jamcomments.com";
}

export const markupFetcher = (platform: string): Function => {
    return async ({
        path, 
        domain, 
        apiKey
    }: IFetchData) => {
        const params = new URLSearchParams({
            path, 
            domain, 
            force_embed: '1'
        });

        const response = await fetch(`${getBaseUrl()}/api/markup?${params}`, {
            method: 'GET', 
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: 'application/json',
                'X-Platform': platform
            }
        });

        return await response.text();
    }
}
