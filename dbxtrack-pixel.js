(function() {
  console.log("dbxtrack-pixel: Initializing...");

  const pageParams = new URLSearchParams(window.location.search);
  const queryString = pageParams.toString();

  if (!queryString) {
    console.log("dbxtrack-pixel: No query parameters found.");
    return;
  }

  console.log("dbxtrack-pixel: Query string:", queryString);

  function addParams(url) {
    if (!url || typeof url !== 'string') return url;
    if (!url.includes('/whatsapp/') && !url.includes('wa.me') && !url.includes('api.whatsapp.com')) {
      return url;
    }
    const separator = url.includes('?') ? '&' : '?';
    const newUrl = `${url}${separator}${queryString}`;
    console.log("dbxtrack-pixel: URL updated:", newUrl);
    return newUrl;
  }

  // Função para atualizar links
  function updateLinks() {
    const links = document.querySelectorAll('a[href*="/whatsapp/"]:not([data-dbx-tracked]), a[href*="wa.me"]:not([data-dbx-tracked]), a[href*="api.whatsapp.com"]:not([data-dbx-tracked])');
    
    links.forEach(link => {
      if (!link.href) return;
      link.href = addParams(link.href);
      link.setAttribute('data-dbx-tracked', 'true');
    });

    if (links.length > 0) {
      console.log(`dbxtrack-pixel: Updated ${links.length} link(s).`);
    }
  }

  // Intercepta window.open e window.location IMEDIATAMENTE
  const originalOpen = window.open;
  window.open = function(url, ...args) {
    const modifiedUrl = addParams(url);
    return originalOpen.call(this, modifiedUrl, ...args);
  };

  const locationDesc = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href');
  if (locationDesc && locationDesc.set) {
    const originalSetter = locationDesc.set;
    Object.defineProperty(window.Location.prototype, 'href', {
      set: function(url) {
        const modifiedUrl = addParams(url);
        originalSetter.call(this, modifiedUrl);
      }
    });
  }

  // Executa quando o DOM estiver pronto
  function init() {
    updateLinks();

    // Observer para conteúdo dinâmico
    const observer = new MutationObserver(updateLinks);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Intercepta clicks
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link && link.href && !link.getAttribute('data-dbx-tracked')) {
        link.href = addParams(link.href);
        link.setAttribute('data-dbx-tracked', 'true');
      }
    }, true);

    console.log("dbxtrack-pixel: Fully active and monitoring.");
  }

  // Aguarda DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();