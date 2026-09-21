(() => {
const CONFIG={FORM_ENDPOINT:'https://script.google.com/macros/s/AKfycbxz2yfHC5bt8V1lG4faZBQ6Y6kKNTo-iPiTM-BUgik5_mjNohBnfiwUE0cyy27fA9FR/exec'};

const CONNECT_KEY='gssa2026_connections';
let connections=[];
const cleanLinkedInUrl=value=>{
  try{const url=new URL(value.trim());if(!/(^|\.)linkedin\.com$/i.test(url.hostname)||!/^\/in\//i.test(url.pathname))throw new Error();url.search='';url.hash='';return url.toString().replace(/\/$/,'');}catch(error){throw new Error('Please paste a public LinkedIn profile URL containing linkedin.com/in/.');}
};
const fallbackName=url=>decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop()||'LinkedIn member').replace(/[-_]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const initials=name=>name.split(/\s+/).slice(0,2).map(part=>part[0]||'').join('').toUpperCase();
const normaliseProfile=profile=>({url:String(profile.url||profile.linkedin_url||''),name:String(profile.name||'LinkedIn member'),image:String(profile.image||''),description:String(profile.description||'PMI GSSA Cape Town 2026 delegate')});
function saveConnections(){localStorage.setItem(CONNECT_KEY,JSON.stringify(connections));}
function renderConnections(){
  connections=connections.filter((item,index,list)=>item.url&&list.findIndex(other=>other.url===item.url)===index).sort((a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:'base'}));
  const grid=document.getElementById('connectGrid');grid.replaceChildren();
  document.getElementById('connectCount').textContent=connections.length+' '+(connections.length===1?'person':'people')+' connecting';
  if(!connections.length){const empty=document.createElement('div');empty.className='connect-empty';empty.textContent='Be the first delegate to add a LinkedIn profile.';grid.appendChild(empty);return;}
  connections.forEach(profile=>{
    const card=document.createElement('a');card.className='connect-card';card.href=profile.url;card.target='_blank';card.rel='noopener noreferrer';card.setAttribute('aria-label','Connect with '+profile.name+' on LinkedIn');
    const avatar=document.createElement('span');avatar.className='connect-avatar';
    if(profile.image){const image=document.createElement('img');image.src=profile.image;image.alt='';image.loading='lazy';image.referrerPolicy='no-referrer';image.addEventListener('error',()=>{avatar.replaceChildren(document.createTextNode(initials(profile.name)));});avatar.appendChild(image);}else avatar.textContent=initials(profile.name);
    const copy=document.createElement('span');copy.className='connect-card-copy';const name=document.createElement('h3');name.textContent=profile.name;const desc=document.createElement('p');desc.textContent=profile.description;const label=document.createElement('span');label.className='linkedin-label';label.textContent='View LinkedIn profile';copy.append(name,desc,label);card.append(avatar,copy);grid.appendChild(card);
  });
}
async function fetchConnections(){
  connections=(JSON.parse(localStorage.getItem(CONNECT_KEY)||'[]')).map(normaliseProfile);renderConnections();
  try{const response=await fetch(CONFIG.FORM_ENDPOINT+'?action=connections',{cache:'no-store'});const body=await response.json();if(Array.isArray(body.connections)){connections=body.connections.map(normaliseProfile).concat(connections);saveConnections();renderConnections();}}catch(error){}
}
async function linkedInMetadata(url){
  const fallback={url,name:fallbackName(url),image:'',description:'PMI GSSA Cape Town 2026 delegate'};
  try{const response=await fetch('https://api.microlink.io/?url='+encodeURIComponent(url));if(!response.ok)return fallback;const body=await response.json(),data=body.data||{};let name=String(data.title||'').replace(/\s*\|\s*LinkedIn.*$/i,'').trim();if(!name||/^(linkedin|sign up|log in|join linkedin)$/i.test(name))name=fallback.name;return {url,name,image:(data.image&&data.image.url)||'',description:data.description||fallback.description};}catch(error){return fallback;}
}
document.getElementById('connectForm').addEventListener('submit',async event=>{
  event.preventDefault();const field=document.getElementById('linkedinUrl'),message=document.getElementById('connectMsg'),button=document.getElementById('connectSubmit');message.className='connect-msg';
  let url;try{url=cleanLinkedInUrl(field.value);}catch(error){message.className='connect-msg err';message.textContent=error.message;return;}
  button.disabled=true;button.textContent='Creating your card...';
  const profile=await linkedInMetadata(url),existing=connections.findIndex(item=>item.url===url);if(existing>=0)connections[existing]=profile;else connections.push(profile);saveConnections();renderConnections();
  try{await fetch(CONFIG.FORM_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({record_type:'connection',linkedin_url:profile.url,full_name:profile.name,thumbnail_url:profile.image,description:profile.description,submitted_at:new Date().toISOString()})});}catch(error){}
  field.value='';button.disabled=false;button.textContent='Generate my profile card';message.className='connect-msg ok';message.textContent='Your profile is now in the Connect directory.';
});
fetchConnections();


})();
