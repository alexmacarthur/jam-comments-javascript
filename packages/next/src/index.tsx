import * as React from "react";

interface IFetchData {
  path: string, 
  domain: string, 
  apiKey: string
}

export const JamComments = ({ markup }) => <div dangerouslySetInnerHTML={{__html: markup}}></div>

export const fetchData = async ({
  path, 
  domain, 
  apiKey
}: IFetchData): Promise<string> => {
  const params = new URLSearchParams({
    path, 
    domain, 
    force_embed: '1'
  })
  
  const response = await fetch(`http://localhost/api/markup?${params}`, {
    method: 'GET', 
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json'
    }
  });

  return await response.text();
}
