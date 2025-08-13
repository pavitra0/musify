// lib/actions/songActions.js

const api_url = 'https://jiosavan-api2.vercel.app/api/';
if (!api_url) {
    console.log("Error Fetching API");
};


export async function fetchSongSuggestions(id) {
  if (!id || id.trim() === "") return [];

  try {
    const res = await fetch(
      `${api_url}songs/${id}/suggestions`
    );

    if (!res.ok) throw new Error("Failed to fetch suggestions");

    const data = await res.json();
    return data?.data

  } catch (error) {
    console.error("Suggestion Fetch Error:", error.message);
    return [];
  }
}

export const getSongbyQuery = async (e , limit) => {
    try{ 
        const song = await fetch(`${api_url}search/songs?query=${e}&limit=${limit}`);
        const data = await song.json();
        if(!song.ok) {
            throw new Error(data.message || 'Failed to Fetch Artist Data');
        }
        return data;
    }
    catch{
        console.log('API Error: ', Error );
        throw Error;
    }
};
export const globalSearchByQuery = async (e , limit) => {
    try{ 
        const song = await fetch(`${api_url}search?query=${e}&limit=${limit}`);
        const data = await song.json();
        if(!song.ok) {
            throw new Error(data.message || 'Failed to Fetch Artist Data');
        }
        return data;
    }
    catch{
        console.log('API Error: ', Error );
        throw Error;
    }
};


export const getArtistbyQuery = async (e , limit) => {
    try{
        const song = await fetch(`${api_url}search/artists?query=${e}&limit=${limit}`);
        const data = await song.json();
        if(!song.ok) {
            throw new Error(data.message || 'Failed to Fetch Artist Data');
        }
        return data;
    }
    catch{
        console.log('API Error: ', Error );
        throw Error;
    }
};


export const searchAlbumByQuery = async (query) => {
    try {
        const Albums = await fetch(`${api_url}search/albums?query=${query}&limit=30`);
        const data = await Albums.json();
        if (!Albums.ok) {
            throw new Error(data.message || 'Failed to fetch Album data');
        }
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const searchArtistByQuery = async (query) => {
    try{
        const Artists = await fetch(`${api_url}search/artists?query=${query}&limit=15`);
        const data = await Artists.json();
        if(!Artists.ok) {
            throw new Error(data.message || 'Failed to Fetch Artist Data');
        }
        return data;
    }
    catch{
        console.log('API Error: ', Error );
        throw Error;
        
    }
};

export const fetchAlbumByID = async (ID) => { 
    try{
        const Album = await fetch(`${api_url}albums?id=${ID}&limit=30`);
        const data = await Album.json();
        if(!Album.ok) {
            throw new Error(data.message || 'Failed to Fetch Artist Data');
        }
        return data;
    }
    catch{
        console.log('API Error: ', Error );
        throw Error;
    }
};

export const fetchArtistByID = async (ID) => { 
    try {
        const response = await fetch(`${api_url}artists?id=${ID}`);
        const text = await response.text(); 

        // Ensure it's JSON before parsing
        const data = JSON.parse(text);
        if (!response.ok) {
            throw new Error(data.message || 'Failed to Fetch Artist Data');
        }
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};


export const searchPlayListByQuery = async (query) => { 
    try{
        const playlists = await fetch(`${api_url}search/playlists?query=${query}&limit=20`);
        const data = await playlists.json();
        if(!playlists.ok) {
            throw new Error(data.message || 'Failed to Fetch Artist Data');
        }
        return data;
    }
    catch{
        console.log('API Error: ', Error );
        throw Error;
    }
};

export const fetchplaylistsByID = async (ID) => { 
    try{
        const playlists = await fetch(`${api_url}playlists?id=${ID}&limit=40`);
        const data = await playlists.json();
        if(!playlists.ok) {
            throw new Error(data.message || 'Failed to Fetch Artist Data');
        }
        return data;
    }
    catch{
        console.log('API Error: ', Error );
        throw Error;
    }
};

export const fetchSongSuggestionsByID = async (ID) => { 
    try{
        const playlists = await fetch(`${api_url}?id=${ID}&limit=30`);
        const data = await playlists.json();
        if(!playlists.ok) {
            throw new Error(data.message || 'Failed to Fetch Artist Data');
        }
        return data;
    }
    catch{
        console.log('API Error: ', Error );
        throw Error;
    }
};



