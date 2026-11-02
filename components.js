/* Shared navigation enhancement; all links are also present in the static HTML. */
(function(){
  'use strict';
  function setup(root){
    const button=root.querySelector('.qr-menu-toggle'),nav=root.querySelector('.qr-header-nav');
    if(button&&nav){button.onclick=()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);};root.addEventListener('keydown',e=>{if(e.key==='Escape'){button.setAttribute('aria-expanded','false');nav.classList.remove('open');button.focus();}});}
    root.querySelectorAll('[data-privacy]').forEach(b=>b.onclick=()=>window.RealmPrivacy?.show());
    window.GameEngine?.updateHeaderUI();
  }
  for(const tag of ['quiz-header','quiz-home-header','quiz-footer','quiz-seo-content']){
    if(!customElements.get(tag))customElements.define(tag,class extends HTMLElement{connectedCallback(){setup(this);}});
  }
  document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('.qr-site-header,.qr-site-footer').forEach(setup);document.querySelectorAll('[data-privacy]').forEach(b=>b.onclick=()=>window.RealmPrivacy?.show());});
})();
