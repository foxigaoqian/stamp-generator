
import { Injectable, signal } from '@angular/core';

export type Language = 'en' | 'es' | 'zh' | 'fr';

const TRANSLATIONS = {
  en: {
    title: 'StampGen AI',
    subtitle: 'Free Online Stamp Creator',
    shape: 'Shape',
    circle: 'Circle',
    rectangle: 'Rectangle',
    colors: 'Ink Color',
    red: 'Red',
    blue: 'Blue',
    black: 'Black',
    green: 'Green',
    purple: 'Purple',
    textSettings: 'Text Settings',
    topText: 'Top Text',
    bottomText: 'Bottom Text',
    centerText: 'Center Text',
    centerImage: 'Center Image',
    generateIcon: 'Generate AI Icon',
    uploadImage: 'Upload Image',
    download: 'Download Stamp',
    generating: 'Generating...',
    promptPlaceholder: 'Describe icon (e.g., eagle, star)...',
    advanced: 'Advanced',
    borderWidth: 'Border Width',
    fontSize: 'Font Size',
    grunge: 'Grunge Effect',
    footer: 'No registration required. 100% Free.'
  },
  es: {
    title: 'StampGen AI',
    subtitle: 'Creador de Sellos Online Gratis',
    shape: 'Forma',
    circle: 'Círculo',
    rectangle: 'Rectángulo',
    colors: 'Color de Tinta',
    red: 'Rojo',
    blue: 'Azul',
    black: 'Negro',
    green: 'Verde',
    purple: 'Morado',
    textSettings: 'Configuración de Texto',
    topText: 'Texto Superior',
    bottomText: 'Texto Inferior',
    centerText: 'Texto Central',
    centerImage: 'Imagen Central',
    generateIcon: 'Generar Icono IA',
    uploadImage: 'Subir Imagen',
    download: 'Descargar Sello',
    generating: 'Generando...',
    promptPlaceholder: 'Describe el icono...',
    advanced: 'Avanzado',
    borderWidth: 'Ancho del Borde',
    fontSize: 'Tamaño de Fuente',
    grunge: 'Efecto Desgastado',
    footer: 'Sin registro. 100% Gratis.'
  },
  zh: {
    title: 'StampGen AI',
    subtitle: '免费在线印章制作工具',
    shape: '形状',
    circle: '圆形',
    rectangle: '矩形',
    colors: '墨水颜色',
    red: '红色',
    blue: '蓝色',
    black: '黑色',
    green: '绿色',
    purple: '紫色',
    textSettings: '文字设置',
    topText: '顶部文字',
    bottomText: '底部文字',
    centerText: '中间文字',
    centerImage: '中间图片',
    generateIcon: '生成 AI 图标',
    uploadImage: '上传图片',
    download: '下载印章',
    generating: '生成中...',
    promptPlaceholder: '描述图标 (例如: 老鹰, 星星)...',
    advanced: '高级设置',
    borderWidth: '边框宽度',
    fontSize: '字体大小',
    grunge: '做旧效果',
    footer: '无需注册。100% 免费。'
  },
  fr: {
    title: 'StampGen AI',
    subtitle: 'Créateur de Tampons Gratuit',
    shape: 'Forme',
    circle: 'Cercle',
    rectangle: 'Rectangle',
    colors: 'Couleur',
    red: 'Rouge',
    blue: 'Bleu',
    black: 'Noir',
    green: 'Vert',
    purple: 'Violet',
    textSettings: 'Texte',
    topText: 'Texte Haut',
    bottomText: 'Texte Bas',
    centerText: 'Texte Centre',
    centerImage: 'Image Centrale',
    generateIcon: 'Générer Icône IA',
    uploadImage: 'Télécharger Image',
    download: 'Télécharger',
    generating: 'Génération...',
    promptPlaceholder: 'Décrivez l\'icône...',
    advanced: 'Avancé',
    borderWidth: 'Largeur Bordure',
    fontSize: 'Taille Police',
    grunge: 'Effet Grunge',
    footer: 'Pas d\'inscription. 100% Gratuit.'
  }
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  currentLang = signal<Language>('en');

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
  }

  t(key: keyof typeof TRANSLATIONS['en']): string {
    const lang = this.currentLang();
    return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key];
  }
}
