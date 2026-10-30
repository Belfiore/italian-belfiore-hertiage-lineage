# Family canvas audit

October 2026. This file records what the rebuild of the family canvas found, what it changed, and what is still open. It goes with:

- `Italian-Family-History/data/people.json` (61 people), the only source of people data for the canvas, the side drawer and the profile pages
- `Italian-Family-History/data/sources.json` (66 sources)
- `Italian-Family-History/tree-canvas.html`, `.css` and `.js` (the rebuilt canvas)
- `tests/verify-canvas.js` (automated checks)

Confidence words used here and on the site:

- **confirmed**: stated in a record in this collection that has been read for this revision
- **probable**: the best reading of the evidence, but not stated outright in a record
- **family tradition**: what the family says, with no document yet
- **unverified**: on earlier versions of the site, with no source recorded

## 0. What was read

- Pages: `index.html`, `immigration.html`, `golfing-brothers.html`, `research.html`, `family-tree.html`, and the old `tree-canvas.html`
- Scripts and data: `script.js` (the old person bios used by `family-tree.html`), `family-data.js` (the old canvas data)
- Documents: `belfiore-circelli-family-history.md` (the research report), `product-docket.md`
- Every image in `images/`, and the three PDFs in `pdfs/`
- The Project PDFs `Balfiore 1, 4, 5, 7, 11 to 23` (NewsBank printouts from the Daytona Beach papers and Seb's research notes). They are zips of page images, so each page was extracted and read.

Gaps in the inputs:

- **`family-overview.md` does not exist** in the repository or in the Project files. The research report (`belfiore-circelli-family-history.md`) was used as the overview instead. If a separate overview exists, it was not reviewed.
- **`Balfiore 3.pdf`** is in the Project but was too large to open in this session (over 16 MB). Its contents have not been reviewed.
- `Balfiore 2, 6, 8, 9 and 10` are not in the Project. They may never have existed, or they may be missing.
- The NewsBank printouts are cited as sources but are **not** published in the repository, because NewsBank content is copyrighted.

## A. Person inventory

"Old canvas" is what `family-data.js` showed (birth to death). "Named on pages" is an automated name match across the five content pages, so treat it as approximate. "Sources cited" counts distinct sources behind the profile's dates, facts, timeline and story, not counting general historical context. "Profile" is the length of the written story: thin is under about 400 characters.

Living people are shown with name and relationship only. For them the table says only whether the old canvas showed a birth year or a street address, without repeating the values. Neither is shown on the new canvas.

| Person | id | Old canvas (family-data.js) | Old bio (script.js) | Named on pages | Now shown | Sources cited | Media | Confidence | Profile |
|---|---|---|---|---|---|---|---|---|---|
| Giuseppe Circelli | giuseppe-circelli | ? to ~1884 | no | index, immigration, research | ? to before 1884 | 2 | 1 | confirmed | moderate |
| Marianna Mita | marianna-mita | ? to ~1884 | no | index, immigration, research | ? to before 1884 | 2 | 1 | probable | moderate |
| Leonardantonio Belfiore | leonardantonio-belfiore | ~1857 to 1938 | yes | index, immigration, golfing-brothers, research, family-tree | ~1860 to 1938? | 10 | 1 | probable | full |
| Maria Donata Circelli | maria-donata-circelli | ~1862 to ? | yes | index, immigration, research, family-tree | ~1862 to ? | 10 | 3 | confirmed | full |
| Salvatore Circelli | salvatore-circelli | ~1874 to ? | no | index, immigration | ~1869 to ? | 4 | 4 | probable | full |
| Michele Circelli | michele-circelli | ~1874 to ? | no | index, immigration | ~1873 to ? | 5 | 3 | probable | moderate |
| Michael Kirtus Belfiore | michael-belfiore | 1885 to 1952 | yes | index, immigration, golfing-brothers, research, family-tree | Dec 15, 1885 to Jan 16, 1952 | 8 | 4 | confirmed | full |
| First wife of Michael | first-wife-of-michael | ? to ? | yes | index, golfing-brothers | ? to ? | 2 | 1 | family tradition | moderate |
| Frances Towey | frances-towey | ~1898 to 1967 | yes | index, immigration, golfing-brothers, research, family-tree | Sep 17, 1897 to Apr 5, 1967 | 4 | 1 | confirmed | moderate |
| Dorothy Belfiore | dorothy-belfiore-bridgeport | ~1914 to ? | yes | index, research, family-tree | ~1914? to ? | 2 | 1 | probable | moderate |
| Edward Belfiore | edward-belfiore | ~1923 to ? | yes | index, golfing-brothers, research, family-tree | ~1920 to ? | 1 | 1 | confirmed | moderate |
| Joseph Belfiore | joseph-belfiore | ~1928 to 1986 | yes | index, golfing-brothers, research | ~1922 to 1986 | 5 | 1 | confirmed | full |
| Dorothy Hennessey Belfiore | dorothy-hennessey-belfiore | ? to ? | yes | index, family-tree | ? to ? | 2 | 0 | family tradition | moderate |
| Frank Belfore | frank-belfore | ~1897 to 1968 | yes | index, immigration, golfing-brothers, research, family-tree | Nov 1897 to Apr 21, 1968 | 5 | 3 | confirmed | full |
| Joseph "Joe" Belfore | joe-belfore | ~1895 to 1963 | yes | index, golfing-brothers, family-tree | ~1895? to 1963 | 10 | 9 | confirmed | full |
| Ruth Belfore | ruth-belfore | ? to ? | yes | index, golfing-brothers, family-tree | ? to ? | 1 | 1 | probable | moderate |
| Sammy Belfore | sammy-belfore | 1899 to ~1971 | yes | index, immigration, golfing-brothers, research, family-tree | Dec 25, 1899 to Feb 16, 1972 | 19 | 5 | confirmed | full |
| Virginia Hupp | virginia-hupp | ? to ? | yes | index, golfing-brothers, research, family-tree | ? to ? | 3 | 0 | confirmed | moderate |
| Louisa Belfore | louisa-belfore | not on old canvas | no | none | ? to ? | 2 | 0 | probable | moderate |
| Rose Belfiore | rose-belfiore | ~1903 to ? | yes | index, immigration, research, family-tree | ~1903? to ? | 2 | 1 | confirmed | moderate |
| Caroline Belfiore | caroline-belfiore | ~1903 to ? | yes | index, immigration, research, family-tree | ~1903? to ? | 3 | 1 | confirmed | moderate |
| Mollie Drew | mollie-drew | ~1900 to ? | yes | index, research, family-tree | ~1900? to ? | 2 | 1 | confirmed | thin |
| Anthony Drew | anthony-drew | ? to ? | no | index, research, family-tree | ? to ? | 1 | 0 | confirmed | thin |
| Philomena "Phyl" Paternostro | phyl-paternostro | ~1900 to ? | yes | index, research, family-tree | ~1900? to ? | 3 | 1 | confirmed | moderate |
| Angelo Paternostro | angelo-paternostro | ? to ? | no | index, research, family-tree | ? to ? | 1 | 0 | confirmed | thin |
| Mary D'Onofrio | mary-donofrio | ~1900 to ? | yes | index, research, family-tree | ~1900? to ? | 2 | 1 | confirmed | thin |
| Joseph D'Onofrio | joseph-donofrio | ? to ? | no | index, research, family-tree | ? to ? | 1 | 0 | confirmed | thin |
| Lena Belfiore | lena-belfiore | ? to ? | yes | research, family-tree | ~1901 to ? | 3 | 0 | unverified | moderate |
| David Belfore | david-belfore | showed a birth year, showed a street address | yes | index, golfing-brothers, research, family-tree | living (dates withheld) | 2 | 1 | confirmed | moderate |
| Judith Ann Sattelmeier | judith-sattelmeier-belfore | ? to 2023 | no | none | ? to Nov 3, 2023 | 1 | 0 | confirmed | thin |
| Joseph F. "Jeffery" Belfore Jr. | jeffery-belfore | 1917 to ~1982 | yes | index, golfing-brothers, family-tree | 1917? to 1982? | 2 | 1 | confirmed | moderate |
| Patricia Hupp Fleming | patricia-hupp-fleming | 1933 to 2022 | yes | golfing-brothers, research, family-tree | Jun 11, 1933 to Jan 1, 2022 | 4 | 0 | confirmed | moderate |
| John Fleming | john-fleming | no dates | no | none | living (dates withheld) | 1 | 0 | probable | thin |
| Samuel M. Belfore Jr. | samuel-belfore-jr | ~1935 to ~2025 | yes | golfing-brothers, research, family-tree | Nov 20, 1944 to 2024–25? | 4 | 0 | confirmed | moderate |
| Julia Clair Belfore | julia-clair-belfore | no dates | no | golfing-brothers, research | living (dates withheld) | 1 | 0 | probable | thin |
| Robert Belfiore | robert-belfiore | no dates | yes | index, research, family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| William Belfiore | william-belfiore | showed a birth year | yes | research, family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Susan Belfiore | susan-belfiore | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Beth Belfiore | beth-belfiore | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Karen Carpenter | karen-carpenter | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Bill Carpenter | bill-carpenter | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Barb Hartman | barb-hartman | no dates | no | none | living (dates withheld) | 1 | 0 | confirmed | thin |
| Gary Belfore | gary-belfore | no dates | no | none | living (dates withheld) | 1 | 0 | confirmed | thin |
| Jill Pappas | jill-pappas | no dates | no | none | living (dates withheld) | 1 | 0 | confirmed | thin |
| Lisa Fleming | lisa-fleming | no dates | yes | golfing-brothers, research, family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Chris Fleming | chris-fleming | no dates | yes | golfing-brothers, research, family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| John Fleming Jr. | john-fleming-jr | no dates | yes | golfing-brothers, research, family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Geoff Fleming | geoff-fleming | no dates | yes | golfing-brothers, research, family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Seb Belfiore | seb-belfiore | showed a birth year | yes | index, golfing-brothers, research, family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Valeria Belfiore | valeria-belfiore | no dates | yes | index, family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Alexander Belfiore | alexander-belfiore | showed a birth year | yes | index, golfing-brothers, research, family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Lauren Belfiore | lauren-belfiore | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Christian Carpenter | christian-carpenter | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Loredana Belfiore | loredana-belfiore | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Dani Belfiore | dani-belfiore | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Ionel Belfiore | ionel-belfiore | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Ramona Belfiore | ramona-belfiore | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Michaela Belfiore | michaela-belfiore | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Aidan Belfiore | aidan-belfiore | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Enzo Belfiore | enzo-belfiore | showed a birth year | yes | index, research, family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |
| Violet Belfiore | violet-belfiore | no dates | yes | family-tree | living (dates withheld) | 1 | 0 | confirmed | thin |

### Media and who it is attached to

| File | What it is | Source id | Shown on |
|---|---|---|---|
| `images/attodi-nascita-maria-circelli-marriage-certificate2.png` | Marriage act no. 16, San Bartolomeo in Galdo, January 27, 1884 | marriage-1884 | Giuseppe Circelli, Marianna Mita, Leonardantonio Belfiore, Maria Donata Circelli |
| `images/maria doreta circelli.png` | Ellis Island index entry for "Circelli, Maria Doreta", SS Oregon, December 2, 1896 | oregon-1896-index | Maria Donata Circelli |
| `images/maria-doreta-circelli-immigration-ship-paper.png` | A Customs List of Passengers page shared as the SS Oregon list. Maria Doreta's own line (413) is not on this page. | customs-list-page | Maria Donata Circelli |
| `images/michele-salvatore-ship-list-highlighted.png` | SS Alsatia manifest, list 128, arrived New York March 19, 1898. Salvatore and Michele Circelli on lines 8 and 9. | alsatia-1898 | Salvatore Circelli, Michele Circelli |
| `images/salvatore-circelli-alsatia-1898-index.png` | Ellis Island index entry for Salvatore Circelli, SS Alsatia, 1898 | alsatia-1898-index | Salvatore Circelli |
| `images/alsatia-1898-passenger-list-text.png` | Ellis Island text list for the Alsatia, lines 1 to 10, giving residence "S.Dartolomeo in Calor" | alsatia-1898-index | Salvatore Circelli, Michele Circelli |
| `images/salvatore-circelli-santanna-1911-manifest.png` | SS Sant'Anna manifest, Naples, November 14, 1911. Salvatore Circelli, 42, bound for New Rochelle. | santanna-1911 | Salvatore Circelli |
| `images/Michele Circelli.png` | Ellis Island index entry for Michele Circelli, SS Alsatia, 1898 | alsatia-1898-index | Michele Circelli |
| `images/michael-kirtus-belfiore-registration-card.jpeg` | Michael Kirtus Belfiore's World War I draft registration card, September 12, 1918 (front and registrar's report) | ww1-michael | Michael Kirtus Belfiore, First wife of Michael, Dorothy Belfiore |
| `images/Michael-Belfiore-Census-1940-painter.jpeg` | 1940 US Census, New Rochelle, sheet 1B. The Belfiore household is on lines 29 to 32. | census-1940 | Michael Kirtus Belfiore, Frances Towey, Edward Belfiore, Joseph Belfiore |
| `images/Michael-Belfiore-WW2-Draft-Card.jpeg` | Michael Belfiore's World War II draft registration card, April 1942 | ww2-michael | Michael Kirtus Belfiore |
| `images/samme-belfiore-golfer.jpeg` | "Sammy Belfore, Last Of 3 Golfing Brothers", The Standard-Star, February 1972 | standard-star-obit | Michael Kirtus Belfiore, Frank Belfore, Sammy Belfore, Rose Belfiore, Caroline Belfiore, Mollie Drew, Philomena "Phyl" Paternostro, Mary D'Onofrio |
| `images/thumbs/golfdom-1948-02.jpg` | Golfdom, February 1948, page 59: Sammy's article, with the photograph of Sammy and (right) Frank in the Seabreeze shop | golfdom-1948-02 | Frank Belfore, Sammy Belfore |
| `images/belfiore-golf-brothers-upright.jpg` | Three men in light suits on a golf course. The family believes they are Sammy, Frank and Joe; no one is identified with certainty. | golf-brothers-photo | Frank Belfore, Joseph "Joe" Belfore, Sammy Belfore |
| `images/joe-book-4.jpeg` | Golfing Aids (1940), signed "Sincerely, Joe Belfore, Detroit, Michigan, April 4, 1940", with his portrait | golfing-aids-1940 | Joseph "Joe" Belfore |
| `images/joe-book-1.jpeg` | Golfing Aids by Joe Belfore (1940), front cover | golfing-aids-1940 | Joseph "Joe" Belfore |
| `images/joe-book-3.jpeg` | Title page: "Golfing Aids by Joe Belfore, Professional, Country Club of Detroit. Price twenty-five cents." | golfing-aids-1940 | Joseph "Joe" Belfore |
| `images/joe-book-5.jpeg` | Golfing Aids, pages 4 and 5: Joe demonstrating the drive and a fairway wood | golfing-aids-1940 | Joseph "Joe" Belfore |
| `images/joe-book-2.jpeg` | Golfing Aids, cover | golfing-aids-1940 | Joseph "Joe" Belfore |
| `images/joe-book-6.jpeg` | Provenance letter for the signed copy of Golfing Aids, signed by Bob Denney, February 13, 2025 | pga-reach-letter-2025 | Joseph "Joe" Belfore |
| `images/frank-belfore-michigan-golfcourse2.jpg` | Country Club of Detroit, Board of Governors minutes, October 29, 1963 (first page) | ccd-minutes-1963 | Joseph "Joe" Belfore |
| `images/frank-belfore-michigan-golfcourse.jpg` | Country Club of Detroit minutes, page 265: the Golf, Grounds and Greens Committee report on Joe Belfore's death | ccd-minutes-1963 | Joseph "Joe" Belfore, Ruth Belfore, David Belfore, Joseph F. "Jeffery" Belfore Jr. |
| `images/thumbs/golfdom-1948-01.jpg` | Golfdom, January 1948: Herb Graffis's "Making the Swing" column | golfdom-1948-01 | Sammy Belfore |
| `images/thumbs/ouse-russell.jpg` | David Ouse, "Clint Russell": the biography that places Sammy at Ridgeview Country Club, Duluth | ouse-russell | Sammy Belfore |

