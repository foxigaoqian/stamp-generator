
import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StampPreviewComponent, StampConfig } from './components/stamp-preview.component';
import { TranslationService, Language } from './services/translation.service';
import { GeminiService } from './services/gemini.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, StampPreviewComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  translation = inject(TranslationService);
  gemini = inject(GeminiService);

  @ViewChild(StampPreviewComponent) previewComponent!: StampPreviewComponent;

  // Stamp State
  stampConfig = signal<StampConfig>({
    shape: 'circle',
    color: '#ef4444', // Red-500
    topText: 'COMPANY NAME',
    bottomText: 'EST. 2024',
    centerText: '',
    centerImage: null,
    borderWidth: 5,
    fontSize: 24,
    isGrunge: true
  });

  // UI State
  isGenerating = signal(false);
  iconPrompt = signal('');
  
  // Available Colors
  colors = [
    { name: 'red', value: '#ef4444', class: 'bg-red-500' },
    { name: 'blue', value: '#3b82f6', class: 'bg-blue-500' },
    { name: 'black', value: '#1e293b', class: 'bg-slate-800' },
    { name: 'green', value: '#22c55e', class: 'bg-green-500' },
    { name: 'purple', value: '#a855f7', class: 'bg-purple-500' },
  ];

  // Helper for translations
  t(key: any) {
    return this.translation.t(key);
  }

  setLang(lang: string) {
    this.translation.setLanguage(lang as Language);
  }

  updateConfig(key: keyof StampConfig, value: any) {
    this.stampConfig.update(prev => ({ ...prev, [key]: value }));
  }

  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.updateConfig('centerImage', e.target?.result as string);
        this.updateConfig('centerText', ''); // Clear text if image used
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  async generateAiIcon() {
    if (!this.iconPrompt()) return;
    
    this.isGenerating.set(true);
    try {
      const imageUrl = await this.gemini.generateIcon(this.iconPrompt());
      this.updateConfig('centerImage', imageUrl);
      this.updateConfig('centerText', '');
    } catch (err) {
      alert('Failed to generate icon. Please try again.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  triggerDownload() {
    this.previewComponent.download();
  }
}
