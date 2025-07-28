export function getCsrfToken() {
  return localStorage.getItem("csrfToken");
}

export function setCsrfToken(token: string) {
  localStorage.setItem("csrfToken", token);
}

export function removeCsrfToken() {
  localStorage.removeItem("csrfToken");
}
