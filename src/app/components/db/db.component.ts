import { Component } from '@angular/core';
import { Recipe, Ingredient, Step } from '../../recipe.model';
import { RecipseService } from '../../recipse.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-db',
  imports: [CommonModule, FormsModule],
  templateUrl: './db.component.html',
  styleUrl: './db.component.css'
})
export class DbComponent {

  recipes: Recipe[] = [];
  editingRecipe: Recipe | null = null;
  isEditing = false;
  isCreating = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Form per nuova ricetta
  newRecipe: Recipe = {
    id: '',
    title: '',
    subtitle: '',
    cooking_time: '',
    serving: '',
    main_image: '',
    video_url: '',
    ingredients: [],
    steps: []
  };

  // Ingredienti e step temporanei per il form
  newIngredient: Ingredient = { name: '', quantity: '' };
  newStep: Step = { step: '', title: '', description: '' };

  // Variabili separate per il form di modifica
  editIngredient: Ingredient = { name: '', quantity: '' };
  editStep: Step = { step: '', title: '', description: '' };

  constructor(private recipesService: RecipseService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  // Input in blocco
  bulkIngredients: string = '';
  bulkSteps: string = '';

  // Video: toggle URL / upload
  useVideoUpload: boolean = false;
  videoFile: File | null = null;
  // Image: toggle URL / upload
  useImageUpload: boolean = false;
  imageFile: File | null = null;

  onVideoToggleChange() {
    if (!this.useVideoUpload) {
      this.videoFile = null;
    }
  }

  onVideoFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.videoFile = input.files[0];
    }
  }

  onImageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  // Parser per ingredienti incollati (ignora numerazioni tipo "1.")
  private parseBulkIngredients(text: string): Ingredient[] {
    return text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => line.replace(/^\d+[\).\-\s]+/, ''))
      .map(line => {
        // prova split su trattino o virgola per separare quantità, altrimenti tutto come nome
        const commaIdx = line.indexOf(',');
        if (commaIdx > -1) {
          return { name: line.slice(0, commaIdx).trim(), quantity: line.slice(commaIdx + 1).trim() } as Ingredient;
        }
        return { name: line, quantity: '' } as Ingredient;
      });
  }

  // Parser per passi incollati (numerati 1., 2), ...)
  private parseBulkSteps(text: string): Step[] {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const steps: Step[] = [];
    for (const line of lines) {
      const cleaned = line.replace(/^\d+[\).\-\s]+/, '');
      const capitalized = this.capitalizeFirst(cleaned);
      const index = steps.length + 1;
      steps.push({ step: String(index), title: `Passo ${index}`, description: capitalized });
    }
    return steps;
  }

  private capitalizeFirst(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  applyBulkIngredients() {
    const parsed = this.parseBulkIngredients(this.bulkIngredients);
    this.newRecipe.ingredients = [...this.newRecipe.ingredients, ...parsed];
    this.bulkIngredients = '';
  }

  applyBulkSteps() {
    const parsed = this.parseBulkSteps(this.bulkSteps);
    this.newRecipe.steps = [...this.newRecipe.steps, ...parsed].map((s, i) => ({ ...s, step: String(i + 1) }));
    this.bulkSteps = '';
  }

  // ===================== EDIT FORM (bulk + video) =====================
  editBulkIngredients: string = '';
  editBulkSteps: string = '';
  editUseVideoUpload: boolean = false;
  editVideoFile: File | null = null;
  editUseImageUpload: boolean = false;
  editImageFile: File | null = null;

  editOnVideoToggleChange() {
    if (!this.editUseVideoUpload) {
      this.editVideoFile = null;
    }
  }

  editOnVideoFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.editVideoFile = input.files[0];
    }
  }

  editOnImageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.editImageFile = input.files[0];
    }
  }

  applyEditBulkIngredients() {
    if (!this.editingRecipe) return;
    const parsed = this.parseBulkIngredients(this.editBulkIngredients);
    this.editingRecipe.ingredients = [...this.editingRecipe.ingredients, ...parsed];
    this.editBulkIngredients = '';
  }

  applyEditBulkSteps() {
    if (!this.editingRecipe) return;
    const parsed = this.parseBulkSteps(this.editBulkSteps);
    this.editingRecipe.steps = [...this.editingRecipe.steps, ...parsed].map((s, i) => ({ ...s, step: String(i + 1) }));
    this.editBulkSteps = '';
  }

  loadRecipes() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.recipesService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore caricamento ricette', err);
        this.errorMessage = 'Errore nel caricamento delle ricette: ' + err.message;
        this.isLoading = false;
      },
    });
  }

  deleteRecipe(id: string) {
    if (confirm('Sei sicuro di voler eliminare questa ricetta?')) {
      this.isLoading = true;
      this.errorMessage = '';
      // Find recipe to delete to know its media
      const recipeToDelete = this.recipes.find(r => r.id === id) || null;
      const mediaTasks: Promise<void>[] = [];
      if (recipeToDelete) {
        if (recipeToDelete.main_image) {
          mediaTasks.push(this.recipesService.deleteAsset(recipeToDelete.main_image));
        }
        if (recipeToDelete.video_url) {
          mediaTasks.push(this.recipesService.deleteAsset(recipeToDelete.video_url));
        }
      }

      Promise.allSettled(mediaTasks).finally(() => {
        this.recipesService.deleteRecipe(id).subscribe({
          next: () => {
            this.loadRecipes();
            this.successMessage = 'Ricetta eliminata con successo!';
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (err) => {
            console.error('Errore cancellazione', err);
            this.errorMessage = 'Errore nell\'eliminazione della ricetta: ' + err.message;
            this.isLoading = false;
          },
        });
      });
    }
  }

  updateRecipe(recipe: Recipe) {
    this.isLoading = true;
    this.errorMessage = '';

    const proceed = () => {
      this.recipesService.updateRecipe(recipe.id, recipe).subscribe({
        next: (updated) => {
          console.log('Aggiornato:', updated);
          this.loadRecipes();
          this.cancelEdit();
          this.successMessage = 'Ricetta aggiornata con successo!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Errore aggiornamento', err);
          this.errorMessage = 'Errore nell\'aggiornamento della ricetta: ' + err.message;
          this.isLoading = false;
        },
      });
    };

    (async () => {
      try {
        if (this.editUseImageUpload && this.editImageFile) {
          const url = await this.recipesService.uploadImage(this.editImageFile);
          recipe.main_image = url;
        }
        if (this.editUseVideoUpload && this.editVideoFile) {
          const url = await this.recipesService.uploadVideo(this.editVideoFile);
          recipe.video_url = url;
        }
        proceed();
      } catch (err) {
        console.error('Upload file fallito (edit)', err);
        this.errorMessage = 'Upload file fallito.';
        this.isLoading = false;
      }
    })();
  }

  // Metodi per gestire l'editing
  startEdit(recipe: Recipe) {
    this.editingRecipe = { ...recipe };
    this.isEditing = true;
    this.isCreating = false;
    this.errorMessage = '';
  }

  cancelEdit() {
    this.editingRecipe = null;
    this.isEditing = false;
    this.isCreating = false;
    this.resetNewRecipe();
    this.errorMessage = '';
  }

  // Metodi per gestire la creazione
  startCreate() {
    this.isCreating = true;
    this.isEditing = false;
    this.editingRecipe = null;
    this.resetNewRecipe();
    this.errorMessage = '';
  }

  createRecipe() {
    this.isLoading = true;
    this.errorMessage = '';

    const proceed = () => {
      this.recipesService.createRecipe(this.newRecipe).subscribe({
        next: (created) => {
          console.log('Creata:', created);
          this.loadRecipes();
          this.cancelEdit();
          this.successMessage = 'Ricetta creata con successo!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Errore creazione', err);
          this.errorMessage = 'Errore nella creazione della ricetta: ' + err.message;
          this.isLoading = false;
        },
      });
    };

    (async () => {
      try {
        if (this.useImageUpload && this.imageFile) {
          const img = await this.recipesService.uploadImage(this.imageFile);
          this.newRecipe.main_image = img;
        }
        if (this.useVideoUpload && this.videoFile) {
          const vid = await this.recipesService.uploadVideo(this.videoFile);
          this.newRecipe.video_url = vid;
        }
        proceed();
      } catch (err) {
        console.error('Upload file fallito', err);
        this.errorMessage = 'Upload file fallito.';
        this.isLoading = false;
      }
    })();
  }

  // Metodi per gestire ingredienti e step
  addIngredient() {
    if (this.isEditing && this.editingRecipe) {
      if (this.editIngredient.name && this.editIngredient.quantity) {
        this.editingRecipe.ingredients.push({ ...this.editIngredient });
        this.editIngredient = { name: '', quantity: '' };
      }
    } else {
      if (this.newIngredient.name && this.newIngredient.quantity) {
        this.newRecipe.ingredients.push({ ...this.newIngredient });
        this.newIngredient = { name: '', quantity: '' };
      }
    }
  }

  removeIngredient(index: number) {
    if (this.isEditing && this.editingRecipe) {
      this.editingRecipe.ingredients.splice(index, 1);
    } else {
      this.newRecipe.ingredients.splice(index, 1);
    }
  }

  addStep() {
    if (this.isEditing && this.editingRecipe) {
      if (this.editStep.description) {
        const index = this.editingRecipe.steps.length + 1;
        const title = this.editStep.title && this.editStep.title.trim().length > 0 ? this.editStep.title : `Passo ${index}`;
        const description = this.capitalizeFirst(this.editStep.description);
        const step: Step = { step: String(index), title, description };
        this.editingRecipe.steps.push(step);
        this.editStep = { step: '', title: '', description: '' };
      }
    } else {
      if (this.newStep.description) {
        const index = this.newRecipe.steps.length + 1;
        const title = this.newStep.title && this.newStep.title.trim().length > 0 ? this.newStep.title : `Passo ${index}`;
        const description = this.capitalizeFirst(this.newStep.description);
        const step: Step = { step: String(index), title, description };
        this.newRecipe.steps.push(step);
        this.newStep = { step: '', title: '', description: '' };
      }
    }
  }

  removeStep(index: number) {
    if (this.isEditing && this.editingRecipe) {
      this.editingRecipe.steps.splice(index, 1);
      // Rinumera i step
      this.editingRecipe.steps.forEach((step, i) => {
        step.step = (i + 1).toString();
      });
    } else {
      this.newRecipe.steps.splice(index, 1);
      // Rinumera i step
      this.newRecipe.steps.forEach((step, i) => {
        step.step = (i + 1).toString();
      });
    }
  }

  private resetNewRecipe() {
    this.newRecipe = {
      id: '',
      title: '',
      subtitle: '',
      cooking_time: '',
      serving: '',
      main_image: '',
      video_url: '',
      ingredients: [],
      steps: []
    };
    this.newIngredient = { name: '', quantity: '' };
    this.newStep = { step: '', title: '', description: '' };
    this.editIngredient = { name: '', quantity: '' };
    this.editStep = { step: '', title: '', description: '' };
  }

}
