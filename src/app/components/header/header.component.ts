import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`
    .header {
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 6px 24px rgba(0,0,0,0.08);
      position: fixed;
      width: 100%;
      top: 0;
      z-index: 1000;
    }

    .main-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo h1 {
      font-size: 1.5rem;
      color: #4CAF50;
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 1.25rem;
      align-items: center;
    }

    .nav-links a {
      text-decoration: none;
      color: #2F3138;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .nav-links a:hover {
      color: #2a7a2a;
    }

    .cta-button {
      background: linear-gradient(135deg, #4CAF50, #8BC34A);
      color: white;
      padding: 0.6rem 1rem;
      border-radius: 999px;
      text-decoration: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 8px 20px rgba(76, 175, 80, 0.25);
    }

    .cta-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(76, 175, 80, 0.35);
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .mobile-menu-btn span {
      display: block;
      width: 25px;
      height: 3px;
      background-color: #333;
      margin: 5px 0;
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: block;
      }

      .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: linear-gradient(180deg, #5e8c77, #6d9b86);
        color: #fff;
        padding: 2rem 1rem 3rem;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      }

      .nav-links.active {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
      }

      .nav-links li {
        margin: 1rem 0;
      }

      .nav-links a { color: #fff; }
      .cta-button { background: #4CAF50; box-shadow: none; }
    }

    .menu-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.35);
      z-index: 999;
    }
  `]
})
export class HeaderComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
} 