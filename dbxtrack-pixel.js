(function() {
  console.log("dbxtrack-pixel: Initializing...");

  // Find the link element by its ID
  const whatsAppButton = document.getElementById('dbxtrack-whatsapp-link');

  if (!whatsAppButton) {
    console.error("dbxtrack-pixel: Could not find element with id 'dbxtrack-whatsapp-link'.");
    return;
  }

  // Get the original href of the button
  const originalHref = whatsAppButton.href;
  console.log("dbxtrack-pixel: Found button with original href:", originalHref);

  if (!originalHref) {
    console.warn("dbxtrack-pixel: Button has no href attribute to update.");
    return; // Exit if the button has no href
  }

  // Get query parameters from the current page's URL
  const pageParams = new URLSearchParams(window.location.search);
  const queryString = pageParams.toString();

  // If there are no query parameters, no need to do anything
  if (!queryString) {
    console.log("dbxtrack-pixel: No query string found in page URL. No changes needed.");
    return;
  }
  console.log("dbxtrack-pixel: Captured query string:", queryString);

  // Check if the original href already has query parameters
  const separator = originalHref.includes('?') ? '&' : '?';

  // Set the new, combined href
  const finalHref = `${originalHref}${separator}${queryString}`;
  whatsAppButton.href = finalHref;
  console.log("dbxtrack-pixel: Successfully updated button href to:", finalHref);

})();
