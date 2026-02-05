import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Location {
  name: string;
  address: string;
  city: string;
}

@Component({
  selector: 'app-contatti',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css']
})
export class ContattiComponent {

  locations: Location[] = [
    {
      name: 'Studio NG Derma',
      address: 'Via Piave 58',
      city: 'Palmi'
    },
    {
      name: 'DermaClinic',
      address: 'Via II Settembre 22',
      city: 'Reggio Calabria'
    },
    {
      name: 'Medipol',
      address: 'Viale Aldo Moro snc',
      city: 'Falerna'
    },
    {
      name: 'Studio Medico Ciambrone',
      address: 'Via Palermo 4',
      city: 'Caraffa di Catanzaro'
    }
  ];

  formData = {
    name: '',
    email: '',
    message: ''
  };

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  prenotaVisita() {
    window.open('https://www.miodottore.it/chiara-del-re-2/dermatologo', '_blank');
  }

  scriviWhatsApp() {
    // Checkbox specifico per il bottone WhatsApp
    const privacyCheckbox = this.document.querySelector<HTMLInputElement>('#privacy-policy-whatsapp');

    if (!privacyCheckbox?.checked) {
      alert('Devi accettare la Privacy Policy per scrivere su WhatsApp!');
      return;
    }

    const phone = '393793162089';
    const nome = this.formData.name || 'Paziente';
    const email = this.formData.email ? ` Email: ${this.formData.email}.` : '';
    const messaggio = this.formData.message || 'Vorrei richiedere informazioni.';

    if (this.formData.name || this.formData.message) {
      const testo = `Ciao, sono ${nome}. Ti contatto per: ${messaggio}.${email}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(testo)}`, '_blank');
    } else {
      const testo = `Ciao! Vorrei richiedere informazioni.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(testo)}`, '_blank');
    }
  }

  portamiQui(address: string) {
    const location = this.locations.find(l => l.address === address);
    if (location) {
      const fullAddress = `${location.address}, ${location.city}`;
      const encodedAddress = encodeURIComponent(fullAddress);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(googleMapsUrl, '_blank');
    }
  }
}
