const navToggle=document.querySelector('.nav-toggle');
const navLinks=document.querySelector('.nav-links');
navToggle.addEventListener('click',()=>{const open=navToggle.getAttribute('aria-expanded')==='true';navToggle.setAttribute('aria-expanded',String(!open));navToggle.setAttribute('aria-label',open?'Open navigation menu':'Close navigation menu');navLinks.classList.toggle('open',!open);document.body.classList.toggle('menu-open',!open)});
navLinks.addEventListener('click',e=>{if(e.target.closest('a')){navToggle.setAttribute('aria-expanded','false');navToggle.setAttribute('aria-label','Open navigation menu');navLinks.classList.remove('open');document.body.classList.remove('menu-open')}});

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const lightbox=document.getElementById('lightbox');
document.querySelectorAll('.gallery-item').forEach(item=>item.addEventListener('click',()=>{const img=lightbox.querySelector('img');img.src=item.dataset.image;img.alt=item.dataset.caption;lightbox.querySelector('p').textContent=item.dataset.caption;lightbox.showModal()}));
lightbox.querySelector('button').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});

const form=document.getElementById('quote-form');
const fileInput=form.querySelector('input[type=file]');
const fileText=form.querySelector('.file-ui i');
fileInput.addEventListener('change',()=>{const file=fileInput.files[0];fileText.textContent=file?file.name:'No file selected'});
form.querySelectorAll('select').forEach(select=>select.addEventListener('change',()=>select.classList.add('touched')));
form.addEventListener('submit',e=>{e.preventDefault();const status=form.querySelector('.form-status');status.className='form-status';status.textContent='';const file=fileInput.files[0];const allowed=['application/pdf','image/jpeg','image/png','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];if(file&&(!allowed.includes(file.type)||file.size>5*1024*1024)){status.classList.add('error');status.textContent='Please choose a PDF, JPG, PNG, DOC, or DOCX file no larger than 5 MB.';fileInput.focus();return}if(!form.checkValidity()){status.classList.add('error');status.textContent='Please complete the required fields and check the highlighted information.';form.reportValidity();return}status.classList.add('success');status.textContent='Thank you—your enquiry has been validated. Connect this form to the approved secure Zoho CRM endpoint to submit live leads.';form.querySelector('button[type=submit]').textContent='Enquiry Ready ✓'});

document.getElementById('year').textContent=new Date().getFullYear();
