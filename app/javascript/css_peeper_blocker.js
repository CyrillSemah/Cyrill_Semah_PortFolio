/**
 * CSS Peeper Blocker
 * Ce fichier est conçu pour bloquer complètement les erreurs générées par l'extension CSS Peeper
 */

// Fonction d'initialisation pour bloquer CSS Peeper
function initCSSPeeperBlocker() {
  // Bloquer l'accès aux feuilles de style
  if (typeof CSSStyleSheet !== 'undefined') {
    // Remplacer le prototype pour bloquer l'accès à cssRules
    try {
      Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', {
        get: function() { return []; },
        set: function() {},
        configurable: false
      });
    } catch (e) {
      // Ignorer les erreurs
    }
  }

  // Bloquer les scripts de l'extension
  function removeInspectorScripts() {
    const scripts = document.querySelectorAll('script[src*="inspector.b9415"]');
    scripts.forEach(script => script.remove());
  }

  // Surveiller et bloquer les nouveaux scripts
  function setupScriptBlocker() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeName === 'SCRIPT' && 
                node.src && 
                (node.src.includes('inspector.b9415') || 
                 node.src.includes('css-peeper'))) {
              node.remove();
            }
          });
        }
      });
    });
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // Supprimer les erreurs de console liées à CSS Peeper
  function blockConsoleErrors() {
    const originalConsoleError = console.error;
    console.error = function(...args) {
      if (args[0] && typeof args[0] === 'string') {
        const errorMsg = args[0].toString();
        if (errorMsg.includes('cssRules') || 
            errorMsg.includes('SecurityError') || 
            errorMsg.includes('inspector.b9415') ||
            errorMsg.includes('CSS')) {
          return;
        }
      }
      return originalConsoleError.apply(this, args);
    };
  }

  // Bloquer les erreurs globales
  function blockGlobalErrors() {
    window.addEventListener('error', function(e) {
      if (e && e.filename && 
         (e.filename.includes('inspector.b9415') || 
          e.message && e.message.includes('cssRules'))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);
  }

  // Exécuter toutes les fonctions de blocage
  removeInspectorScripts();
  setupScriptBlocker();
  blockConsoleErrors();
  blockGlobalErrors();
  
  // Réexécuter périodiquement pour s'assurer que tout est bloqué
  setInterval(removeInspectorScripts, 1000);
}

// Exécuter immédiatement
if (typeof window !== 'undefined') {
  initCSSPeeperBlocker();
  
  // Exécuter également après le chargement du DOM
  document.addEventListener('DOMContentLoaded', initCSSPeeperBlocker);
  
  // Exécuter à chaque navigation Turbo
  document.addEventListener('turbo:load', initCSSPeeperBlocker);
  document.addEventListener('turbo:render', initCSSPeeperBlocker);
}

export { initCSSPeeperBlocker };
