# The family map

The family map is the shared engine's map page (`map.html`), turned on in `Italian-Family-History/site.config.json` the same way as on the FitzMaurice and Kohlmann sites. It reads one places dataset, `Italian-Family-History/data/places.json`, plus the `placeId` on each fact in `people.json`. Nothing on the map is typed in by hand anywhere else.

## How the places were checked (26 November 2026)

The dataset started as the address directory of 25 November (`docs/address-directory.md`) and was brought up to date with main after pull requests 19 to 22. Every place was then checked one by one:

- **Every place has coordinates and a coordinate source.** Sources are cited by id in `coordinateSourceIds`: `osm-nominatim-2026` (OpenStreetMap Nominatim), `census-geocoder-2026` (the US Census Bureau geocoder, for street addresses) and `osm-photon-2026` (Photon, an OpenStreetMap search). These place an address on today's map. They are never a source for who lived where.
- **Precision is said plainly.** A known house or building is a pin (`drawAs: pin`). A place known only roughly is a dashed pin with a circle (`halo`), sized by `uncertaintyMetres`. A county, region or country is an `area`.
- **No guessing.** When a street or building from a record could not be found on today's map, the circle covers the town the record names, and `coordinateMethod` says so. A possible modern match is mentioned there as a lead, never used for the point.
- **Every pin mirrors the tree.** A place event that matches a fact in `people.json` names it in `factRef`, and that fact carries the same `placeId`, so the map never says more than the tree. Events that only the dataset records (burials, the WWI honor roll) keep their own dates and sources.
- **People.** Living people are not given places. The two who were already in the directory (Robert, who grew up around New Rochelle, a family memory; David, golfing privileges at the Country Club of Detroit in 1963) stay as they were. Seb's own home is not on the map and must never be added.

## What changed on 26 November

Placed more closely or for the first time:

| Place | Now | How |
| --- | --- | --- |
| Vico Passaro, San Bartolomeo in Galdo (Michael's birth, 1884) | the lane itself, 75 m circle | A lane called Vico Passaro still climbs through the old town, which supports the reading of the birth act. The house number is not placed. |
| 39 Albemarle, New Rochelle (the family home in 1925) | Albemarle Avenue, 150 m circle | US Census geocoder. The census gives no street type, and numbering may have changed. |
| 251 West Maple Avenue, Birmingham, Michigan (Sammy and Virginia's wedding, 1930) | pin | US Census geocoder and Nominatim agree; today it is West Maple Road. |
| Wykagyl Country Club, New Rochelle (Sammy's first golf job) | pin, 1195 North Avenue | US Census geocoder and Photon. |
| Shenecossett Country Club (Sammy, 1942) | Shennecossett Golf Course, Groton, Connecticut | Nominatim. It is across the river from New London. |
| Kercheval near Conner, Detroit (Frank, 1942) | the corner, 150 m circle | Photon. |
| Saginaw Country Club (Joe, 1934) | the club today, 400 m circle | Nominatim. Where the club stood in 1934 is not checked. |

Drawn as a circle over the town because the street or building was not found today: 114 Winyah Avenue (a Winyah Terrace exists today), 8 Banks Street, 260 in Sidney Williams's household and 216 in the 1950 census (no street on the record), Dean Street in Mamaroneck (a Deane Place exists today), 3 Fair Oaks (circle over Premium Point), 276 in Grosse Pointe Woods, Strada Borgo in San Bartolomeo, Cedar Hill Cemetery in Birmingham, Cedar Hill Memory Gardens near Daytona Beach, Daytona Highlands, and the Wykagyl Gardens apartments.

Also: Michael's birth is drawn once, at Vico Passaro (two town-level copies were removed). Donato Circelli, Vincenza Minichillo, Antonia Circelli, Francesco and Brigida Mansolino, and Patrick Hennessy's probable death in 1947 were added to the map.

## Not on the map, and why

- The 1905 census address read as house 62, Cottage Place: the street reading is unverified, so it stays off until it is checked against the image. Cottage Place does exist in New Rochelle today.
- Lena's birth in New Rochelle (1901) and Jeffery's death in Fair Haven, Vermont (1982) are unverified, and Dorothy Paternostro's birthplace is "Connecticut or Massachusetts". These appear in the map's "Not yet on the map" list.

## The home region

The map opens on New Rochelle and New York (`map.home`), where most of the family's places are. Italy, Ireland, Connecticut, Michigan, Florida and the rest are on the "Beyond" chip. `inHomeRegion` in `places.json` follows those bounds.

## Checks

`tests/verify-map.js` runs against the built site: coordinates and sources for every place, no em or en dashes, every placeId resolves, no new living people and no place for Seb, every place with events drawn, filters, families, person search, timeline, list and tray, and no page errors at 1440, 820 and 390 pixels.
