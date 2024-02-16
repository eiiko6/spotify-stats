(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();const l=new URLSearchParams(window.location.search),i=l.get("code"),c=sessionStorage.getItem("clientId");if(c)if(!i)d(c);else{console.log("Start");const e=await u(c,i),n=await f(e),a=await h(e,"short",20);console.log(a),y(n,a),console.log(n)}else{const e=prompt("Enter clientId")?.toString();e?(sessionStorage.setItem("clientId",e),d(e)):console.log("User canceled the prompt.")}async function d(e){const n=p(128),a=await m(n);localStorage.setItem("verifier",n);const t=new URLSearchParams;t.append("client_id",e),t.append("response_type","code"),t.append("redirect_uri","http://localhost:5173/callback"),t.append("scope","user-read-private user-read-email user-top-read"),t.append("code_challenge_method","S256"),t.append("code_challenge",a),document.location=`https://accounts.spotify.com/authorize?${t.toString()}`}function p(e){let n="",a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let t=0;t<e;t++)n+=a.charAt(Math.floor(Math.random()*a.length));return n}async function m(e){const n=new TextEncoder().encode(e),a=await window.crypto.subtle.digest("SHA-256",n);return btoa(String.fromCharCode.apply(null,[...new Uint8Array(a)])).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function u(e,n){const a=localStorage.getItem("verifier"),t=new URLSearchParams;t.append("client_id",e),t.append("grant_type","authorization_code"),t.append("code",n),t.append("redirect_uri","http://localhost:5173/callback"),t.append("code_verifier",a);const o=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:t}),{access_token:r}=await o.json();return r}async function f(e){return await(await fetch("https://api.spotify.com/v1/me",{method:"GET",headers:{Authorization:`Bearer ${e}`}})).json()}async function g(e,n,a){return await fetch(`https://api.spotify.com/${e}`,{headers:{Authorization:`Bearer ${a}`},method:n})}async function h(e,n,a){return n=="long"?document.getElementById("topTracksParent").innerHTML='<b>All-Time Top Tracks: </b><div id="topTracks"></div>':n=="medium"?document.getElementById("topTracksParent").innerHTML=`<b>Last 6 Months' Top Tracks: </b><div id="topTracks"></div>`:n=="short"&&(document.getElementById("topTracksParent").innerHTML=`<b>Last Month's Top Tracks: </b><div id="topTracks"></div>`),(await(await g("v1/me/top/tracks?time_range="+n+"_term&limit="+a,"GET",e)).json()).items.map(r=>({name:r.name,albumImageUrl:r.album.images[0].url,artistNames:r.artists.map(s=>s.name)}))}function y(e,n){if(document.getElementById("displayName").innerText=e.display_name,e.images[0]){const t=new Image(200,200);t.src=e.images[0].url,document.getElementById("avatar").appendChild(t)}document.getElementById("id").innerText=e.id,document.getElementById("email").innerText=e.email,document.getElementById("product").innerText=e.product,document.getElementById("uri").innerText="https://open.spotify.com/user/"+e.id,document.getElementById("uri").setAttribute("href",e.external_urls.spotify),document.getElementById("followers").innerText=e.followers.total.toString(),document.getElementById("country").innerText=e.country;const a=document.getElementById("topTracks");a&&n.forEach(t=>{const o=document.createElement("div");o.classList.add("track-container");const r=new Image;r.src=t.albumImageUrl,r.alt=t.name,r.classList.add("track-image"),o.appendChild(r);const s=document.createElement("div");s.textContent=t.name+" by "+t.artistNames.join(", "),o.appendChild(s),a.appendChild(o)})}
