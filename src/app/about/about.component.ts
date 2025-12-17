import { CommonModule } from '@angular/common';
import { Component, HostListener, AfterViewInit, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import test from 'node:test';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  imports: [CommonModule, FormsModule],   // 👈 aggiungi qui

  styleUrls: ['./about.component.css'],
})



export class AboutComponent implements AfterViewInit {
  private pathLength = 3000; // deve corrispondere a stroke-dasharray

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const path: SVGPathElement | null = this.el.nativeElement.querySelector('#arrow-path');
    if (path) {
      this.pathLength = path.getTotalLength(); // misura reale del path
      path.style.strokeDasharray = `${this.pathLength}`;
      path.style.strokeDashoffset = `${this.pathLength}`;
    }
  }

  @HostListener('window:scroll', [])
onScroll(): void {
  const path: SVGPathElement | null = this.el.nativeElement.querySelector('#arrow-path');
  if (!path) return;

  const wrapper: HTMLElement | null = this.el.nativeElement.querySelector('.main-content-wrapper');
  if (!wrapper) return;

  const rect = wrapper.getBoundingClientRect();

  // anticipa l’inizio e ritarda la fine
  const start = -window.innerHeight *0.1;   // inizia quando è ancora un po’ fuori
  const end   = rect.height * 0.9;           // termina dopo che è passato oltre

  const rawProgress = (-rect.top - start) / (end - start);
  const scrollProgress = Math.min(Math.max(rawProgress, 0), 1);

  const drawLength = this.pathLength * scrollProgress;
  path.style.strokeDashoffset = `${this.pathLength - drawLength}`;
}

}
