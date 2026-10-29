const navToggle=document.querySelector('.nav-toggle');
const navLinks=document.querySelector('.nav-links');
navToggle.addEventListener('click',()=>{const open=navToggle.getAttribute('aria-expanded')==='true';navToggle.setAttribute('aria-expanded',String(!open));navToggle.setAttribute('aria-label',open?'Open navigation menu':'Close navigation menu');navLinks.classList.toggle('open',!open);document.body.classList.toggle('menu-open',!open)});
navLinks.addEventListener('click',e=>{if(e.target.closest('a')){navToggle.setAttribute('aria-expanded','false');navToggle.setAttribute('aria-label','Open navigation menu');navLinks.classList.remove('open');document.body.classList.remove('menu-open')}});

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const form=document.getElementById('quote-form');
const fileInput=form.querySelector('input[type=file]');
const fileText=form.querySelector('.file-ui i');
fileInput.addEventListener('change',()=>{const file=fileInput.files[0];fileText.textContent=file?file.name:'No file selected'});
form.querySelectorAll('select').forEach(select=>select.addEventListener('change',()=>select.classList.add('touched')));
form.addEventListener('submit',e=>{e.preventDefault();const status=form.querySelector('.form-status');status.className='form-status';status.textContent='';const file=fileInput.files[0];const allowed=['application/pdf','image/jpeg','image/png','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];if(file&&(!allowed.includes(file.type)||file.size>5*1024*1024)){status.classList.add('error');status.textContent='Please choose a PDF, JPG, PNG, DOC, or DOCX file no larger than 5 MB.';fileInput.focus();return}if(!form.checkValidity()){status.classList.add('error');status.textContent='Please complete the required fields and check the highlighted information.';form.reportValidity();return}status.classList.add('success');status.textContent='Thank you—your enquiry has been validated. Connect this form to the approved secure Zoho CRM endpoint to submit live leads.';form.querySelector('button[type=submit]').textContent='Enquiry Ready ✓'});

document.getElementById('year').textContent=new Date().getFullYear();

/* Login / Sign-up modal */
const authModal = document.getElementById('auth-modal');
const authPanels = authModal.querySelectorAll('[data-auth-panel]');

function showAuthPanel(name) {
  authPanels.forEach(panel => {
    const active = panel.dataset.authPanel === name;
    panel.hidden = !active;
    if (active) {
      const status = panel.querySelector('.form-status');
      status.className = 'form-status';
      status.textContent = '';
      panel.querySelector('input').focus();
    }
  });
}

function openAuth(name) {
  if (!authModal.open) authModal.showModal();
  showAuthPanel(name);
}

document.querySelectorAll('[data-auth-open]').forEach(btn =>
  btn.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
    openAuth(btn.dataset.authOpen);
  })
);

authModal.querySelectorAll('[data-auth-switch]').forEach(btn =>
  btn.addEventListener('click', () => showAuthPanel(btn.dataset.authSwitch))
);

/* Click outside the card closes it */
authModal.addEventListener('click', e => {
  if (e.target === authModal) authModal.close();
});

/* Mark fields touched so invalid styling only appears after interaction */
authModal.querySelectorAll('.auth-form input').forEach(input =>
  input.addEventListener('blur', () => input.classList.add('touched'))
);

function handleAuthSubmit(form, pendingLabel, successMessage) {
  const submit = form.querySelector('button[type=submit]');
  const originalLabel = submit.textContent;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    status.className = 'form-status';
    status.textContent = '';
    form.querySelectorAll('input').forEach(input => input.classList.add('touched'));

    if (!form.checkValidity()) {
      status.classList.add('error');
      status.textContent = 'Please complete the required fields and check the highlighted information.';
      form.reportValidity();
      return;
    }
    status.classList.add('success');
    status.textContent = successMessage;
    submit.textContent = pendingLabel;
    setTimeout(() => { submit.textContent = originalLabel; }, 4000);
  });
}

handleAuthSubmit(
  document.getElementById('login-form'),
  'Checking…',
  'Details validated. Connect this form to the secure authentication endpoint to sign users in.'
);
/* Sign-up posts to Zoho CRM Web-to-Lead and creates a Lead.
   Validate first; only let the real POST through once the form is valid. */
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', e => {
  const status = signupForm.querySelector('.form-status');
  status.className = 'form-status';
  status.textContent = '';
  signupForm.querySelectorAll('input').forEach(input => input.classList.add('touched'));

  if (!signupForm.checkValidity()) {
    e.preventDefault();
    status.classList.add('error');
    status.textContent = 'Please complete the required fields and check the highlighted information.';
    signupForm.reportValidity();
    return;
  }
  /* Valid: allow the native POST through to Zoho CRM. */
  const submit = signupForm.querySelector('button[type=submit]');
  submit.disabled = true;
  submit.textContent = 'Creating account...';
});

/* Zoho redirects back with ?signup=success once the Lead is created. */
if (new URLSearchParams(location.search).get('signup') === 'success') {
  openAuth('signup');
  const panel = authModal.querySelector('[data-auth-panel=signup]');
  const status = panel.querySelector('.form-status');
  status.className = 'form-status success';
  status.textContent = 'Account request received. Our team has your details and will be in touch shortly.';
  panel.querySelector('form').reset();
  history.replaceState(null, '', location.pathname);
}
