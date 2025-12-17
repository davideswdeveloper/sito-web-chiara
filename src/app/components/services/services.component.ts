import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  private intersectionObserver?: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // 🔹 Parole che ruotano nell'hero
  words = [
    { articolo: "il", parola: "benessere" },
    { articolo: "l'", parola: "equilibrio" },
    { articolo: "la", parola: "serenità" }
  ];
    currentWord = this.words[0];
    current = this.words[0];
    private index = 0;
    private intervalId?: any;
    

  // 🔹 Servizi
  services = [
    {
      title: 'Dieta Mediterranea',
      description: 'Modello alimentare basato su alimenti freschi, stagionali e naturali, per promuovere benessere, longevità e prevenire malattie croniche.'
    },
    {
      title: 'Piano Nutrizionale Personalizzato per Allattamento',
      description: 'Piani nutrizionali per favorire il benessere nel periodo post-parto, garantire energia e nutrienti.'
    },
    {
      title: 'Piano Nutrizionale Personalizzato per Sportivi',
      description: 'Strategie alimentari per migliorare performance, recupero e benessere.'
    },
    {
      title: 'Piano Nutrizionale Personalizzato per Disbiosi',
      description: 'Strategie alimentari per il riequilibrio della flora intestinale e il benessere digestivo.'
    },
    {
      title: 'Piano Nutrizionale Personalizzato per Celiaci',
      description: 'Piani alimentari per garantire il corretto apporto nutrizionale, prevenire carenze e migliorare la qualità della vita.'
    },
    {
      title: 'Analisi della Composizione Corporea',
      description: 'Misurazione dei diversi compartimenti corporei attraverso l’utilizzo del bioimpedenziometro Akern (BIA 101 BIVA PRO).'
    }
  ];
  

  // 👉 Ciclo parole
  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.intervalId = setInterval(() => {
      this.index = (this.index + 1) % this.words.length;
      this.current = this.words[this.index];
    }, 2500);
  }

  // 👉 Effetto reveal on scroll
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const revealTargets: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.feature-text h2, .feature-text p, .services-intro h2, .services-intro p, .service-card'
    );

    revealTargets.forEach((el) => el.classList.add('reveal'));

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            element.classList.add('in-view');
            this.intersectionObserver?.unobserve(element);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );

    revealTargets.forEach((el) => this.intersectionObserver?.observe(el));
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
