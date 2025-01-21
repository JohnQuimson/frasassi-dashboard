export function isAuthenticated() {
   const token = localStorage.getItem('token'); // Leggi il token JWT dal localStorage
   return !!token; // Ritorna true se il token esiste, altrimenti false
}
