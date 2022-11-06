interface IFetchData {
  path: string, 
  domain: string, 
  apiKey: string, 
  platform: string,
  embedScript?: boolean
}

const getBaseUrl = () => {
    if(typeof process !== 'undefined' && process.env?.JAM_COMMENTS_BASE_URL) {
        return process.env['JAM_COMMENTS_BASE_URL'];
    }
    
    return "https://go.jamcomments.com";
}

export const markupFetcher = (platform: string): Function => {
    return async ({
        path, 
        domain, 
        apiKey, 
        embedScript = false
    }: IFetchData) => {
        const params = new URLSearchParams({
            path,
            domain, 
            forced_embed_js: embedScript ? '1' : '0'
        });

        const response = await fetch(`${getBaseUrl()}/api/markup?${params}`, {
            method: 'GET', 
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: 'application/json',
                'X-Platform': platform
            }
        });

        if(response.status === 401) {
            throw `JamComments: Unauthorized! Are your domain and API key set correctly?`;
        }

        if(!response.ok) {
            throw `JamComments request failed! Status code: ${response.status}, message: ${response.statusText}`;
        }

        return await response.text();
    }
}
