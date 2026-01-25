import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { HeroComponent } from '../components/hero/hero.component';
import { ReceiptsComponent } from '../components/receipts/receipts.component';
import { ServicesComponent } from '../components/services/services.component';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FormsModule } from '@angular/forms';
import { filter, take } from 'rxjs';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ ReceiptsComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements AfterViewInit {
  @ViewChild(ReceiptsComponent) receiptsComponent!: ReceiptsComponent;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // Evita di eseguire codice DOM su server
      return;
    }

    setTimeout(() => {
      this.initScrollyAnimation();
      this.initMetodoScrollyAnimation();
      this.initVisiteScrollyAnimation();
      this.initVisitaFlowVisual();
      this.initRevealOnScroll();
      this.initHeroAnimation();
    }, 100);
  }

  private initScrollyAnimation(): void {
    const steps = this.document.querySelectorAll('.step');
    const plateFull = this.document.querySelector('.plate-full');
    const labelVerdure = this.document.querySelector('.label-verdure');
    const labelCarboidrati = this.document.querySelector('.label-carboidrati');
    const labelGrassi = this.document.querySelector('.label-grassi');
    const labelProteine = this.document.querySelector('.label-proteine');

    if (!plateFull) return;

    // Funzione per aggiornare l'animazione del piatto
    const updatePlateAnimation = (stepNumber: number) => {
      // Mappa degli step: 1=Base, 2=Carboidrati, 3=Proteine, 4=Verdure, 5=Completo
      let endDeg = 0;
      
      switch(stepNumber) {
        case 1: // Base di partenza
          endDeg = 0;
          break;
        case 2: // Carboidrati
          endDeg = 90;
          break;
        case 3: // Proteine
          endDeg = 180;
          break;
        case 4: // Verdure
          endDeg = 270;
          break;
        case 5: // Piatto completo
          endDeg = 360;
          break;
        default:
          endDeg = 0;
      }

      const mask = `conic-gradient(#000 0deg ${endDeg}deg, transparent ${endDeg}deg 360deg)`;
      (plateFull as HTMLElement).style.webkitMaskImage = mask;
      (plateFull as HTMLElement).style.maskImage = mask;

      // Mostra/nascondi le etichette in base allo step
      if (labelVerdure) (labelVerdure as HTMLElement).style.opacity = stepNumber >= 4 ? '1' : '0';
      if (labelCarboidrati) (labelCarboidrati as HTMLElement).style.opacity = stepNumber >= 2 ? '1' : '0';
      if (labelGrassi) (labelGrassi as HTMLElement).style.opacity = stepNumber >= 5 ? '1' : '0';
      if (labelProteine) (labelProteine as HTMLElement).style.opacity = stepNumber >= 3 ? '1' : '0';
    };

    // Configura l'Intersection Observer per ogni step
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Si attiva quando il 60% centrale è visibile
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepNumber = parseInt(entry.target.getAttribute('data-step') || '1');
          updatePlateAnimation(stepNumber);
        }
      });
    }, observerOptions);

    // Attacca l'observer a ogni step di testo
    steps.forEach(step => observer.observe(step));

    // Inizializza l'animazione
    updatePlateAnimation(1);
  }


  
formData = {
  name: '',
  email: '',
  message: ''
};

scriviWhatsApp() {
  // Seleziona la checkbox dal DOM
  const privacyCheckbox = document.querySelector<HTMLInputElement>('input[name="privacy"]');

  if (!privacyCheckbox?.checked) {
    alert('Devi accettare la Privacy Policy per scrivere su WhatsApp!');
    return; // blocca la funzione
  }

  // Leggi anche gli altri valori
  const nameInput = document.querySelector<HTMLInputElement>('input[name="name"]');
  const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]');
  const messageInput = document.querySelector<HTMLTextAreaElement>('textarea[name="message"]');

  const nome = nameInput?.value || 'Anonimo';
  const email = emailInput?.value ? ` Email: ${emailInput.value}.` : '';
  const messaggio = messageInput?.value || '';

  const testo = `Ciao, sono ${nome}. Ti contatto per: ${messaggio}.${email}`;
  const phone = '393295840904';
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(testo)}`, '_blank');
}


apriRecensioni(){
  window.open(`https://www.miodottore.it/chiara-del-re-2/dermatologo/palmi#profile-reviews`, '_blank');

}

  

