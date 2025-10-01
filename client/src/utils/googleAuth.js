// Google OAuth utility functions

// Detect if user is on iOS Chrome
export const isIOSChrome = () => {
  const userAgent = navigator.userAgent || "";
  return /CriOS/i.test(userAgent) && /iPhone|iPad/i.test(userAgent);
};

// Detect if user is on iOS Safari
export const isIOSSafari = () => {
  const userAgent = navigator.userAgent || "";
  return (
    /Safari/i.test(userAgent) &&
    !/CriOS/i.test(userAgent) &&
    /iPhone|iPad/i.test(userAgent)
  );
};

// Detect if user is on mobile
export const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Handle Google OAuth with better mobile support
export const initiateGoogleAuth = (getGoogleAuthUrl) => {
  const authUrl = getGoogleAuthUrl();

  console.log("Initiating Google Auth for:", {
    isIOSChrome: isIOSChrome(),
    isIOSSafari: isIOSSafari(),
    isMobile: isMobile(),
    userAgent: navigator.userAgent,
  });

  // For iOS Chrome, we need to use direct navigation due to cookie limitations
  if (isIOSChrome()) {
    console.log("Using direct navigation for iOS Chrome");
    window.location.href = authUrl;
    return;
  }

  // For other mobile browsers, try popup with fallback
  if (isMobile()) {
    console.log("Attempting popup for mobile browser");
    try {
      const popup = window.open(
        authUrl,
        "googleAuth",
        "width=500,height=600,scrollbars=yes,resizable=yes,location=yes"
      );

      // Check if popup was blocked
      if (!popup || popup.closed) {
        console.log("Popup blocked, falling back to direct navigation");
        // Fallback to direct navigation
        window.location.href = authUrl;
        return;
      }

      // Monitor popup for completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          console.log("Popup closed, refreshing page");
          // Refresh the page to check for auth success
          window.location.reload();
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkClosed);
        if (!popup.closed) {
          console.log("Popup timeout, closing");
          popup.close();
        }
      }, 300000);
    } catch (error) {
      console.log("Popup error, falling back to direct navigation:", error);
      // If popup fails, fallback to direct navigation
      window.location.href = authUrl;
    }
  } else {
    // Desktop: use direct navigation (current behavior)
    console.log("Using direct navigation for desktop");
    window.location.href = authUrl;
  }
};
