import { useState } from 'react';


export default function LanguageToggle() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('cms_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  function choose(next) {
    setLang(next);
    document.documentElement.lang = next;
    try {
      localStorage.setItem('cms_lang', next);
    } catch {
      /* ignore */
    }
  }

  const base = 'flex h-10 w-10 items-center justify-center rounded-full text-[15px] transition-colors';
  return (
    <div role="group" aria-label="Language" className="hidden items-center rounded-full border border-line p-1 sm:flex">
      <button
        type="button"
        onClick={() => choose('en')}
        aria-pressed={lang === 'en'}
        className={`${base} ${lang === 'en' ? 'bg-brand text-white' : 'text-muted'}`}
      >
        En
      </button>
      <button
        type="button"
        onClick={() => choose('ar')}
        aria-pressed={lang === 'ar'}
        aria-label="Arabic"
        className={`${base} ${lang === 'ar' ? 'bg-brand text-white' : 'text-muted'}`}
      >
        ع
      </button>
    </div>
  );
}
