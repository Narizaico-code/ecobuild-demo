import { fetchCatalog } from "./catalogApi";
import { supabaseConfigured } from "./supabaseClient";
import { applyCatalogRows, materiales as seedMateriales } from "../data";
import {
  enriquecer,
  rebuildFichaIndices,
  setMaterialesCompletos,
} from "../data/enriquecimiento";
import { rebuildCertStats } from "../data/certificaciones";

/** True cuando el catálogo en memoria viene de Postgres. */
export let remoteCatalog = false;

/**
 * Si hay URL + anon key, reemplaza el catálogo JSON por Postgres.
 * Si la DB está vacía o falla, se deja el dataset local para no romper la UI.
 */
export async function hydrateCatalog() {
  if (!supabaseConfigured) {
    remoteCatalog = false;
    return;
  }
  try {
    const loaded = await fetchCatalog();
    if (!loaded.materiales.length) {
      remoteCatalog = false;
      return;
    }
    applyCatalogRows(loaded.materiales, loaded.proveedores);
    setMaterialesCompletos(loaded.completos);
    rebuildFichaIndices();
    rebuildCertStats();
    remoteCatalog = true;
  } catch (err) {
    console.warn("EcoBuild: catálogo local (Supabase no disponible)", err);
    setMaterialesCompletos(seedMateriales.map(enriquecer));
    rebuildFichaIndices();
    rebuildCertStats();
    remoteCatalog = false;
  }
}
