(function() {
  console.log("dbxtrack-pixel: Initializing...");

  // Captura os parâmetros da URL da página
  const pageParams = new URLSearchParams(window.location.search);
  const queryString = pageParams.toString();

  if (!queryString) {
    console.log("dbxtrack-pixel: No query parameters found. Script idle.");
    return;
  }

  console.log("dbxtrack-pixel: Captured query string:", queryString);

  // Função para atualizar links do WhatsApp
  function updateWhatsAppLinks() {
    // Busca links não processados ainda
    const redirectLinks = document.querySelectorAll('a[href*="/whatsapp/"]:not([data-dbx-tracked])');
    
    if (redirectLinks.length === 0) return;

    console.log(`dbxtrack-pixel: Found ${redirectLinks.length} new link(s) to update.`);

    redirectLinks.forEach(link => {
      const originalHref = link.href;
      
      if (!originalHref) {
        console.warn("dbxtrack-pixel: Link without href found.", link);
        return;
      }

      // Adiciona os parâmetros
      const separator = originalHref.includes('?') ? '&' : '?';
      const finalHref = `${originalHref}${separator}${queryString}`;
      
      link.href = finalHref;
      link.setAttribute('data-dbx-tracked', 'true'); // Marca para não processar novamente
      
      console.log("dbxtrack-pixel: Link updated →", finalHref);
    });
  }

  // Executa imediatamente para links já existentes
  updateWhatsAppLinks();

  // Observa o DOM para capturar links criados dinamicamente (modais, etc)
  const observer = new MutationObserver(function(mutations) {
    updateWhatsAppLinks();
  });

  // Inicia observação
  observer.observe(document.body, {
    childList: true,    // Observa adição/remoção de elementos
    subtree: true       // Observa toda a árvore DOM
  });

  console.log("dbxtrack-pixel: Active and monitoring for dynamic content.");
})();