### Facts in the research report that are not on the site

These come from `belfiore-circelli-family-history.md` and were not carried into the canvas, either because they are about people who are not on the tree or because they are leads rather than findings. None has been checked against an original record.

- A second Anthony Belfiore died on September 15, 1938, in Beacon, New York (certificate 51555). He is a different man from the Anthony who died in New Rochelle on July 11, 1938. Worth remembering when ordering the certificate.
- Govanni (Giovanni) Cicelli, 1858 to 1906, is on Find a Grave at Holy Sepulchre Cemetery, New Rochelle (memorial 175634192). Cicelli is the same spelling Sammy's obituary uses for Maria Donata. He could be a relative, but nothing links him yet.
- Antonio Maria Circelli, born February 20, 1862, to Bartolomeo Circelli and Laura Pannone. His birth act is the image saved as `attodi-nascita-maria-circelli-marriage-certificate.png` (see section C).
- The Leonardo Circelli and Rosa Pacifico household also had sons Bartolomeo (1873), Donato (1875) and Pasquale (1880).
- Later San Bartolomeo families in New Rochelle: Natalina Circelli, born Apicella (1935 to 2023), and Antonio Apicella (1931 to 2007), whose mother was a Circelli.
- St. Joseph's Church, New Rochelle, founded in 1901, was the Italian parish. Its baptism and marriage registers are a good place to look for the younger children and the sisters' marriages.
- Two other Joseph Belfiores were considered as Seb's grandfather: one who died in 2016 near Spring Hill, Florida (born 1926), and Joseph J. Belfiore (1925 to 2010) of Lindenhurst, New York. Both conflict with the family's account of a 1986 death and with the 1940 census age. They are not used.

