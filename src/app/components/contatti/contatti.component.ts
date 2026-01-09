import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
      address: 'Viale Aldo Moro 1',
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

  prenotaVisita() {
    window.open('https://www.miodottore.it/chiara-del-re-2/dermatologo', '_blank');
  }
  
  scriviWhatsApp() {
    const phone = '393793162089';
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
