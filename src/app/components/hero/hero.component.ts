import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements AfterViewInit {
  title = 'Benvenuto!';
  subtitle = 'Scopri i nostri piatti salutari';

  @ViewChild('lettuce') lettuce!: ElementRef;
  @ViewChild('tomato') tomato!: ElementRef;
  @ViewChild('avocado') avocado!: ElementRef;

  ngAfterViewInit() {
    if (typeof window !== 'undefined') { // Solo lato client
      if (this.lettuce) {
        gsap.to(this.lettuce.nativeElement, { opacity: 1, y: -10, duration: 0.8, delay: 0.5 });
      }
      if (this.tomato) {
        gsap.to(this.tomato.nativeElement, { opacity: 1, y: -10, duration: 0.8, delay: 1 });
      }
      if (this.avocado) {
        gsap.to(this.avocado.nativeElement, { opacity: 1, y: -10, duration: 0.8, delay: 1.5 });
      }
    }
  }
}