## B. Conflicts and errors

Each item gives the conflict, what the site now shows, and a recommendation. "Corrected" means existing page text was changed because a legible record contradicts it. "Flagged" means the text was kept and an update note was added beside it.

### People and identity

1. **Leonardantonio and Anthony (working identification).** The 1884 marriage act names the groom Leonardantonio (written Lionardantonio). Every American record names the father of the children Anthony or Antonio: Michael's 1952 death certificate, Sammy's obituary, and the indexed records for Frank and Lena. Michael's 1918 draft card says he became a citizen through his father's papers, so his father was in the United States and naturalized before about 1906. Earlier research found a "Belfiore, Antonio" of San Bartolomeo returning as a US citizen in 1909, and the state death index has an Anthony Belfiore who died in New Rochelle on July 11, 1938 (certificate 42184).
   - *Shown:* the working identification, marked **probable**, with the evidence listed on his profile. It is not presented as proven. The father link to the eight children born in New Rochelle depends on it.
   - *Would confirm it:* his naturalization file (Westchester County court records, or a NARA or USCIS index search), his 1938 death certificate (age, birthplace, informant), or the 1900 census, which records each immigrant's year of arrival.
2. **The widow theory.** `index.html`, `immigration.html` and `script.js` argued that Leonardantonio died in Italy before 1896 because Maria Donata crossed as Circelli. Italian women kept their birth surnames in civil and travel records, so this is not evidence of widowhood. Frank (November 1897) and Sammy (December 1899) were born in New Rochelle to a father named Anthony. *Flagged:* the original paragraphs are kept, and update notes now give the working view.
3. **Michael's birth year.** 1885 on the 1918 card and the death certificate transcription; 1883 on the 1942 card; the 1940 census age of 55 fits 1884 or 1885. His parents married in January 1884, so 1885 is the easier fit. *Shown:* December 15, 1885, with 1883 as an alternate, each cited. *Next:* his Italian birth record, probably as Michele, in the San Bartolomeo registers for 1883 to 1885 on Antenati.
4. **Two Josephs.** Joe Belfore the golfer (Michael's brother, died 1963) and Joseph Belfiore (Michael's son, Seb's grandfather). They are separate profiles with disambiguators on both cards. The claim that the younger Joseph was named after his uncle came from earlier versions of the site with no source, so it is now marked **unverified**.
5. **Two Dorothys.** Dorothy Belfiore of Bridgeport, named as Michael's child on his 1918 card, and Dorothy Hennessey, Joseph's wife and Seb's grandmother. Separate profiles, each pointing to the other. `index.html` called Seb's grandmother "née unknown" while the bios say Hennessey; *corrected* to Hennessey.
6. **The 1898 Alsatia Circellis are not Michael.** Michele Circelli was 25 in 1898 and a Circelli; Michael Belfiore was about 12 to 14. Michele has his own profile that says so.
7. **Maria Donata's names and birth year.** Donata (marriage act), Doreta (Oregon index), Cicelli (Standard-Star obituary), Maria D. (Frank and Lena indexes), Maria (Michael's death certificate). Age 21 in January 1884 gives a birth in 1862 or early 1863, and the age of 34 recorded for the Oregon in December 1896 agrees. *Corrected:* `script.js` said about 1856 to 1857, and `research.html` gave the bride's age as 27. The research report repeats 1856 to 1857; it was left as it is (see section E).
8. **Her mother's first name.** Earlier research read it as Marianna Mita. The scan, read closely for this revision, looks more like Mansolina or Marsolina, followed by Mita. *Shown:* Marianna Mita, marked uncertain. *Next:* Maria Donata's own birth act (about 1862) or her parents' marriage act would give the name again in a different hand.
9. **Belfiore and Belfore.** Sammy's obituary says he changed the spelling. Joe used Belfore on Golfing Aids (1940) and in the 1963 club minutes. Frank's own records found so far (the birth index and the 1968 Florida death index) spell it Belfiore; the site calls him Frank Belfore, following earlier versions and his brothers' spelling, and lists Belfiore as his recorded variant. The scorecard explanation is **family tradition** and is labeled that way. Spelling variants are listed on each profile.
10. **Foundling surname, no noble link.** Kept as stated: the marriage act records padre ignoto, madre ignota. The surname starts with Leonardantonio, so the family has no connection to noble Belfiore families. His own birth and foundling admission records have not been found.
11. **Michael's 1918 draft card readings.** `research.html` gave serial 2303, 114 Murray Avenue and 8 Dante Street. The card reads serial 2803 (order 1721, card A1722), 114 Winyah Avenue, and 8 Banks Street. *Corrected* on the Research page. The research report still says Dante Street.
12. **Sammy Jr.** Earlier versions gave Samuel Alexander Belfore Jr., born about 1935, son of Virginia Hupp. A Daytona birthday notice puts his fourth birthday on November 20, 1948, so he was born on November 20, 1944. The 1972 funeral notice gives Samuel M. Belfore. A directory entry names Sammy's wife at the same house as Louisa. *Shown:* born 1944, middle initial M, probable mother Louisa (new profile), with the link to her marked probable. *Corrected* the name on the content pages, with notes. *Next:* his own obituary or death record (Volusia County, late 2024 or early 2025) should name his mother.
13. **Lena.** An indexed record gives Lena Belfiore, born about 1901, with parents Antonio Belfiore and Maria D. Circelli. The Research page calls it the 1940 census, which is not possible as written, because the 1940 census did not record parents' names. *Flagged* with update notes. *Shown:* Lena with a dashed parent link and an **unverified** tag. Hypotheses: she died before 1972, or she is Philomena (Phyl) or Caroline under a pet name. *Next:* the 1910 and 1920 census households.

