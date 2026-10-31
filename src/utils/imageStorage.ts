// Storage helper for custom admin-uploaded photos
const STORAGE_KEY = 'russia_puzzles_custom_images';
const ADMIN_PASS_KEY = 'russia_puzzles_admin_password';
const DEFAULT_ADMIN_PASS = 'admin';

export function getAdminPassword(): string {
  try {
    return localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_ADMIN_PASS;
  } catch {
    return DEFAULT_ADMIN_PASS;
  }
}

export function setAdminPassword(newPass: string): void {
  try {
    localStorage.setItem(ADMIN_PASS_KEY, newPass);
  } catch {}
}

export function verifyAdminPassword(pass: string): boolean {
  return pass === getAdminPassword();
}

export function getAllCustomImages(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function getCustomImage(key: string): string | null {
  const all = getAllCustomImages();
  return all[key] || null;
}

export async function saveCustomImage(targetKey: string, dataUrl: string): Promise<string> {
  // 1. Save to local storage for instant availability
  const all = getAllCustomImages();
  all[targetKey] = dataUrl;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.warn('localStorage full or quota exceeded', e);
  }

  // 2. Try saving to server file system if Vite dev server is running
  try {
    const res = await fetch('/api/admin/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId: targetKey, dataUrl }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        all[targetKey] = data.url;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        return data.url;
      }
    }
  } catch {}

  return dataUrl;
}

export function deleteCustomImage(targetKey: string): void {
  const all = getAllCustomImages();
  delete all[targetKey];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}
}

export function exportCustomImagesJSON(): string {
  return JSON.stringify(getAllCustomImages(), null, 2);
}

export function importCustomImagesJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed === 'object' && parsed !== null) {
      const current = getAllCustomImages();
      const merged = { ...current, ...parsed };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return true;
    }
  } catch {}
  return false;
}
