import { Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './legal/privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './legal/cookie-policy/cookie-policy.component';
import { ReceiptsComponent } from './components/receipts/receipts.component';
import { ServicesComponent } from './components/services/services.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { RicettarioComponent } from './components/ricettario/ricettario.component';
import { DbComponent } from './components/db/db.component';
import { ContattiComponent } from './components/contatti/contatti.component';

export const routes: Routes = [
    { path: 'servizi', component: ServicesComponent, title: 'Servizi Dermatologici | Dott.ssa Chiara Del Re' },
    { path: 'ricette', component: RicettarioComponent, title: 'Ricette e Consigli per la Pelle | Dott.ssa Chiara Del Re' },
    { path: '', component: DashboardComponent, title: 'Dott.ssa Chiara Del Re - Dermatologa e Venereologa' },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    { path: 'chi-sono', component: AboutComponent, title: 'Chi Sono | Dott.ssa Chiara Del Re Dermatologa' },
    { path: 'contatti', component: ContattiComponent, title: 'Contatti e Studi Medici | Dott.ssa Chiara Del Re' },
    { path: 'db', component: DbComponent, title: 'Database | Dott.ssa Chiara Del Re' },
    { path: 'privacy-policy', component: PrivacyPolicyComponent, title: 'Privacy Policy | Dott.ssa Chiara Del Re' },
    { path: 'cookie-policy', component: CookiePolicyComponent, title: 'Cookie Policy | Dott.ssa Chiara Del Re' }

];
