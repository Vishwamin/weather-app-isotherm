'use client';

import { Linkedin, Github, Mail } from 'lucide-react';

export default function AboutPMA() {
  return (
    <footer className="mt-16 border-t border-slate-border pt-8 pb-12">
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <p className="readout-label mb-2">Built by</p>
          <p className="font-display text-lg text-paper">Vishwamin Patha</p>
          <p className="text-sm text-mist/70 mt-1">
          </p>
          <div className="flex gap-4 mt-3">
            <a
              href="https://www.linkedin.com/in/vishwamin-patha"
              target="_blank"
              rel="noreferrer"
              className="text-mist/60 hover:text-glacier transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/Vishwamin"
              target="_blank"
              rel="noreferrer"
              className="text-mist/60 hover:text-glacier transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="mailto:minnupatha7@gmail.com"
              className="text-mist/60 hover:text-glacier transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div>
        </div>
      </div>
    </footer>
  );
}
