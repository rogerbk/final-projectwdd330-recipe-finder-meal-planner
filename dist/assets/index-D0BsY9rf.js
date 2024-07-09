(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function o(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(t){if(t.ep)return;t.ep=!0;const i=o(t);fetch(t.href,i)}})();const a="3188a02f829a47ba93ed37b2b58b4f06";async function c(r=5){const e=`https://api.spoonacular.com/recipes/random?number=${r}&apiKey=${a}`;try{const o=await fetch(e);if(!o.ok)throw new Error("Network response was not ok");return(await o.json()).recipes}catch(o){return console.error("Error fetching random recipes:",o),[]}}async function l(){const r=document.getElementById("featured-recipes-carousel");r.innerHTML="Loading...";try{const e=await c(5);r.innerHTML="",e.forEach(o=>{const n=document.createElement("div");n.className="featured-recipe",n.innerHTML=`
        <img src="${o.image}" alt="${o.title}">
        <h3>${o.title}</h3>
      `,n.addEventListener("click",()=>d(o.id)),r.appendChild(n)})}catch(e){console.error("Error initializing featured recipes:",e),r.innerHTML="Failed to load recipes. Please try again later."}}async function d(r){try{const e=`https://api.spoonacular.com/recipes/${r}/information?apiKey=${a}`,o=await fetch(e);if(!o.ok)throw new Error("Network response was not ok");const n=await o.json();u(n)}catch(e){console.error("Error fetching recipe details:",e),alert("Failed to load recipe details. Please try again later.")}}function u(r){var n;const e=document.createElement("div");e.className="recipe-modal",e.innerHTML=`
    <div class="recipe-modal-content">
      <span class="close-modal">&times;</span>
      <h2>${r.title}</h2>
      <img src="${r.image}" alt="${r.title}">
      <p>${r.summary}</p>
      <h3>Ingredients:</h3>
      <ul>
        ${r.extendedIngredients.map(t=>`<li>${t.original}</li>`).join("")}
      </ul>
      <h3>Instructions:</h3>
      <ol>
        ${((n=r.analyzedInstructions[0])==null?void 0:n.steps.map(t=>`<li>${t.step}</li>`).join(""))||"No instructions available."}
      </ol>
    </div>
  `,document.body.appendChild(e),e.querySelector(".close-modal").addEventListener("click",()=>{document.body.removeChild(e)}),window.addEventListener("click",t=>{t.target===e&&document.body.removeChild(e)})}document.addEventListener("DOMContentLoaded",()=>{l();const r=document.querySelector(".hamburger"),e=document.querySelector(".nav-menu");r.addEventListener("click",()=>{e.classList.toggle("active"),r.classList.toggle("active")}),document.querySelectorAll(".nav-menu a").forEach(o=>{o.addEventListener("click",()=>{e.classList.remove("active"),r.classList.remove("active")})})});