onSubmit(event: Event) {
  event.preventDefault(); // evita il reload della pagina
  console.log('Dati salvati:', this.formData);
  localStorage.setItem('contatto', JSON.stringify(this.formData));
}

  private initVisiteScrollyAnimation(): void {
    const visiteSteps = Array.from(this.document.querySelectorAll<HTMLElement>('.visite-step'));

    if (visiteSteps.length === 0) {
      return;
    }

    const setActive = (activeStep: HTMLElement) => {
      visiteSteps.forEach(step => {
        if (step === activeStep) {
          step.classList.add('is-active');
        } else {
          step.classList.remove('is-active');
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-35% 0px -45% 0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const step = entry.target as HTMLElement;
          setActive(step);
        }
      });
    }, observerOptions);

    visiteSteps.forEach(step => observer.observe(step));

    // Stato iniziale
    setActive(visiteSteps[0]);
  }

  private initVisitaFlowVisual(): void {
    const section = this.document.getElementById('visita-flow-visual');
    const stepCards = Array.from(this.document.querySelectorAll<HTMLElement>('.flow-step-card'));
    const images = Array.from(this.document.querySelectorAll<HTMLElement>('.visita-flow-main-image'));
    const clouds = Array.from(this.document.querySelectorAll<HTMLElement>('.visita-flow-cloud'));
    const progressDots = Array.from(this.document.querySelectorAll<HTMLElement>('.progress-dot'));

    console.log('🔍 Inizializzazione Flow Visual:', {
      section: section ? 'trovata' : 'NON trovata',
      stepCards: stepCards.length,
      images: images.length,
      progressDots: progressDots.length
    });

    if (!section || stepCards.length === 0 || images.length === 0) {
      console.log('❌ Flow Visual NON inizializzato - elementi mancanti');
      return;
    }

    console.log('✅ Flow Visual inizializzato correttamente');

    const setVisualState = (stepNumber: number) => {
      // attiva le card fino allo step corrente
      stepCards.forEach(card => {
        const cardStep = parseInt(card.dataset['flowStep'] || card.getAttribute('data-flow-step') || '0', 10);
        if (cardStep <= stepNumber) {
          card.classList.add('is-visible');
        } else {
          card.classList.remove('is-visible');
        }
      });

      images.forEach(img => {
        const imgStep = parseInt(img.dataset['flowStep'] || img.getAttribute('data-flow-step') || '0', 10);
        if (imgStep === stepNumber) {
          img.classList.add('is-active');
        } else {
          img.classList.remove('is-active');
        }
      });

      clouds.forEach(cloud => {
        const cloudStep = parseInt(cloud.dataset['cloudStep'] || cloud.getAttribute('data-cloud-step') || '0', 10);
        if (cloudStep <= stepNumber) {
          cloud.classList.add('is-visible');
        } else {
          cloud.classList.remove('is-visible');
        }
      });

      // Aggiorna i progress dots
      progressDots.forEach(dot => {
        const dotStep = parseInt(dot.dataset['step'] || dot.getAttribute('data-step') || '0', 10);
        if (dotStep === stepNumber) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });
    };

    const onScroll = () => {
      const sectionEl = section as HTMLElement;
      const sectionTop = sectionEl.offsetTop;
      const sectionHeight = sectionEl.offsetHeight;
      const viewportHeight = window.innerHeight || 1;
      const scrollY = window.scrollY || window.pageYOffset || 0;

      const start = sectionTop;
      const end = sectionTop + sectionHeight - viewportHeight;
      const maxScroll = Math.max(end - start, 1);
      const clamped = Math.min(Math.max(scrollY - start, 0), maxScroll);
      const progress = clamped / maxScroll;

      let stepNumber = 1;
      if (progress > 0.75) {
        stepNumber = 4;
      } else if (progress > 0.5) {
        stepNumber = 3;
      } else if (progress > 0.25) {
        stepNumber = 2;
      } else {
        stepNumber = 1;
      }

      console.log('📊 Scroll Progress:', { progress: progress.toFixed(2), stepNumber, scrollY, sectionTop, sectionHeight });

      setVisualState(stepNumber);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Stato iniziale - imposta subito lo step 1
    setTimeout(() => {
      setVisualState(1);
      onScroll();
    }, 100);
  }

  private initMetodoScrollyAnimation(): void {
    const metodoSteps = this.document.querySelectorAll('.metodo-step');
    const metodoStepTexts = this.document.querySelectorAll('.metodo-step-text');
    const metodoBgImages = this.document.querySelectorAll('.metodo-bg-image');
    
    if (metodoSteps.length === 0) return;

    // Funzione per aggiornare gli step attivi
    const updateMetodoSteps = (stepNumber: number) => {
      // Nascondi tutti gli step
      metodoSteps.forEach((step, index) => {
        if (index === stepNumber) {
          step.classList.add('is-active');
        } else {
          step.classList.remove('is-active');
        }
      });
      
      // Nascondi tutte le immagini di sfondo
      metodoBgImages.forEach((image, index) => {
        if (index === stepNumber) {
          image.classList.add('is-active');
        } else {
          image.classList.remove('is-active');
        }
      });
    };

    // Configura l'Intersection Observer per ogni step di testo
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Si attiva quando il 60% centrale è visibile
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepNumber = parseInt(entry.target.getAttribute('data-step') || '0');
          updateMetodoSteps(stepNumber);
        }
      });
    }, observerOptions);

    // Attacca l'observer a ogni step di testo
    metodoStepTexts.forEach(step => observer.observe(step));

    // Inizializza l'animazione
    updateMetodoSteps(0);
  }

  private initRevealOnScroll(): void {
    const revealables = Array.from(this.document.querySelectorAll<HTMLElement>('.reveal-on-scroll'));
    if (revealables.length === 0) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          const delayValue = el.dataset['delay'];
          const delay = delayValue ? parseFloat(delayValue) : 0;
          if (delay) {
            el.style.transitionDelay = `${delay}s`;
          }
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    revealables.forEach(el => io.observe(el));
  }

  private initHeroAnimation(): void {
    const hero = this.document.querySelector('.home-hero__content');
    if (hero) {
      (hero as HTMLElement).classList.add('is-visible');
    }
  }

  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const element = this.document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToSectionPage(sectionId: string, targetPage: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Naviga alla pagina desiderata
    this.router.navigate([targetPage]).then(() => {
      console.log('navigazione completata');
      setTimeout(() => {
        const element = this.document.getElementById(sectionId);
        console.log(element);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // leggero delay per assicurarsi che il DOM sia pronto
    });
  }
}
