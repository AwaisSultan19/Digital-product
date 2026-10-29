/* ========================================
   BREVONO — Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const nav = document.querySelector('.nav');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    const answerId = answer.id || `faq-answer-${index + 1}`;
    answer.id = answerId;
    question.setAttribute('type', 'button');
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('aria-controls', answerId);

    const setOpen = (open) => {
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherQuestion = otherItem.querySelector('.faq-question');
        if (otherQuestion) {
          otherQuestion.setAttribute('aria-expanded', 'false');
        }
      });

      if (open) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    };

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      setOpen(!isActive);
    });

    question.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const isActive = item.classList.contains('active');
        setOpen(!isActive);
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target && nav) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  if (nav) {
    const updateNav = () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 12);
    };

    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  const pdfModal = document.getElementById('pdfPreviewModal');
  const pdfFrame = pdfModal?.querySelector('.pdf-modal__frame');
  let pdfTrigger = null;

  const closePdfPreview = () => {
    if (!pdfModal || !pdfFrame) return;

    pdfModal.hidden = true;
    pdfFrame.src = 'about:blank';
    document.body.style.overflow = '';

    if (pdfTrigger && typeof pdfTrigger.focus === 'function') {
      pdfTrigger.focus();
    }
    pdfTrigger = null;
  };

  const openPdfPreview = (trigger) => {
    if (!pdfModal || !pdfFrame) return;

    const src = trigger.getAttribute('data-pdf-src');
    if (!src) return;

    pdfTrigger = trigger;
    pdfFrame.src = `${src}#view=FitH`;
    pdfModal.hidden = false;
    document.body.style.overflow = 'hidden';

    const closeButton = pdfModal.querySelector('.pdf-modal__close');
    closeButton?.focus();
  };

  document.querySelectorAll('.js-open-pdf-preview').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openPdfPreview(trigger);
    });
  });

  pdfModal?.querySelectorAll('[data-close-pdf]').forEach((el) => {
    el.addEventListener('click', closePdfPreview);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && pdfModal && !pdfModal.hidden) {
      closePdfPreview();
    }
  });
});
