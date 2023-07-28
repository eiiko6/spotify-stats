(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();const l=new URLSearchParams(window.location.search),i=l.get("code"),c=sessionStorage.getItem("clientId");if(c)if(!i)d(c);else{console.log("Start");const e=await u(c,i),n=await f(e),r=await h(e,"medium",50);console.log(r),y(n,r),console.log(n)}else{const e=prompt("Enter clientId")?.toString();e?(sessionStorage.setItem("clientId",e),d(e)):console.log("User canceled the prompt.")}async function d(e){const n=p(128),r=await m(n);localStorage.setItem("verifier",n);const t=new URLSearchParams;t.append("client_id",e),t.append("response_type","code"),t.append("redirect_uri","http://localhost:5173/callback"),t.append("scope","user-read-private user-read-email user-top-read"),t.append("code_challenge_method","S256"),t.append("code_challenge",r),document.location=`https://accounts.spotify.com/authorize?${t.toString()}`}function p(e){let n="",r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let t=0;t<e;t++)n+=r.charAt(Math.floor(Math.random()*r.length));return n}async function m(e){const n=new TextEncoder().encode(e),r=await window.crypto.subtle.digest("SHA-256",n);return btoa(String.fromCharCode.apply(null,[...new Uint8Array(r)])).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function u(e,n){const r=localStorage.getItem("verifier"),t=new URLSearchParams;t.append("client_id",e),t.append("grant_type","authorization_code"),t.append("code",n),t.append("redirect_uri","http://localhost:5173/callback"),t.append("code_verifier",r);const o=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:t}),{access_token:a}=await o.json();return a}async function f(e){return await(await fetch("https://api.spotify.com/v1/me",{method:"GET",headers:{Authorization:`Bearer ${e}`}})).json()}async function g(e,n,r){return await fetch(`https://api.spotify.com/${e}`,{headers:{Authorization:`Bearer ${r}`},method:n})}async function h(e,n,r){return n=="long"?document.getElementById("topTracksParent").innerHTML='All-Time Top Tracks: <div id="topTracks"></div>':n=="medium"?document.getElementById("topTracksParent").innerHTML=`Last 6 Months' Top Tracks: <div id="topTracks"></div>`:n=="short"&&(document.getElementById("topTracksParent").innerHTML=`Last Month's Top Tracks: <div id="topTracks"></div>`),(await(await g("v1/me/top/tracks?time_range="+n+"_term&limit="+r,"GET",e)).json()).items.map(a=>({name:a.name,albumImageUrl:a.album.images[0].url,artistNames:a.artists.map(s=>s.name)}))}function y(e,n){if(document.getElementById("displayName").innerText=e.display_name,e.images[0]){const t=new Image(200,200);t.src=e.images[0].url,document.getElementById("avatar").appendChild(t)}document.getElementById("id").innerText=e.id,document.getElementById("email").innerText=e.email,document.getElementById("uri").innerText="https://open.spotify.com/user/"+e.id,document.getElementById("uri").setAttribute("href",e.external_urls.spotify),document.getElementById("followers").innerText=e.followers.total.toString(),document.getElementById("country").innerText=e.country;const r=document.getElementById("topTracks");r&&n.forEach(t=>{const o=document.createElement("div");o.textContent=t.name+" by "+t.artistNames.join(", "),r.appendChild(o)})}
