export function getIsLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

export function setIsLoggedIn(isLoggedIn: boolean) {
  localStorage.setItem("isLoggedIn", String(isLoggedIn));
}

export function removeIsLoggedIn() {
  localStorage.removeItem("isLoggedIn");
}
