/* Shared gallery uploader for both static entry points. */
(() => {
  const folder = 'https://drive.google.com/drive/folders/1PMlwA8EriPjg7OmfKvftVEdtlxUf18Ed';
  const endpoint = 'https://script.google.com/macros/s/AKfycbxz2yfHC5bt8V1lG4faZBQ6Y6kKNTo-iPiTM-BUgik5_mjNohBnfiwUE0cyy27fA9FR/exec';
  const section = document.createElement('section');
  section.id = 'photos'; section.className = 'block'; section.setAttribute('aria-labelledby', 'photosTitle');
  section.innerHTML = `<div class="wrap"><div class="eyebrow">OUR CAPE TOWN MEMORIES</div><h2 class="h2" id="photosTitle">Share your photos</h2><p class="sub">Choose your favourite moments from your gallery and add them to our shared trip album. Everyone is welcome—no registration needed.</p><div class="photo-box"><label class="photo-picker" for="photoFiles"><span aria-hidden="true" style="font-size:36px">＋</span><strong>Choose photos from your gallery</strong><span>Or drop photos here on a computer</span><span>JPG, PNG, WebP, GIF or HEIC · Up to 10 photos, 10 MB each</span></label><input id="photoFiles" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif" multiple><p>Only share photos you have permission to share. They will be saved in the shared trip folder.</p><ul id="photoQueue" aria-label="Selected photos"></ul><button class="submit" id="uploadPhotos" type="button" disabled>Upload photos</button><p id="photoStatus" role="status" aria-live="polite">Choose photos to get started.</p><a href="${folder}" target="_blank" rel="noopener noreferrer">View shared album ↗</a></div></div>`;
  (document.getElementById('connect') || document.getElementById('register')).before(section);
  const style = document.createElement('style');
  style.textContent = `#photos{scroll-margin-top:80px;background:#faf7ff}.photo-box{max-width:760px;margin:24px auto 0;background:white;border:1px solid #e4dded;border-radius:20px;padding:24px}.photo-picker{display:flex;align-items:center;gap:10px;flex-direction:column;padding:28px 12px;border:2px dashed #7953ad;border-radius:14px;background:#f8f4ff;cursor:pointer;text-align:center}.photo-picker span{font-size:13px}.photo-picker strong{font-size:19px}#photoFiles{display:block;width:100%;margin:16px 0}#photoQueue{padding:0;list-style:none}#photoQueue li{display:flex;align-items:center;gap:12px;margin:12px 0;overflow-wrap:anywhere}#photoQueue img{width:64px;height:64px;object-fit:cover;border-radius:8px}#photoQueue .photo-copy{flex:1;min-width:0}#photoQueue button{min-height:44px;background:#fff;border:1px solid #ddd;border-radius:8px;padding:8px;cursor:pointer}#uploadPhotos:disabled{opacity:.55;cursor:not-allowed}.photo-box p{font-size:14px;line-height:1.5}#photoStatus{min-height:24px}#photos button:focus-visible,.photo-picker:focus-within{outline:3px solid #7953ad;outline-offset:3px}@media(max-width:600px){.photo-box{padding:16px}}`;
  document.head.append(style);
  const input = document.getElementById('photoFiles'), queue = document.getElementById('photoQueue'), upload = document.getElementById('uploadPhotos'), status = document.getElementById('photoStatus');
  let items = [], busy = false;
  function render() {
    queue.replaceChildren();
    items.forEach(item => {
      const li = document.createElement('li'), img = document.createElement('img'), copy = document.createElement('div'), remove = document.createElement('button');
      img.src = item.url; img.alt = ''; img.onerror = () => { img.hidden = true; };
      copy.className = 'photo-copy'; copy.textContent = `${item.file.name} · ${(item.file.size / 1048576).toFixed(1)} MB — ${item.state}`;
      remove.type = 'button'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove ${item.file.name}`); remove.disabled = busy;
      remove.onclick = () => { URL.revokeObjectURL(item.url); items = items.filter(other => other !== item); render(); };
      li.append(img, copy, remove); queue.append(li);
    });
    input.disabled = busy; upload.disabled = busy || !items.some(item => item.state !== 'Uploaded');
    upload.textContent = busy ? 'Uploading…' : 'Upload photos';
  }
  function select(files) {
    if (busy) return;
    const errors = [];
    for (const file of files) {
      if (!/\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name) || !file.size || file.size > 10 * 1048576) { errors.push(`${file.name}: choose a supported image under 10 MB.`); continue; }
      if (items.some(item => item.file.name === file.name && item.file.size === file.size && item.file.lastModified === file.lastModified)) continue;
      if (items.length >= 10) { errors.push('You can select up to 10 photos at a time.'); break; }
      items.push({file, url: URL.createObjectURL(file), state: 'Ready', id: crypto.randomUUID()});
    }
    input.value = ''; render(); status.textContent = errors.join(' ') || `${items.length} photos selected. Tap Upload photos when ready.`;
  }
  input.onchange = () => select(input.files);
  const picker = section.querySelector('.photo-picker');
  picker.ondragover = event => event.preventDefault();
  picker.ondrop = event => { event.preventDefault(); select(event.dataTransfer.files); };
  function read(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = () => reject(new Error('Could not read photo.')); reader.readAsDataURL(file); }); }
  upload.onclick = async () => {
    if (!navigator.onLine) { status.textContent = 'You are offline. Reconnect, then tap Upload photos. Your selection is still here.'; return; }
    busy = true; render();
    try {
      status.textContent = 'Connecting to the shared album…';
      const health = await fetch(endpoint, {signal: AbortSignal.timeout(30000)}).then(r => r.json());
      if (!health.photo_uploads) throw new Error('Direct uploads are not available yet. Please try again later, or open the shared album.');
      for (const [index, item] of items.entries()) {
        if (item.state === 'Uploaded') continue;
        item.state = 'Uploading…'; render(); status.textContent = `Uploading photo ${index + 1} of ${items.length}. Keep this page open.`;
        try {
          const result = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({record_type:'photo', upload_id:item.id, name:item.file.name, data:await read(item.file)}), signal:AbortSignal.timeout(120000)}).then(r => r.json());
          if (!result.ok || !result.file_id) throw new Error(result.error || 'Upload was not confirmed.');
          item.state = 'Uploaded';
        } catch (error) { item.state = 'Not confirmed — retry upload'; }
        render();
      }
      const count = items.filter(item => item.state === 'Uploaded').length;
      status.textContent = `${count} of ${items.length} photos uploaded.${count < items.length ? ' Tap Upload photos to retry the remaining photos.' : ' Thank you for sharing! You can remove these and choose more photos.'}`;
    } catch (error) { status.textContent = error.message || 'Unable to connect. Please try again.'; }
    finally { busy = false; render(); }
  };
  window.addEventListener('beforeunload', event => { if (busy) { event.preventDefault(); event.returnValue = ''; } });
})();
