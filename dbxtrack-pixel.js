(function() {
  console.log("dbxtrack-pixel: Initializing...");

  // Find all anchor tags whose href contains the redirect link signature.
  const redirectLinks = document.querySelectorAll('a[href*="/whatsapp/"]');

  if (redirectLinks.length === 0) {
    console.log("dbxtrack-pixel: No redirect links found on the page.");
    return;
  }

  console.log(`dbxtrack-pixel: Found ${redirectLinks.length} link(s) to update.`);

  // Get query parameters from the current page's URL
  const pageParams = new URLSearchParams(window.location.search);
  const queryString = pageParams.toString();

  // If there are no query parameters, no need to do anything
  if (!queryString) {
    console.log("dbxtrack-pixel: No query string found in page URL. No changes needed.");
    return;
  }

  console.log("dbxtrack-pixel: Captured query string:", queryString);

  // Loop through each found link and update its href
  redirectLinks.forEach(link => {
    const originalHref = link.href;
    if (!originalHref) {
      console.warn("dbxtrack-pixel: Found a link with no href attribute.", link);
      return; // Skip this link
    }

    // Check if the original href already has query parameters
    const separator = originalHref.includes('?') ? '&' : '?';

    // Set the new, combined href
    const finalHref = `${originalHref}${separator}${queryString}`;
    link.href = finalHref;
    console.log("dbxtrack-pixel: Successfully updated a link href to:", finalHref);
  });

})();
