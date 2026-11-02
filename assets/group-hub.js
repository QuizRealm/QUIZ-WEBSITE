(function(){
  const join=document.getElementById('join-room-form');if(!join)return;
  join.onsubmit=e=>{e.preventDefault();const code=join.elements.code.value.trim().toUpperCase();if(!/^[A-Z]{4}$/.test(code)){document.getElementById('room-message').textContent='Enter the four letters shown on the host screen.';return;}location.href='/play.html?code='+encodeURIComponent(code);};
  document.getElementById('host-room-form').onsubmit=e=>{e.preventDefault();const chars='ABCDEFGHJKLMNPQRSTUVWXYZ';const bytes=crypto.getRandomValues(new Uint8Array(4));const code=[...bytes].map(b=>chars[b%chars.length]).join('');localStorage.setItem('qr_host_settings',JSON.stringify({roomCode:code,categoryKey:document.getElementById('host-topic').value,hostId:'HOST_'+Date.now()}));location.href='/host-game.html?code='+code;};
})();
