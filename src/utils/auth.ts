export function getCsrfToken() {
  return sessionStorage.getItem("csrfToken");
}

export function setCsrfToken(token: string) {
  sessionStorage.setItem("csrfToken", token);
}

export function removeCsrfToken() {
  sessionStorage.removeItem("csrfToken");
}
