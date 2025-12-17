import { Component, OnInit, HostListener, Inject, PLATFORM_ID, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipseService } from '../../recipse.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule, YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-ricettario',
  imports: [CommonModule, FormsModule,YouTubePlayerModule],
  templateUrl: './ricettario.component.html',
  styleUrl: './ricettario.component.css'
})
export class RicettarioComponent implements OnInit, AfterViewInit, OnDestroy{
  constructor(
    public recipesService:RecipseService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
    ){

  }
  extractVideoId(url: string): string | undefined {
    let match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[?&]|$)/);
    
    if (!match) {
      // caso specifico per i link shorts
      match = url.match(/shorts\/([0-9A-Za-z_-]{11})/);
    }
  
    return match ? match[1] : undefined;
  }
  

  recipes: Recipe[] = [];
  selectedRecipe: Recipe | null = null;
  editingRecipe: Recipe | null = null;
  isEditing = false;
  isCreating = false;
  isLoading = false;
  isMobile=false;
  errorMessage = '';
  successMessage = '';
  // Video/visibility handling
  @ViewChild('videoContainer') videoContainerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('htmlVideo') htmlVideoRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('ytPlayer') ytPlayer?: YouTubePlayer;
  private visibilityObserver?: IntersectionObserver;
  private youTubeReady = false;
  private playTimeoutId: any;
  private readonly playDelayMs = 2000; // avvia dopo 3 secondi per lasciare spazio all'animazione
  
  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.checkIfMobile();
  }

  ngOnInit(): void {
    this.loadRecipes();
    this.checkIfMobile();
  }

  ngAfterViewInit(): void {
    // Observer is initialized when a recipe modal opens, because elements are conditionally rendered.
  }

  private checkIfMobile() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    }
  }
  
  loadRecipes() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.recipesService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        // Sign images if paths are private (not http/https)
        if (isPlatformBrowser(this.platformId)) {
          this.recipes.forEach(async (r, idx) => {
            if (r.main_image && !/^https?:\/\//i.test(r.main_image)) {
              try {
                const signed = await this.recipesService.getSignedImageUrl(r.main_image);
                // Update reference immutably to trigger change detection in some cases
                this.recipes[idx] = { ...r, main_image: signed } as Recipe;
              } catch (e) {
                // ignore signing errors; fallback will handle
              }
            }
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore caricamento ricette', err);
        this.errorMessage = 'Errore nel caricamento delle ricette: ' + err.message;
        this.isLoading = false;
      },
    });
  }

  openRecipeModal(recipe: Recipe) {
    this.selectedRecipe = { ...recipe };
    // If video_url is a private storage path (not http/https), request a signed URL
    if (this.selectedRecipe.video_url && !/^https?:\/\//i.test(this.selectedRecipe.video_url)) {
      this.recipesService.getSignedVideoUrl(this.selectedRecipe.video_url)
        .then((signed) => {
          if (this.selectedRecipe) this.selectedRecipe.video_url = signed;
        })
        .catch((err) => console.warn('Sign URL failed', err));
    }
    // If main_image is a private storage path, sign it too
    if (this.selectedRecipe.main_image && !/^https?:\/\//i.test(this.selectedRecipe.main_image)) {
      this.recipesService.getSignedImageUrl(this.selectedRecipe.main_image)
        .then((signed) => {
          if (this.selectedRecipe) this.selectedRecipe.main_image = signed;
        })
        .catch((err) => console.warn('Sign image URL failed', err));
    }
    console.log(recipe)
    document.body.style.overflow = 'hidden'; // Previene lo scroll della pagina
    // Initialize observer after modal DOM is rendered
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.onStable.asObservable().subscribe(() => {
        this.setupVisibilityObserver();
      });
    }
  }

  closeRecipeModal() {
    this.selectedRecipe = null;
    document.body.style.overflow = 'auto'; // Ripristina lo scroll della pagina
    this.teardownVisibilityObserver();
  }

  onImageError(event: any) {
    // Fallback per immagini mancanti
    event.target.src = 'assets/images/default-recipe.jpg';
  }

  onYouTubeReady() {
    this.youTubeReady = true;
  }

  private setupVisibilityObserver() {
    if (!isPlatformBrowser(this.platformId)) return;
    // Avoid multiple observers
    this.teardownVisibilityObserver();
    const container = this.videoContainerRef?.nativeElement;
    if (!container) return;

    this.visibilityObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== container) continue;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          this.schedulePlay();
        } else {
          this.clearScheduledPlay();
          this.pauseCurrentVideo();
        }
      }
    }, { threshold: [0, 0.5, 1] });

    this.visibilityObserver.observe(container);
  }

  private teardownVisibilityObserver() {
    if (this.visibilityObserver) {
      this.visibilityObserver.disconnect();
      this.visibilityObserver = undefined;
    }
    // Ensure video is paused when closing
    this.clearScheduledPlay();
    this.pauseCurrentVideo();
  }

  private schedulePlay() {
    this.clearScheduledPlay();
    this.playTimeoutId = setTimeout(() => {
      this.playCurrentVideo();
    }, this.playDelayMs);
  }

  private clearScheduledPlay() {
    if (this.playTimeoutId) {
      clearTimeout(this.playTimeoutId);
      this.playTimeoutId = undefined;
    }
  }

  private playCurrentVideo() {
    // Prefer HTML5 video if present
    const htmlVideo = this.htmlVideoRef?.nativeElement;
    if (htmlVideo) {
      const playPromise = htmlVideo.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {/* ignore autoplay restriction errors */});
      }
      return;
    }
    if (this.ytPlayer && this.youTubeReady) {
      try { this.ytPlayer.playVideo(); } catch { /* ignore */ }
    }
  }

  private pauseCurrentVideo() {
    const htmlVideo = this.htmlVideoRef?.nativeElement;
    if (htmlVideo && !htmlVideo.paused) {
      htmlVideo.pause();
    }
    if (this.ytPlayer && this.youTubeReady) {
      try { this.ytPlayer.pauseVideo(); } catch { /* ignore */ }
    }
  }

  ngOnDestroy(): void {
    this.teardownVisibilityObserver();
  }
}
