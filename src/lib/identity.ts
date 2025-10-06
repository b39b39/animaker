// src/lib/identity.ts
import netlifyIdentity from 'netlify-identity-widget';

export function initIdentity() {
  netlifyIdentity.init();
  return netlifyIdentity;
}

export function isAdmin(): boolean {
  const u = netlifyIdentity.currentUser();
  return !!u && (u.app_metadata?.roles || []).includes('admin');
}

export async function getIdentityToken(): Promise<string | null> {
  const u = netlifyIdentity.currentUser();
  if (!u) return null;
  return await u.jwt();
}
