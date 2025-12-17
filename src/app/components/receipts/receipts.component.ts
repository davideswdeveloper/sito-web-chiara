import {
  Component,
  ElementRef,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  Renderer2,
  Input
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.css']
})
export class ReceiptsComponent implements AfterViewInit {
  @Input() disableInternalAnimation: boolean = false;

  constructor(
    private renderer: Renderer2,
    private host: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Se l'animazione interna è disabilitata, non inizializzare
    if (this.disableInternalAnimation) return;
    
    setTimeout(() => {
      this.initPlateRevealAnimation();
      ScrollTrigger.refresh();
      setTimeout(() => ScrollTrigger.refresh(), 200);
    }, 0);
  }

  private initPlateScrollAnimation(): void {
    const plateContent = this.host.nativeElement.querySelector('.plate-content');
    const labelVerdure = this.host.nativeElement.querySelector('.label-verdure');
    const labelCarboidrati = this.host.nativeElement.querySelector('.label-carboidrati');
    const labelGrassi = this.host.nativeElement.querySelector('.label-grassi');
    const labelProteine = this.host.nativeElement.querySelector('.label-proteine');

    // Nascondi tutte le etichette all'inizio
    [labelVerdure, labelCarboidrati, labelGrassi, labelProteine].forEach(label => {
      if (label) this.renderer.setStyle(label, 'opacity', '0');
    });

    // Variabili per le percentuali degli spicchi
    const sections = [
      { color: '#51cf66', label: labelVerdure, end: 0.25 },      // Verdure: 0% - 50%
      { color: '#ffd43b', label: labelCarboidrati, end: 0.50 }, // Carboidrati: 50% - 75%
      { color: '#ff922b', label: labelGrassi, end: 0.75 },     // Grassi: 75% - 87.5%
      { color: '#ff6b6b', label: labelProteine, end: 1.0 }      // Proteine: 87.5% - 100%
    ];

    // Variabili animate
    const progress = { value: 0 };

    gsap.to(progress, {
      value: 1,
      scrollTrigger: {
        trigger: plateContent,
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      },
      onUpdate: () => {
        // Calcola i limiti degli spicchi in base al progresso
        let gradient = '';
        let lastEnd = 0;
        sections.forEach((section, i) => {
          let sectionEnd = Math.min(progress.value, section.end);
          if (sectionEnd > lastEnd) {
            let startDeg = lastEnd * 360;
            let endDeg = sectionEnd * 360;
            gradient += `${section.color} ${startDeg}deg ${endDeg}deg, `;
            // Mostra l'etichetta solo se la fetta è visibile
            if (section.label) {
              this.renderer.setStyle(section.label, 'opacity', sectionEnd > lastEnd ? '1' : '0');
            }
          } else {
            if (section.label) {
              this.renderer.setStyle(section.label, 'opacity', '0');
            }
          }
          lastEnd = sectionEnd;
        });
        gradient += 'transparent ' + (lastEnd * 360) + 'deg 360deg';
        this.renderer.setStyle(plateContent, 'background', `conic-gradient(${gradient})`);
      }
    });
  }

  private initPlateRevealAnimation(): void {
    const plateFull = this.host.nativeElement.querySelector('.plate-full');
    const labelVerdure = this.host.nativeElement.querySelector('.label-verdure');
    const labelCarboidrati = this.host.nativeElement.querySelector('.label-carboidrati');
    const labelGrassi = this.host.nativeElement.querySelector('.label-grassi');
    const labelProteine = this.host.nativeElement.querySelector('.label-proteine');
    if (!plateFull) return;

    const progress = { value: 0 };
    const updateMask = () => {
      let step = 0;
      if (progress.value >= 0.8) step = 4;
      else if (progress.value >= 0.6) step = 3;
      else if (progress.value >= 0.4) step = 2;
      else if (progress.value >= 0.2) step = 1;
      else step = 0;
      const endDeg = step * 90;
      const mask = `conic-gradient(#000 0deg ${endDeg}deg, transparent ${endDeg}deg 360deg)`;
      plateFull.style.webkitMaskImage = mask;
      plateFull.style.maskImage = mask;
      if (labelVerdure) labelVerdure.style.opacity = progress.value >= 0.2 ? '1' : '0';
      if (labelCarboidrati) labelCarboidrati.style.opacity = progress.value >= 0.4 ? '1' : '0';
      if (labelGrassi) labelGrassi.style.opacity = progress.value >= 0.6 ? '1' : '0';
      if (labelProteine) labelProteine.style.opacity = progress.value >= 0.8 ? '1' : '0';
    };
    gsap.to(progress, {
      value: 1,
      scrollTrigger: {
        trigger: plateFull,
        start: 'top 80%',
        end: 'bottom+=600 top',
        scrub: 1,
        markers: false
      },
      onUpdate: updateMask
    });
    // Aggiorna la maschera anche subito all'avvio
    updateMask();
  }
}
