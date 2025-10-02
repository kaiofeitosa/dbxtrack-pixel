(function() {
  console.log("dbxtrack-pixel: Initializing (Advanced Mode)...");

  const pageParams = new URLSearchParams(window.location.search);
  const queryString = pageParams.toString();

  if (!queryString) {
    console.log("dbxtrack-pixel: No query parameters found.");
    return;
  }

  console.log("dbxtrack-pixel: Query string:", queryString);

  // Função auxiliar para adicionar parâmetros a uma URL
  function addParamsToUrl(url) {
    if (!url || typeof url !== 'string') return url;
    if (!url.includes('/whatsapp/') && !url.includes('wa.me') && !url.includes('api.whatsapp.com')) {
      return url;
    }

    const separator = url.includes('?') ? '&' : '?';
    const newUrl = `${url}${separator}${queryString}`;
    console.log("dbxtrack-pixel: URL interceptada e atualizada:", newUrl);
    return newUrl;
  }

  // 1️⃣ Atualiza links <a> existentes e novos (modais, etc)
  function updateWhatsAppLinks() {
    const links = document.querySelectorAll('a[href*="/whatsapp/"]:not([data-dbx-tracked]), a[href*="wa.me"]:not([data-dbx-tracked]), a[href*="api.whatsapp.com"]:not([data-dbx-tracked])');
    
    links.forEach(link => {
      if (!link.href) return;
      
      link.href = addParamsToUrl(link.href);
      link.setAttribute('data-dbx-tracked', 'true');
    });

    if (links.length > 0) {
      console.log(`dbxtrack-pixel: Updated ${links.length} link(s).`);
    }
  }

  updateWhatsAppLinks();

  const observer = new MutationObserver(updateWhatsAppLinks);
  observer.observe(document.body, { childList: true, subtree: true });

  // 2️⃣ Intercepta window.location (redirecionamentos diretos)
  const originalLocation = window.location.href;
  let locationSetter = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href').set;

  Object.defineProperty(window.Location.prototype, 'href', {
    set: function(url) {
      const modifiedUrl = addParamsToUrl(url);
      locationSetter.call(this, modifiedUrl);
    }
  });

  console.log("dbxtrack-pixel: Intercepting window.location redirects...");

  // 3️⃣ Intercepta window.open (popups/novas abas)
  const originalOpen = window.open;
  window.open = function(url, ...args) {
    const modifiedUrl = addParamsToUrl(url);
    console.log("dbxtrack-pixel: window.open interceptado:", modifiedUrl);
    return originalOpen.call(this, modifiedUrl, ...args);
  };

  // 4️⃣ Intercepta clicks em links (evento)
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && !link.getAttribute('data-dbx-tracked')) {
      link.href = addParamsToUrl(link.href);
      link.setAttribute('data-dbx-tracked', 'true');
    }
  }, true);

  console.log("dbxtrack-pixel: Full protection active ✓");
})();