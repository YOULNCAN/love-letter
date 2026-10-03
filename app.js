'use strict';

// All visitor data stays in memory. Use textContent for every personalized value.
const COPY = Object.freeze({
  emptyName: '告诉我该怎么称呼你吧',
  letter: [
    '有些话，在心里放了很久，还是想认真告诉你。',
    '我喜欢你。想到你的时候，平凡的一天也会多一点期待。也许这些文字有些笨拙，但这份心意是真的。',
    '我想更了解你，也希望有机会，让你慢慢了解我。如果你也愿意，我们可以从一次聊天、一次散步开始，让故事慢慢发生。',
    '你愿意给我们一个开始的机会吗？',
    '不用急着回答。无论你的答案是什么，谢谢你读完这封信，也谢谢你听见我的心意。'
  ],
  accept: '好开心，我的心意收到了你的回应。接下来，让我们慢慢了解彼此，把今天变成一个温柔的开始。去聊天里告诉我吧，我会很期待。',
  consider: '没关系，你可以慢慢想，不需要现在给我答案。谢谢你认真读完这封信，我会尊重你的感受和选择。'
});
const $ = (id) => document.getElementById(id);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let opening = false;
let celebrationTimer;

function showStage(current, next, focusTarget) {
  $(current).hidden = true;
  $(next).hidden = false;
  window.scrollTo({ top: 0, behavior: 'instant' });
  $(focusTarget).focus({ preventScroll: true });
}

// Do not let browser-restored form values survive a refresh or back navigation.
$('name-form').reset();
window.addEventListener('pageshow', (event) => {
  if (event.persisted) window.location.reload();
});
$('name').addEventListener('input', () => {
  $('name-error').textContent = '';
  $('name').removeAttribute('aria-invalid');
});
$('name-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = $('name').value.trim();
  if (!name) {
    $('name-error').textContent = COPY.emptyName;
    $('name').setAttribute('aria-invalid', 'true');
    $('name').focus();
    return;
  }
  $('recipient-name').textContent = name;
  $('letter-name').textContent = name;
  $('letter-body').replaceChildren(...COPY.letter.map((text) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  }));
  $('name-form').reset();
  showStage('entry', 'envelope-stage', 'envelope-title');
});

function openLetter() {
  if (opening) return;
  opening = true;
  $('envelope').classList.add('opening');
  $('envelope').disabled = true;
  $('open-letter').disabled = true;
  window.setTimeout(() => showStage('envelope-stage', 'letter-stage', 'letter-title'), reducedMotion.matches ? 0 : 800);
}
$('envelope').addEventListener('click', openLetter);
$('open-letter').addEventListener('click', openLetter);

function respond(choice) {
  window.clearTimeout(celebrationTimer);
  $('celebration').replaceChildren();
  $('response').textContent = COPY[choice];
  $('response').hidden = false;
  if (choice === 'accept' && !reducedMotion.matches) {
    for (let i = 0; i < 18; i += 1) {
      const heart = document.createElement('span');
      heart.className = 'confetti';
      heart.textContent = i % 2 ? '♡' : '♥';
      heart.style.left = `${Math.random() * 94 + 3}%`;
      heart.style.animationDelay = `${Math.random() * .4}s`;
      $('celebration').append(heart);
    }
    celebrationTimer = window.setTimeout(() => $('celebration').replaceChildren(), 3100);
  }
  $('response').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'nearest' });
}
$('accept').addEventListener('click', () => respond('accept'));
$('consider').addEventListener('click', () => respond('consider'));
