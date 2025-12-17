import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contatti',
  standalone: true,
  imports: [CommonModule],   // 👈 aggiungi qui
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css']
})
export class ContattiComponent {

  prenotaVisita() {
    window.open('https://www.miodottore.it/maria-pia-raso/nutrizionista/roma', '_blank');
  }


  formData = {
    name: '',
    email: '',
    message: ''
  };
  
  scriviWhatsApp() {
    const phone = '393295840904';
    const nome = this.formData.name;
    const email = this.formData.email ? ` Email: ${this.formData.email}.` : '';
    const messaggio = this.formData.message || '';
    if(this.formData.name){
      const testo = `Ciao, sono ${nome}. Ti contatto per: ${messaggio}.${email}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(testo)}`, '_blank');
    }else{
    const testo = `Ciao! Ti contatto per: ${messaggio}.${email}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(testo)}`, '_blank');
  }
  }
  
  
    
  

  portamiQui(sede: string) {
    if (sede === 'online') {
      // Per le consulenze online, apri il link di prenotazione
      window.open('https://www.miodottore.it/maria-pia-raso/nutrizionista/roma', '_blank');
    } else {
      // Per le sedi fisiche, apri Google Maps con l'indirizzo
      const encodedAddress = encodeURIComponent(sede);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(googleMapsUrl, '_blank');
    }
  }
}
