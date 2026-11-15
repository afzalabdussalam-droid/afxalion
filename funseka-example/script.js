const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '☰';
}));

const enquiryForm = document.querySelector('#enquiry-form');
const enquiryPhone = document.querySelector('#enquiry-phone');
const enquiryStatus = document.querySelector('#enquiry-status');
const phoneCountryPicker = window.intlTelInput?.(enquiryPhone, {
  initialCountry: 'ng',
  separateDialCode: true,
  countrySearch: true,
  nationalMode: true,
  formatAsYouType: false,
  formatOnDisplay: false,
  autoPlaceholder: 'off'
});
enquiryPhone.addEventListener('input', () => {
  enquiryPhone.value = enquiryPhone.value.replace(/\D/g, '').slice(0, 15);
});
enquiryForm.addEventListener('submit', event => {
  event.preventDefault();
  enquiryStatus.hidden = false;
  enquiryStatus.textContent = '';
  if (!enquiryForm.reportValidity()) {
    enquiryStatus.textContent = 'Please complete the required fields above before continuing.';
    enquiryForm.querySelector(':invalid')?.focus();
    return;
  }
  const details = new FormData(enquiryForm);
  const nationalNumber = String(details.get('phone')).replace(/\D/g, '').replace(/^0+/, '');
  const selectedCountry = phoneCountryPicker?.getSelectedCountryData?.();
  const countryCode = selectedCountry?.dialCode || '234';
  const phone = `+${countryCode}${nationalNumber}`;
  const message = [
    'Hi Funseka, I would like to make an enquiry.',
    '',
    `Name: ${String(details.get('name')).trim()}`,
    `Phone: ${phone}`,
    `Service: ${String(details.get('service')).trim()}`,
    `Message: ${String(details.get('message')).trim()}`
  ].join('\n');
  const whatsappUrl = new URL('https://wa.me/2348067087342');
  whatsappUrl.searchParams.set('text', message);
  enquiryStatus.textContent = 'Opening WhatsApp with your enquiry…';
  const whatsappWindow = window.open(whatsappUrl.href, '_blank');
  if (whatsappWindow) whatsappWindow.opener = null;
  else window.location.assign(whatsappUrl.href);
});

const pageLoader = document.querySelector('#page-loader');
window.setTimeout(() => {
  pageLoader.classList.add('is-hidden');
  window.setTimeout(() => pageLoader.remove(), 500);
}, 1450);
