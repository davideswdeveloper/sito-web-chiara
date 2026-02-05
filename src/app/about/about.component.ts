import { Component, HostListener, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;
  private scrollHandler?: () => void;

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
    this.setupSmoothScroll();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  /**
   * Configura le animazioni al scroll usando Intersection Observer
   */
  private setupScrollAnimations(): void {
    const options: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Aggiungi animazione specifica per alcuni elementi
          if (entry.target.classList.contains('study-card')) {
            this.animateCard(entry.target as HTMLElement);
          }
        }
      });
    }, options);

    // Osserva tutti gli elementi con animazione al scroll
    const animatedElements = this.el.nativeElement.querySelectorAll(
      '.fade-in-on-scroll, .study-card, .step-item, .text-card, .image-card, .method-image, .image-showcase, .cta-content'
    );

    animatedElements.forEach((el: Element) => {
      this.observer?.observe(el);
    });
  }

  /**
   * Animazione personalizzata per le card
   */
  private animateCard(card: HTMLElement): void {
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    card.style.transform = 'translateY(0) scale(1)';
    card.style.opacity = '1';
  }

  /**
   * Configura lo smooth scroll per i link interni
   */
  private setupSmoothScroll(): void {
    const scrollLinks = this.el.nativeElement.querySelectorAll('a[href^="#"]');

    scrollLinks.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', (e: Event) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            const offset = 100; // Offset per il header
            const targetPosition = targetElement.offsetTop - offset;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  /**
   * Gestisce il parallax effect per le sezioni
   */
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrolled = window.pageYOffset;
    const parallaxElements = this.el.nativeElement.querySelectorAll('.section-background, .section-background-alt');

    parallaxElements.forEach((el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const speed = 0.5;

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      }
    });

    // Animazione delle forme fluttuanti
    this.animateFloatingShapes(scrolled);
  }

  /**
   * Animazione delle forme fluttuanti nel hero
   */
  private animateFloatingShapes(scrollY: number): void {
    const shapes = this.el.nativeElement.querySelectorAll('.shape');
    shapes.forEach((shape: HTMLElement, index: number) => {
      const speed = (index + 1) * 0.1;
      const yPos = scrollY * speed;
      shape.style.transform = `translateY(${yPos}px)`;
    });
  }

  /**
   * Gestisce l'animazione del mouse scroll indicator
   */
  @HostListener('window:scroll', [])
  handleScrollIndicator(): void {
    const scrollIndicator = this.el.nativeElement.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      const scrolled = window.pageYOffset;
      const windowHeight = window.innerHeight;

      if (scrolled > windowHeight * 0.3) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transition = 'opacity 0.3s ease';
      } else {
        scrollIndicator.style.opacity = '1';
      }
    }
  }
}
