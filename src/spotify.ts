import { clientId } from './config.json'

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    console.log("Start")
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    const topTracks = await getTopTracks(accessToken);
    console.log(topTracks);
    populateUI(profile, topTracks);
    console.log(profile);
}

export async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(clientId: string, code: string): Promise<string> {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("code_verifier", verifier!);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

async function fetchProfile(token: string): Promise<UserProfile> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

// Could be combined with `fetchProfile()`
async function fetchWebApi(endpoint: string, method: string, token: string): Promise<any> {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
    });
    return res;
}

interface trackInfo {
    name: string;
    albumImageUrl: string;
    artistNames: string[];
}

export async function getTopTracks(token: string): Promise<trackInfo[]> {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    const response = await fetchWebApi(
        'v1/me/top/tracks?time_range=short_term&limit=5',
        'GET',
        token
    );
    const data = await response.json(); // Parse the JSON content of the response
    return data.items.map((item: any) => ({
        name: item.name,
        albumImageUrl: item.album.images[0].url,
        artistNames: item.artists.map((artist: any) => artist.name),
    }));
}

function populateUI(profile: UserProfile, topTracks: trackInfo[]) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar")!.appendChild(profileImage);
    }
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = "https://open.spotify.com/user/" + profile.id;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("followers")!.innerText = profile.followers.total.toString();
    document.getElementById("country")!.innerText = profile.country;
  
    const topTracksContainer = document.getElementById("topTracks");
    if (!topTracksContainer) return;
  
    topTracks.forEach((track) => {
      const trackDiv = document.createElement("div");
      trackDiv.textContent = track.name + " by " + track.artistNames.join(", ");
      topTracksContainer.appendChild(trackDiv);
    });
}
