/**
 * Geographic proximity linking engine.
 * Instead of always linking to the same top-N communes (Lille, Tourcoing, Roubaix...),
 * this module links each commune to its actual geographic neighbors based on INSEE code proximity.
 * 
 * INSEE codes in the Nord (59xxx) are roughly assigned geographically,
 * so sorting by absolute difference in INSEE code gives a reasonable geographic proximity.
 */

export interface CommuneData {
  nom: string;
  slug: string;
  codeInsee: string;
  codePostal: string;
  population: number;
}

/**
 * Returns the N geographically closest communes to the given commune,
 * sorted by INSEE code proximity (a decent geographic proxy for the same department).
 */
export function getNearbyCommunes(
  currentSlug: string,
  allCommunes: CommuneData[],
  count: number = 8
): CommuneData[] {
  const current = allCommunes.find(c => c.slug === currentSlug);
  if (!current) return allCommunes.filter(c => c.slug !== currentSlug).slice(0, count);

  const currentInsee = parseInt(current.codeInsee, 10);
  const currentPostal = parseInt(current.codePostal, 10);

  return allCommunes
    .filter(c => c.slug !== currentSlug)
    .map(c => {
      const insee = parseInt(c.codeInsee, 10);
      const postal = parseInt(c.codePostal, 10);
      // Weighted distance: postal code proximity (geographic) + INSEE proximity
      const postalDist = Math.abs(postal - currentPostal);
      const inseeDist = Math.abs(insee - currentInsee);
      // Postal codes are more geographically meaningful, so weight them more
      const distance = postalDist * 3 + inseeDist;
      return { commune: c, distance };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map(item => item.commune);
}

/**
 * Returns a mix of nearby communes + a few high-population communes
 * to ensure both geographic relevance and PageRank distribution.
 */
export function getSmartNearbyCommunes(
  currentSlug: string,
  allCommunes: CommuneData[],
  nearbyCount: number = 6,
  topCount: number = 2
): CommuneData[] {
  const nearby = getNearbyCommunes(currentSlug, allCommunes, nearbyCount);
  const nearbySlugs = new Set([currentSlug, ...nearby.map(c => c.slug)]);
  
  // Add a few high-population communes that aren't already in the nearby list
  const topCities = allCommunes
    .filter(c => !nearbySlugs.has(c.slug))
    .sort((a, b) => b.population - a.population)
    .slice(0, topCount);

  return [...nearby, ...topCities];
}
