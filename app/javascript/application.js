// Entry point for the application
import "./main"

// Initialisation des modals Bootstrap et gestion des erreurs
document.addEventListener('turbo:load', () => {
  try {
    // Initialiser toutes les modals Bootstrap
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');
    
    if (modalTriggers.length > 0) {
      modalTriggers.forEach(trigger => {
        try {
          const targetId = trigger.getAttribute('data-bs-target');
          if (!targetId) return;
          
          const modalElement = document.querySelector(targetId);
          if (!modalElement || !bootstrap || !bootstrap.Modal) return;
          
          // Créer une instance de modal Bootstrap avec gestion d'erreur
          new bootstrap.Modal(modalElement, {
            backdrop: true,
            keyboard: true,
            focus: true
          });
        } catch (modalError) {
          // Ignorer silencieusement les erreurs spécifiques à chaque modal
        }
      });
    }
  } catch (e) {
    // Ignorer silencieusement les erreurs globales
  }
});

// S'assurer que le code s'exécute également lors du chargement initial
document.addEventListener('DOMContentLoaded', () => {
  // Référence à l'événement turbo:load pour éviter la duplication de code
  const event = new Event('turbo:load');
  document.dispatchEvent(event);
});
