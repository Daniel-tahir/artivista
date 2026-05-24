import type { AdminArtwork } from "@/types/admin/artwork";
import { buildScannedArtworkLibrary } from "@/data/admin/artwork-library";
import { normalizeArtwork } from "@/utils/admin/normalize-artwork";

const ADMIN_STORAGE_KEY = "artivistaa.admin.artworks";

interface PersistedAdminArtworkState {
  customArtworks: AdminArtwork[];
  artworkOverrides: Record<string, AdminArtwork>;
  deletedArtworkIds: string[];
}

export const getAdminStorageKey = () => ADMIN_STORAGE_KEY;

const createDefaultState = (): PersistedAdminArtworkState => ({
  customArtworks: [],
  artworkOverrides: {},
  deletedArtworkIds: [],
});

export const loadAdminArtworkState = (): PersistedAdminArtworkState => {
  if (typeof window === "undefined") {
    return createDefaultState();
  }

  const storedValue = window.localStorage.getItem(ADMIN_STORAGE_KEY);

  if (!storedValue) {
    return createDefaultState();
  }

  try {
    const parsed = JSON.parse(storedValue) as Partial<PersistedAdminArtworkState>;
    const normalizedCustomArtworks = Array.isArray(parsed.customArtworks)
      ? parsed.customArtworks
          .filter((artwork): artwork is Partial<AdminArtwork> & { category: string } => Boolean(artwork?.category))
          .map((artwork) => normalizeArtwork(artwork))
      : [];
    const normalizedArtworkOverrides = Object.fromEntries(
      Object.entries(parsed.artworkOverrides ?? {})
        .filter(([, artwork]) => Boolean(artwork?.category))
        .map(([id, artwork]) => [id, normalizeArtwork({ ...artwork, id })]),
    ) as Record<string, AdminArtwork>;

    return {
      customArtworks: normalizedCustomArtworks,
      artworkOverrides: normalizedArtworkOverrides,
      deletedArtworkIds: Array.isArray(parsed.deletedArtworkIds) ? parsed.deletedArtworkIds : [],
    };
  } catch {
    return createDefaultState();
  }
};

export const buildResolvedAdminArtworks = (state: PersistedAdminArtworkState): AdminArtwork[] => {
  const deletedIds = new Set(state.deletedArtworkIds);

  const scannedLibrary = buildScannedArtworkLibrary()
    .filter((artwork) => !deletedIds.has(artwork.id))
    .map((artwork) => normalizeArtwork(state.artworkOverrides[artwork.id] ?? artwork));

  const customArtworks = state.customArtworks
    .filter((artwork) => !deletedIds.has(artwork.id))
    .map((artwork) => normalizeArtwork(artwork));

  return [...customArtworks, ...scannedLibrary];
};

export const saveAdminArtworkState = (state: PersistedAdminArtworkState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state));
};
