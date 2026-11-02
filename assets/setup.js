(function(){
  const root=document.getElementById('quiz-setup');if(!root)return;
  const params=new URLSearchParams(location.search),key=params.get('category')||params.get('id')||'mixed';
  const label=key==='mixed'?'Mixed knowledge':typeof CATEGORY_CONFIG!=='undefined'&&CATEGORY_CONFIG[key]?.label||key.replace(/[-_]/g,' ');
  const heading=document.getElementById('setup-title');heading.textContent=label;
  root.querySelector('form').onsubmit=e=>{e.preventDefault();location.href='/quiz.html?category='+encodeURIComponent(key)+'&difficulty='+root.querySelector('select').value;};
})();
