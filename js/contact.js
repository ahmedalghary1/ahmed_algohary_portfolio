// A local message composer, with optional handoff to the owner's email app.
// This static site never claims to deliver a message or stores a visitor's draft.
export function initContact(content, signal) {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const fields = [...form.querySelectorAll('[name]:not(button)')];
  const feedback = document.querySelector('#contact-feedback');
  const prepared = document.querySelector('#contact-prepared');
  const draft = document.querySelector('#prepared-message');
  let attempted = false, statusKey = '', busy = false;
  const copy = () => content[document.documentElement.lang].contact;
  function validate(field) {
    const valid = field.value.trim().length > 0 && field.validity.valid;
    field.setAttribute('aria-invalid', String(!valid));
    form.querySelector(`[data-field-error="${field.name}"]`).textContent = valid ? '' : copy()[`${field.name}Error`];
    return valid;
  }
  function message() {
    return fields.map(field => `${copy()[`${field.name}Label`]}: ${field.value.trim()}`).join('\n\n');
  }
  function announce(key) {
    statusKey = key;
    feedback.textContent = key ? copy()[key] : '';
  }
  form.noValidate = true;
  form.hidden = false;
  form.addEventListener('input', event => {
    if (attempted && fields.includes(event.target)) validate(event.target);
    announce('');
    prepared.hidden = true;
  }, { signal });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    attempted = true;
    const invalid = fields.filter(field => !validate(field));
    if (invalid.length) { announce(''); invalid[0].focus(); return; }
    const body = message();
    if (event.submitter?.value === 'email' && content.profile.email) {
      const subject = `${copy().subject} — ${form.elements.name.value.trim()}`;
      location.href = `mailto:${encodeURIComponent(content.profile.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      announce('mailOpened');
      return;
    }
    busy = true;
    try {
      await navigator.clipboard.writeText(body);
      if (!signal.aborted) { prepared.hidden = true; announce('copied'); }
    } catch {
      if (!signal.aborted) {
        draft.value = body;
        prepared.hidden = false;
        announce('copyFailed');
        draft.focus();
        draft.select();
      }
    } finally { busy = false; }
  }, { signal });
  document.addEventListener('portfolio:language', () => {
    if (attempted) fields.forEach(validate);
    if (!prepared.hidden) draft.value = message();
    announce(statusKey);
  }, { signal });
}
