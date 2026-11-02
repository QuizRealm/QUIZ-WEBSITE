/* Basic opt-in analytics. Advertising remains disabled until approval and CMP setup. */
(function(){
  'use strict';
  const KEY='qr_consent_v1';
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  const denied={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'};
  window.gtag('consent','default',denied);
  let loaded=false;
  const preference=()=>{try{return JSON.parse(localStorage.getItem(KEY));}catch{return null;}};
  function load(){
    if(loaded||!preference()?.analytics||['localhost','127.0.0.1'].includes(location.hostname)||navigator.globalPrivacyControl)return;
    loaded=true;
    // Discard events queued before consent, then establish consent before GTM.
    window.dataLayer.length=0;
    window.gtag('consent','default',denied);
    window.gtag('consent','update',{...denied,analytics_storage:'granted'});
    window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtm.js?id=GTM-ML3F7KLZ';document.head.append(script);
  }
  function choose(analytics){
    try{localStorage.setItem(KEY,JSON.stringify({analytics:Boolean(analytics),updated:new Date().toISOString()}));}catch{}
    window.gtag('consent','update',{...denied,analytics_storage:analytics?'granted':'denied'});
    document.getElementById('qr-consent')?.remove();
    if(analytics)load();else if(loaded)location.reload();
  }
  function show(){
    document.getElementById('qr-consent')?.remove();
    const el=document.createElement('section');el.id='qr-consent';el.className='qr-consent';el.setAttribute('aria-label','Privacy choices');
    el.innerHTML='<div><strong>Your play, your choice.</strong><p>Progress stays in this browser. Optional analytics helps us improve the games. <a href="/privacy.html">Privacy details</a></p></div><div class="qr-consent-actions"><button type="button" data-choice="no">Essential only</button><button type="button" data-choice="yes">Allow analytics</button></div>';
    el.querySelector('[data-choice="no"]').onclick=()=>choose(false);el.querySelector('[data-choice="yes"]').onclick=()=>choose(true);document.body.append(el);
  }
  window.RealmPrivacy={analyticsAllowed:()=>Boolean(preference()?.analytics)&&!navigator.globalPrivacyControl,show,choose};
  document.addEventListener('DOMContentLoaded',()=>{if(!preference()&&!navigator.globalPrivacyControl)show();else load();});
})();
