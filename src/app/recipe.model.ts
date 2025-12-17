export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Step {
  step: string;
  title: string;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle?: string;
  cooking_time?: string;
  serving?: string;
  main_image?: string;
  video_url?: string;
  ingredients: Ingredient[];
  steps: Step[];
} 