### Dates and places

14. **Sammy's death.** "About 1971" (old canvas, golfing page) and "1971 or 1972" (Research page). The Daytona Beach Evening News reported his death early on February 16, 1972. *Corrected* everywhere.
15. **Ridgeview Country Club and the Russell match.** The golfing page, the Research page and `script.js` put Ridgeview in Westchester and the 1938 Russell match at Wykagyl, against "Charley Oxenham". The Russell biography (`pdfs/blind-golfer.pdf`) places Ridgeview in Duluth, Minnesota, and the match there on August 20, 1938, against Dr. W. H. J. Oxenham of London. *Corrected* the place and the name. Two statements without sources were kept and *flagged*: that Sammy guided Russell through the 1938 match (the biography names Russell's caddie, Jimmy Koehler, and does not mention Sammy that day), and the 1946 Westchester Open at Ridgeview.
16. **Joseph's birth and death.** The old canvas gave about 1928. In April 1940 he was 17, so he was born in 1922 or early 1923. *Shown:* about 1922. The family places his death in Valrico, Florida, in 1986; the SSDI entry for a Joseph Belfiore who died in April 1986 gives West Babylon, New York, and has not been confirmed as his. *Decision needed* (see section F).
17. **Edward's birth.** About 1923 on the old canvas; 19 in April 1940, so 1920 or early 1921. *Shown:* about 1920.
18. **Frances's birth.** About 1898 on the old canvas; the SSDI gives September 17, 1897, and the 1940 census age of 42 agrees. *Shown:* September 17, 1897.
19. **Leonardantonio's birth.** About 1857 on the old canvas; 23 in January 1884 gives about 1860. *Shown:* about 1860.
20. **Salvatore and Michele's births.** About 1874 for both on the old canvas. The 1898 manifest gives 28 and 25 and the 1911 manifest gives Salvatore 42, so about 1869 and about 1873. The ItalyHeritage index has a Salvatore born January 1, 1869, and a Michele born March 12, 1871, sons of Leonardo Circelli and Rosa Pacifico. Salvatore's ages match; Michele's do not quite. *Shown:* the manifest ages, with the index as a probable identification. If the index is right, they were Maria Donata's cousins, not her brothers.
21. **Joe's birth year.** About 1895 on the old canvas, with no source. Sammy's obituary says Michael was the only brother born in Italy and Maria Donata arrived in December 1896, so Joe was probably born in New Rochelle after that. But the tentative Vermont death index match for his son Jeffery gives a 1917 birth, which would need Joe to be born by about 1897. *Shown:* about 1895 with a question mark. *Next:* Joe in the 1900 and 1910 censuses, or his 1963 Michigan death record.
22. **When Sammy settled in Daytona.** A 1960 column says 1924; his 1972 news obituary says 1938. The 1929 tournament report shows him at Daytona Highlands for the winter season. Both are shown as reported.
23. **The 19th Hole.** The papers give different years for the change from Seabreeze to the bar, from 1947 to 1951. A 1951 directory lists it at 324 Seabreeze Boulevard. Shown as a range.
24. **Sammy's age at death.** One Daytona item gives 73. A Christmas Day 1899 birth makes him 72 in February 1972, which is what the Standard-Star says. *Shown:* 72.
25. **Patricia's place of death.** The golfing page says Birmingham, Michigan; the old canvas gave Atlantis, Florida. Find a Grave gives her burial at Cedar Hill Cemetery, Birmingham, which does not settle where she died. *Shown:* burial only, with an open question.
26. **Patricia's children.** Her obituary (per earlier research) names four children; Sammy's 1972 New Rochelle obituary mentions three grandchildren. One may have been born after February 1972, or the count is wrong. Both are shown.
27. **Michael's arrival.** The death certificate transcription gives 58 years of residence in New Rochelle, which points to about 1894, two years before his mother's crossing. Unresolved; the 1900 census would settle it.

### Claims without support

28. **"Ruth"** as the first name of Joe's wife: the 1963 minutes call her Mrs. Belfore. Kept, marked **unverified**.
29. **The Hupp Motor Car Company link** for Virginia Hupp: no document in the collection. Kept on the golfing page with "(unverified)", and marked unverified on her profile.
30. **Dorothy of Bridgeport's death in the 1918 flu:** speculation. Her profile says so. Her birth estimate of about 1914 also has no source and is shown with a question mark.
31. **Michael's first wife died before he remarried:** no record. Her profile says the marriage may have ended in death or separation.
32. **"The only known photograph of Joe"** (index and golfing pages): Golfing Aids itself has several photographs of him, and the family photograph of three men is believed to include him. *Corrected* to "a signed portrait".
33. **"Michael's draft cards don't reference a living father"** (immigration page): the 1918 card's "Father Papers" points to a naturalized father. *Flagged.*
34. **Sammy's single PGA Tour win**, from his PGA of America profile: cited by earlier research, but no copy is in the repository. Kept, source marked not verified.
35. **Joe's Michigan PGA titles (1933, 1937) and presidency (1959 to 1960)**, from the Michigan PGA centennial history: cited by earlier research and kept, but not re-read for this revision.
36. **The Circelli surname** is called "extremely rare" in `script.js` and "one of the most prominent families" in the research report. Both statements are kept. Neither matters to the tree.

## C. Unattributed and mislabeled content

Nothing here was renamed or removed, because other pages link to these paths. The canvas uses the correct description for each.

- `images/attodi-nascita-maria-circelli-marriage-certificate.png`: not Maria Donata's record. It is the 1862 birth act of **Antonio Maria Circelli**, son of Bartolomeo Circelli and Laura Pannone. He is not tied to anyone on the tree, so it is listed as a source but not attached to a profile.
- `images/attodi-nascita-maria-circelli-marriage-certificate2.png`: the 1884 **marriage** act (atto di matrimonio), not a birth act (atto di nascita), despite the file name.
- `images/maria-doreta-circelli-immigration-ship-paper.png`: a customs passenger list page showing lines 26 to 61. The ship's name is not visible and Maria Doreta's line (413 in the index) is not on it, so it cannot be confirmed as her page. Shown on her profile with that caveat.
- `images/frank-belfore-michigan-golfcourse.jpg` and `...2.jpg`: these are the Country Club of Detroit board minutes of October 29, 1963, about **Joe**, not Frank.
- `pdfs/sammy-belfore-daytona-newspaper.pdf`: a Golfdom magazine note of January 1948, not a Daytona newspaper.
- `images/samme-belfiore-golfer.jpeg`: the Standard-Star obituary clipping. It is undated; the date is inferred from Sammy's death on February 16, 1972.
- `images/belfiore-golf-brothers.jpeg`: three men in light suits on a golf course. The family believes they are Sammy, Frank and Joe; nobody in it is identified with certainty, and the canvas says so. An upright copy (`belfiore-golf-brothers-upright.jpg`) was added for display; the original is unchanged.
- The 1909 Duca di Genova manifest ("Belfiore, Antonio", returning US citizen) is cited by earlier research but **not saved** in the repository.
- Michael's 1952 death certificate: the facts come from a transcription; the scan is not in the repository.

## D. Gaps

The biggest open records, roughly in order of how much they would settle:

1. **1900 census, New Rochelle**: shows whether Anthony was in the household, every immigrant's year of arrival, and all the children at the time.
2. **Anthony Belfiore's 1938 death certificate** (New York State, certificate 42184) and his **naturalization file**: together these confirm or break the working identification.
3. **1910 and 1920 censuses**: settle Lena, Joe's birth year, the sisters' birth years, and where Dorothy of Bridgeport was.
4. **Maria Donata's death record**: not found. A New York death certificate under Maria, Mary or Marie Belfiore, or a burial at Holy Sepulchre.
5. **Michael's Italian birth record** (as Michele, 1883 to 1885) and **Leonardantonio's birth or foundling record** (about 1860), both on Antenati.
6. **Michael's first marriage**: Connecticut or New York marriage indexes about 1910 to 1915, and Dorothy's birth in Bridgeport.
7. **Joseph's 1986 death**: Florida death index (Hillsborough County for Valrico) and his SS-5 application.
8. **Frances's death certificate**: ordered; should name her parents.

### Thin profiles

These people have little beyond one or two mentions in the records gathered so far:

- Mollie Drew, Anthony Drew, Angelo Paternostro, Mary D'Onofrio and Joseph D'Onofrio: known only from Sammy's 1972 obituaries.
- Rose and Caroline Belfiore: obituary mentions only, no dates.
- Judith Ann Sattelmeier: one obituary.
- Ruth (Mrs. Joe) Belfore and Louisa Belfore: one or two lines each, first names uncertain.
- Dorothy Hennessey Belfiore: family knowledge only, no documents.
- Giuseppe Circelli and Marianna Mita: one line in the marriage act.
- Edward Belfiore: one census entry.
- First wife of Michael and Dorothy of Bridgeport: inferred from one line on the 1918 card.
- All living people are thin on purpose: name and relationship only.

## E. Changes made

### Canvas and profiles

- **One data source.** `data/people.json` and `data/sources.json` replace `family-data.js` for the canvas, the drawer and the profiles. Every date, fact and timeline entry carries source ids or a family tradition or unverified label. 618 source references resolve to 66 sources.
- **Layout.** Cards are a fixed size with a photo or initials, the dates and a place line, and long names shrink to fit instead of overflowing. Couples sit side by side with a marriage bar; children hang from the marriage that produced them on an orthogonal sibling bus; Michael's two marriages are shown in order. Large families of childless siblings are stacked in two columns with a spine. Connectors never cross a card (tested).
- **Direct line.** Leonardantonio and Maria Donata, Michael, Joseph, Robert and Seb, and the spouses on the line, have stronger cards and connectors. Hovering or selecting a person highlights their ancestors and descendants and dims the rest.
- **Uncertainty in the UI.** Dashed cards and dashed links for uncertain people and links, confidence tags (confirmed, probable, family tradition, unverified) on every fact, and a key that explains them.
- **Navigation.** Smooth pan and zoom (drag, wheel, trackpad, pinch), fit and center buttons, a minimap, generation labels in their own column, search that matches name variants, arrow-key movement between relatives, Enter to open, Escape to close, and a "relationship to" selector that labels everyone relative to the chosen person.
- **Drawer.** Photo, name and variants, dates and places, summary, media strip, family chips and a "Read full story" link.
- **Profile pages** at `#/person/<id>`: hero, story with numbered footnotes, an at-a-glance table with source and confidence, a timeline with historical context, documents and photos in a lightbox (zoom, caption, record details, and transcription or translation beside the scan), family, open questions, numbered sources, related pages, and previous and next.
- **Stories** were written for every person from the sources only, with no invented detail. They were re-read against the sources for this audit, and a few sentences were cut or rewritten: the "named after his uncle" claim on Joseph's and Joe's profiles (no source, now marked unverified), an editorial remark on Maria Donata's profile, and a line implying the 1948 photograph caption gives Frank's surname. Patricia's place of death was changed to burial only (item 25).
- **Living people** show name and relationship only. No birth years, places or addresses, even where earlier pages showed them.
- **Mobile.** The drawer becomes a full-screen sheet and the canvas starts at a readable zoom on the founding couple.
- **New images** (originals untouched): crops of the Sant'Anna 1911 and Alsatia 1898 index screenshots, an upright copy of the golf brothers photograph, and thumbnails and avatars in `images/thumbs/`.

### Fixes to existing pages

Text was only changed where a legible record contradicts it. Where the text was an interpretation, it was kept and an update note was added next to it (styled by `.update-note` in `styles.css`).

| Page | Change | Basis |
|---|---|---|
| research.html | Bride's age 27 to 21 | 1884 marriage act |
| research.html | WWI card serial 2303 to 2803, 114 Murray Ave to 114 Winyah Ave, 8 Dante St to 8 Banks St (two places) | 1918 card |
| research.html | Sammy's death ~1971/1972 to February 16, 1972 | Daytona Beach Evening News |
| research.html | Two notes on the Lena record and the 1940 census | 1940 census schedule |
| research.html | Samuel Alexander to Samuel M., with note | 1972 funeral notice |
| research.html | Ridgeview placed in Duluth; note on the 1946 Westchester Open | Russell biography |
| golfing-brothers.html | Sammy's death date (three places) | Daytona Beach Evening News |
| golfing-brothers.html | Ridgeview in Duluth; Russell a Duluth businessman; 1938 match at Ridgeview against Dr. W. H. J. Oxenham; heading "The Exhibition Match at Ridgeview"; the PDF description | Russell biography |
| golfing-brothers.html | Notes on where Sammy's career began, on Sammy's role in the 1938 match, and on the 1946 Westchester Open | Standard-Star obituary; Russell biography |
| golfing-brothers.html | Hupp Motor Car link marked unverified | No source in the collection |
| golfing-brothers.html | "Only known photograph" to "a signed portrait" | Golfing Aids photographs |
| golfing-brothers.html | Samuel Alexander to Samuel M. (heading, survivors, profile paragraph) | 1972 funeral notice |
| index.html | Two update notes on the widow theory and the working identification | Section B, items 1 and 2 |
| index.html | "Only known photograph" to "a signed portrait" | Golfing Aids photographs |
| index.html | Dorothy "née unknown" to "née Hennessey", and a note on Joseph's birth and death | Family knowledge; 1940 census; SSDI |
| immigration.html | Update notes on the widow theory and the "Father Papers" answer | 1918 card |
| script.js | Maria Donata born about 1862; widow-theory note; Ridgeview and the 1938 match in Duluth; Sammy's death date; Samuel M.; Lena note; Sammy Jr.'s birth and probable mother | As above |
| family-tree.html | Samuel Alexander to Samuel M. | 1972 funeral notice |

Not edited: `belfiore-circelli-family-history.md` and `product-docket.md` (documents, kept as written; their errors are listed in section B), and `family-data.js` (see below).

### Legacy files

`family-data.js` is no longer loaded by any page, and `family-tree.html` with `script.js` is the older tree. Both were left in place because nothing may be deleted, but they now **drift** from `data/people.json`: any future correction has to be made in the JSON, and the old files will keep the old values. Recommendation: retire `family-tree.html` (or redirect it to the canvas) and remove `family-data.js` once Seb agrees.

### Checks

`tests/verify-canvas.js` starts a local server and checks, with Playwright:

- every source reference resolves; no fact is unsourced unless labeled family tradition or unverified; no em dashes in the data; no dates for living people
- no page errors and no card text overflow at 1440, 1024 and 390 pixels wide
- every connector attaches to the right cards and crosses no card, with one incoming connector per child
- every image, PDF and data path resolves
- all 61 `#/person/` routes open the right profile, with alt text and working footnote links
- the lightbox shows the marriage act with its transcription
- internal links resolve on all six pages

Run it with `NODE_PATH=$(npm root -g) node tests/verify-canvas.js`. Set `SHOTS=1` to save screenshots to `tests/screenshots/`.

Colour contrast was checked against the parchment and paper backgrounds: body and muted text 6.0:1 or better, the gold labels 4.6:1, the confidence tags 6.7:1 or better, and connector lines 3.5:1 (above the 3:1 needed for non-text graphics).

## F. Decisions for Seb

1. **Joseph's death place**: Valrico, Florida (family) or West Babylon, New York (an SSDI entry not yet confirmed as his)? The canvas shows both places, each attributed, and marks the death as probable.
2. **Your great-great-grandmother's first name**: keep Marianna, or show the alternative reading (Mansolina or Marsolina) until a second record settles it?
3. **Sammy Jr.'s mother**: the canvas now shows Louisa as probable. Do you know anything about Louisa, or about where "Alexander" came from?
4. **Lena**: does the family know of a tenth child, or a sister called Lena?
5. **Joe's birth year**: do you have anything that dates it (a Michigan death record, a census)? It decides whether the Vermont match for Jeffery can be right.
6. **The missing files**: is there a `family-overview.md`, and are there `Balfiore 2, 6, 8, 9 and 10`? `Balfiore 3.pdf` needs to be split or re-saved smaller so it can be read.
7. **The 1909 manifest**: please save a copy so the "Antonio Belfiore, returning citizen" line can be checked.
8. **Living people on the older pages**: `index.html`, `script.js`, `family-tree.html` and `family-data.js` still show a birth month and place for your son, birth years for living relatives, the neighbourhood where you live, and a street address for David Belfore. The new canvas shows none of these. They were left in place because the brief said not to delete page content. Decide whether to keep them.
9. **Retiring the old tree**: whether to redirect `family-tree.html` to the canvas and remove `family-data.js`.
10. **Mislabeled files**: whether to rename the files in section C (links would need updating at the same time).
