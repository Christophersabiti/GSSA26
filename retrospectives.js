(() => {
  'use strict';
  const endpoint='https://script.google.com/macros/s/AKfycbxz2yfHC5bt8V1lG4faZBQ6Y6kKNTo-iPiTM-BUgik5_mjNohBnfiwUE0cyy27fA9FR/exec';
  const form=document.getElementById('retroForm'), status=document.getElementById('formStatus'), button=document.getElementById('submitRetro'), success=document.getElementById('success');
  const fields=[...form.querySelectorAll('textarea')];
  let pending=null, busy=false;
  // A random per-submission key exists only in memory; it is not a visitor identity.
  fields.forEach(field=>field.addEventListener('input',()=>{
    document.getElementById(field.id+'-count').textContent=field.value.length.toLocaleString()+' / 4,000';
    status.textContent='';
  }));
  async function request(options) {
    const response=await fetch(endpoint,{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(30000),...options});
    if(!response.ok) throw new Error('Unable to reach the feedback service. Please try again.');
    return response.json();
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault(); if(busy)return;
    const answers=Object.fromEntries(fields.map(field=>[field.name,field.value.trim()]));
    if(!Object.values(answers).some(Boolean)){status.textContent='Please answer at least one prompt before submitting.';fields[0].focus();return;}
    if(!navigator.onLine){status.textContent='You are offline. Reconnect and submit again. Keep this page open to retain your answers.';status.focus();return;}
    if(!pending || JSON.stringify(pending.answers)!==JSON.stringify(answers))pending={answers,id:crypto.randomUUID()};
    busy=true; button.disabled=true; fields.forEach(field=>field.disabled=true); button.textContent='Saving your reflection…';status.textContent='';
    try {
      const health=await request();
      if(!health.retrospectives)throw new Error('The retrospective form is not accepting responses yet. Please keep your answers here and try again later.');
      const result=await request({method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({record_type:'retrospective',submission_id:pending.id,...answers})});
      if(!result.ok || result.submission_id!==pending.id)throw new Error('We could not confirm your reflection was saved. Please retry; an unchanged retry will not create a duplicate.');
      form.reset();fields.forEach(field=>document.getElementById(field.id+'-count').textContent='0 / 4,000');pending=null;
      form.hidden=true;success.hidden=false;success.focus();
    } catch(error) {
      status.textContent=error.name==='TimeoutError'||error.name==='TypeError'?'We could not confirm your reflection was saved. Keep this page open and retry. Your answers are still here; an unchanged retry will not create a duplicate.':error.message;
      status.focus();
    } finally {busy=false;button.disabled=false;fields.forEach(field=>field.disabled=false);button.innerHTML='Submit reflection <span aria-hidden="true">→</span>';}
  });
  document.getElementById('another').addEventListener('click',()=>{success.hidden=true;form.hidden=false;fields[0].focus();});
  window.addEventListener('beforeunload',event=>{if(busy||fields.some(field=>field.value.trim())){event.preventDefault();event.returnValue='';}});
  if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  // Keep existing shared links useful after changing the landing page.
  const movedPages={'#connect':'connect.html','#support':'support.html','#photos':'gallery.html','#gallery':'gallery.html'};
  if(movedPages[location.hash])location.replace(movedPages[location.hash]);
  else if(['#album','#register','#photos','#updates','#connect','#support','#admin'].includes(location.hash)) location.replace('journey.html'+location.hash);
})();
