import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { Recipe } from './recipe.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipseService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });
    
  }

  // GET tutte le ricette
  getRecipes(): Observable<Recipe[]> {
    return from(
      this.supabase
        .from('recipes')
        .select('*')
        .then(({ data, error }) => {
          if (error) throw error;
          return data || [];
        })
    );
  }

  // GET ricetta singola per id
  getRecipe(id: string): Observable<Recipe> {
    return from(
      this.supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  }

  // DELETE ricetta per id
  deleteRecipe(id: string): Observable<any> {
    return from(
      this.supabase
        .from('recipes')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
          return { success: true };
        })
    );
  }

  // UPDATE ricetta (PUT)
  updateRecipe(id: string, data: Recipe): Observable<Recipe> {
    return from(
      this.supabase
        .from('recipes')
        .update({
          title: data.title,
          subtitle: data.subtitle,
          cooking_time: data.cooking_time,
          serving: data.serving,
          main_image: data.main_image,
          video_url: data.video_url,
          ingredients: data.ingredients,
          steps: data.steps
        })
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  }

  // POST nuova ricetta
  createRecipe(data: Recipe): Observable<Recipe> {
    return from(
      this.supabase
        .from('recipes')
        .insert({
          title: data.title,
          subtitle: data.subtitle,
          cooking_time: data.cooking_time,
          serving: data.serving,
          main_image: data.main_image,
          video_url: data.video_url,
          ingredients: data.ingredients,
          steps: data.steps
        })
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        })
    );
  }

  // Upload video to Supabase Storage and return public URL
  async uploadVideo(file: File): Promise<string> {
    // Prefer backend endpoint when configured (for private buckets with service role)
    if ((environment as any).videoUploadEndpoint) {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch((environment as any).videoUploadEndpoint, {
        method: 'POST',
        body: form
      });
      if (!res.ok) {
        throw new Error(`Backend upload failed: ${res.status}`);
      }
      const data = await res.json();
      // Accept either { path } for private buckets or { publicUrl }
      if (data.path) return data.path as string;
      if (data.publicUrl) return data.publicUrl as string;
      throw new Error('Missing path/publicUrl in backend response');
    }
    const fileExt = file.name.split('.').pop() || 'mp4';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `videos/${fileName}`;

    const { error: uploadError } = await this.supabase
      .storage
      .from('video_bucket')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'video/mp4'
      });

    if (uploadError) {
      throw uploadError;
    }

    // For private buckets, return the storage path; the app will request a signed URL when needed
    return filePath;
  }

  // Upload image to the SAME bucket used for videos and return the storage path or public URL
  async uploadImage(file: File): Promise<string> {
    // Prefer backend endpoint when configured (mirrors video upload pattern)
    if ((environment as any).imageUploadEndpoint) {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch((environment as any).imageUploadEndpoint, {
        method: 'POST',
        body: form
      });
      if (!res.ok) {
        throw new Error(`Backend upload failed: ${res.status}`);
      }
      const data = await res.json();
      if (data.path) return data.path as string;
      if (data.publicUrl) return data.publicUrl as string;
      throw new Error('Missing path/publicUrl in backend response');
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { error: uploadError } = await this.supabase
      .storage
      .from('video_bucket')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/jpeg'
      });

    if (uploadError) {
      throw uploadError;
    }

    return filePath;
  }

  async getSignedImageUrl(path: string): Promise<string> {
    const { data, error } = await this.supabase
      .storage
      .from('video_bucket')
      .createSignedUrl(path, 60 * 60); // 1h
    if (error || !data?.signedUrl) throw error || new Error('Cannot sign image URL');
    return data.signedUrl;
  }

  // Request a signed URL from backend for a private object path
  async getSignedVideoUrl(path: string): Promise<string> {
    // Client-side signed URL (requires storage policy permitting anon to sign objects)
    const { data, error } = await this.supabase
      .storage
      .from('video_bucket')
      .createSignedUrl(path, 60 * 60); // 1h
    if (error || !data?.signedUrl) throw error || new Error('Cannot sign URL client-side');
    return data.signedUrl;
  }

  // ================= Delete assets from storage =================
  private extractBucketAndPathFromUrl(url: string): { bucket: string; path: string } | null {
    // Matches public or signed URLs
    const match = url.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+?)(?:\?|$)/);
    if (match) {
      return { bucket: match[1], path: decodeURIComponent(match[2]) };
    }
    return null;
  }

  async deleteAsset(urlOrPath?: string): Promise<void> {
    if (!urlOrPath) return;
    // Ignore obvious external URLs (e.g., YouTube)
    const isHttp = /^https?:\/\//i.test(urlOrPath);
    let bucket = 'video_bucket';
    let path = urlOrPath;
    if (isHttp) {
      const parsed = this.extractBucketAndPathFromUrl(urlOrPath);
      if (!parsed) return; // not a Supabase storage URL, nothing to delete
      bucket = parsed.bucket;
      path = parsed.path;
    }
    // Remove leading slashes for safety
    path = path.replace(/^\/+/, '');
    const { error } = await this.supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  }
}
