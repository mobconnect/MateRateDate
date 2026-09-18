export function getFirebaseErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as any).code)
      : "";

  switch (code) {
    case "permission-denied":
      return "You do not have permission to access this content.";
    case "unauthenticated":
      return "Please sign in to continue.";
    case "failed-precondition":
      return "This content service needs configuration before it can be used.";
    case "unavailable":
      return "The service is temporarily unavailable. Try again shortly.";
    case "storage/unauthorized":
      return "You do not have permission to access this media.";
    case "storage/canceled":
      return "The upload was cancelled.";
    case "storage/retry-limit-exceeded":
      return "The upload could not be completed. Try again.";
    default:
      return "Something went wrong. Try again.";
  }
}
