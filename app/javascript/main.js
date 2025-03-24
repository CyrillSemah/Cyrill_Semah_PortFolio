// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

// Import du bloqueur CSS Peeper
import { initCSSPeeperBlocker } from "./css_peeper_blocker"

// Import Bootstrap avec tous ses composants
import * as bootstrap from "bootstrap"

// Initialiser le bloqueur CSS Peeper immédiatement
initCSSPeeperBlocker();

// Rendre bootstrap disponible globalement
window.bootstrap = bootstrap;

// Suppression des fonctionnalités obsolètes
(() => {
  // Surcharger les méthodes addEventListener et removeEventListener pour filtrer 'unload'
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  
  // Remplacer addEventListener pour filtrer les événements obsolètes
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'unload') {
      // Ne pas ajouter d'écouteur pour 'unload'
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  // Remplacer removeEventListener pour filtrer les événements obsolètes
  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    if (type === 'unload') {
      // Ne pas tenter de supprimer d'écouteur pour 'unload'
      return;
    }
    return originalRemoveEventListener.call(this, type, listener, options);
  };
})();

// Fonction d'initialisation des composants Bootstrap
function initBootstrapComponents() {
  try {
    // Initialiser d'autres composants Bootstrap si nécessaire
    // Note: Le menu burger est maintenant géré directement dans application.html.erb
    
    // Initialiser les tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (tooltipTriggerList.length > 0 && bootstrap && bootstrap.Tooltip) {
      [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }
    
    // Initialiser les popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    if (popoverTriggerList.length > 0 && bootstrap && bootstrap.Popover) {
      [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    }
  } catch (error) {
    // Ignorer silencieusement les erreurs
  }
}

// Initialiser uniquement sur turbo:load pour éviter les doublons
document.addEventListener("turbo:load", initBootstrapComponents, {once: false});

// Initialiser également lors du chargement initial
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initBootstrapComponents, {once: true});
} else {
  initBootstrapComponents();
}
