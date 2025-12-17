import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
};

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css']
})
export class CookieConsentComponent implements OnInit {
  isVisible = false;
  preferences: CookiePreferences = { necessary: true, analytics: false };

  private storageKey = 'cookie_preferences_v1';

  ngOnInit(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.preferences = JSON.parse(saved);
        this.applyPreferences();
        this.isVisible = false;
      } catch {
        this.isVisible = true;
      }
    } else {
      this.isVisible = true;
    }

    window.addEventListener('open-cookie-consent', () => {
      this.isVisible = true;
    });
  }

  acceptAll(): void {
    this.preferences = { necessary: true, analytics: true };
    this.savePreferences();
  }

  rejectAll(): void {
    this.preferences = { necessary: true, analytics: false };
    this.savePreferences();
  }

  savePreferences(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
    this.applyPreferences();
    this.isVisible = false;
  }

  private applyPreferences(): void {
    const analyticsAllowed = this.preferences.analytics;
    const eventName = analyticsAllowed ? 'enable-analytics' : 'disable-analytics';
    window.dispatchEvent(new CustomEvent(eventName));
  }
}


