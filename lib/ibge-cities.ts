/**
 * IBGE Cities API with Cache and Fallback
 *
 * Implements robust city loading with:
 * - LocalStorage cache (TTL: 7 days)
 * - 5s timeout for API requests
 * - Manual input fallback
 * - Input normalization (trim, capitalize, max 100 chars)
 */

const CACHE_KEY_PREFIX = 'ibge_cities_';
const CACHE_TTL_DAYS = 7;
const API_TIMEOUT_MS = 5000;

interface CacheEntry {
  cities: string[];
  timestamp: number;
}

/**
 * Verifica se o cache ainda é válido
 */
function isCacheValid(timestamp: number): boolean {
  const now = Date.now();
  const maxAge = CACHE_TTL_DAYS * 24 * 60 * 60 * 1000; // 7 dias em ms
  return now - timestamp < maxAge;
}

/**
 * Busca cidades do cache
 */
function getCitiesFromCache(uf: string): string[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = window.localStorage.getItem(`${CACHE_KEY_PREFIX}${uf}`);
    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);

    if (!isCacheValid(entry.timestamp)) {
      // Cache expirado, remove
      window.localStorage.removeItem(`${CACHE_KEY_PREFIX}${uf}`);
      return null;
    }

    return entry.cities;
  } catch (error) {
    console.error('[IBGE Cache] Error reading cache:', error);
    return null;
  }
}

/**
 * Salva cidades no cache
 */
function saveCitiesToCache(uf: string, cities: string[]): void {
  if (typeof window === 'undefined') return;

  try {
    const entry: CacheEntry = {
      cities,
      timestamp: Date.now(),
    };

    window.localStorage.setItem(`${CACHE_KEY_PREFIX}${uf}`, JSON.stringify(entry));
  } catch (error) {
    console.error('[IBGE Cache] Error saving cache:', error);
  }
}

/**
 * Busca cidades da API do IBGE com timeout
 */
async function fetchCitiesFromAPI(uf: string): Promise<string[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`IBGE API returned ${response.status}`);
    }

    const data = await response.json();
    const cities = data.map((city: { nome: string }) => city.nome).sort();

    return cities;
  } catch (error) {
    clearTimeout(timeoutId);

    if ((error as Error).name === 'AbortError') {
      throw new Error('IBGE API timeout (5s)');
    }

    throw error;
  }
}

/**
 * Busca cidades de uma UF (com cache e fallback)
 *
 * @param uf - UF (ex: "SP", "RJ")
 * @returns Array de cidades ordenadas alfabeticamente
 * @throws Error se API falhar e não houver cache
 */
export async function fetchCities(uf: string): Promise<string[]> {
  if (!uf) return [];

  // 1. Tenta buscar do cache
  const cached = getCitiesFromCache(uf);
  if (cached) {
    return cached;
  }

  // 2. Tenta buscar da API
  try {
    const cities = await fetchCitiesFromAPI(uf);
    saveCitiesToCache(uf, cities);
    return cities;
  } catch (error) {
    console.error('[IBGE] Failed to fetch cities:', error);

    // 3. Se falhar, retorna array vazio (fallback para input manual)
    return [];
  }
}

/**
 * Normaliza input manual de cidade
 *
 * - Remove espaços extras (trim)
 * - Capitaliza primeira letra de cada palavra
 * - Limita a 100 caracteres
 *
 * @example
 * normalizeCityInput("  sÃo paulo  ") → "São Paulo"
 */
export function normalizeCityInput(input: string): string {
  if (!input) return '';

  // Remove espaços extras e limita a 100 caracteres
  let normalized = input.trim().slice(0, 100);

  // Capitaliza primeira letra de cada palavra
  normalized = normalized
    .toLowerCase()
    .split(' ')
    .map((word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

  return normalized;
}

/**
 * Limpa todo o cache de cidades
 */
export function clearCitiesCache(): void {
  if (typeof window === 'undefined') return;

  try {
    const keys = Object.keys(window.localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        window.localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('[IBGE Cache] Error clearing cache:', error);
  }
}
