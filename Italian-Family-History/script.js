// ============================================
// BELFIORE & CIRCELLI FAMILY TREE
// Interactive Script
// ============================================

const personData = {
    anthony: {
        name: "Leonardantonio Belfiore",
        subtitle: "A Foundling — The Patriarch of the Belfiore Line",
        tags: ["Foundling", "Patriarch", "San Bartolomeo in Galdo"],
        description: `Leonardantonio Belfiore was born around 1860–1861 in the Province of Benevento, Campania. His marriage record reveals a remarkable origin: he was a foundling — a child abandoned by his parents and taken in by a foundling home (brefotrofio). In 19th-century southern Italy, thousands of infants were left at these institutions through a device called the Ruota dei Proietti — a revolving wooden wheel built into the wall of a church or hospital. A parent could place their baby on the wheel from the outside, turn it, ring a bell, and walk away unseen. Leonardantonio's parents left him at this wheel. The institution raised him, baptized him, and assigned him the surname "Belfiore" — bel fiore, beautiful flower. This was not a family name passed down through generations — it was a gift from a nun or civic official, following the Italian tradition of giving foundlings surnames inspired by nature, beauty, or virtue. The Belfiore genealogical line cannot be traced further back than Leonardantonio — he is where the name begins. He married Maria Donata Circelli on January 27, 1884, in San Bartolomeo in Galdo. Both were illiterate — they could not sign their own names. The evidence strongly suggests Leonardantonio died in Italy before 1896 — Maria traveled under her maiden name, and no immigration record for him has ever been found. An "Anthony Belfiore" died July 11, 1938, in New Rochelle (cert #42184), but whether this was Leonardantonio or another family member remains unresolved pending the 1900 census. American records shortened his name to "Anthony" or "Antonio."`,
        details: {
            "Real Name": "Leonardantonio Belfiore",
            "Born": "~1860–1861, Province of Benevento, Italy",
            "Origin": "Foundling (padre ignoto, madre ignota)",
            "Married": "Maria Donata Circelli, Jan 27, 1884",
            "Died": "Possibly July 11, 1938, New Rochelle (or in Italy before 1896)",
            "Death Cert": "#42184 (if the 1938 record is him)",
            "Children": "9 (4 sons, 5 daughters)",
            "Key Fact": "\"Belfiore\" was assigned — not inherited"
        }
    },
    maria: {
        name: "Maria Donata Circelli",
        subtitle: "The Matriarch — SS Oregon, December 2, 1896",
        tags: ["Immigrant", "Matriarch", "Ellis Island", "SS Oregon"],
        description: `Maria Donata Circelli (recorded as "Maria Doreta" on Ellis Island records) was born around 1856–1857 in San Bartolomeo in Galdo, Province of Benevento, Campania, Italy. Her parents were Giuseppe Circelli and Marianna Mita, both already deceased by the time of her 1884 marriage. She arrived in America on December 2, 1896, on the SS Oregon from Genoa and Naples, age 34. She traveled under her maiden name Circelli — not Belfiore. After 12 years of marriage, this strongly suggests she was traveling without her husband, likely as a widow relying on her Circelli relatives for the Atlantic crossing. Her Circelli brothers or cousins — Salvatore and Michele — followed her on the Alsatia in 1898, possibly to help support a widowed sister and her children. The Circelli surname is extremely rare: all 52 indexed records on Italy's Antenati portal originate from San Bartolomeo in Galdo.`,
        details: {
            "Born": "~1856–1857, San Bartolomeo in Galdo, Italy",
            "Parents": "Giuseppe Circelli & Marianna Mita",
            "Ship": "SS Oregon (December 2, 1896)",
            "Port": "Genoa and Naples → New York (Ellis Island)",
            "Residence": "46 Mechanic Street, New Rochelle, NY",
            "Children": "9 (4 sons, 5 daughters)"
        }
    },
    michael: {
        name: "Michael Kirtus Belfiore",
        subtitle: "Michele Belfiore — Seb's Great-Grandfather, 'The Non-Golfing Brother'",
        tags: ["Great-Grandfather", "Direct Line", "Painter", "Italy-Born"],
        image: "images/michael-kirtus-belfiore-registration-card.jpeg",
        links: [
            { label: "WWI Draft Card", url: "images/michael-kirtus-belfiore-registration-card.jpeg" },
            { label: "WWII Draft Card", url: "images/Michael-Belfiore-WW2-Draft-Card.jpeg" },
            { label: "1940 Census", url: "images/Michael-Belfiore-Census-1940-painter.jpeg" }
        ],
        description: `Michael Kirtus Belfiore (Michele Belfiore) was born December 15, 1883 or 1885, in Italy — almost certainly San Bartolomeo in Galdo. His 1918 draft card shows 1885; his 1942 draft card shows 1883. The middle name "Kirtus" is unusual and likely an Americanization of an Italian name. He arrived in America as a child. His addresses trace a life within New Rochelle's Italian West End: 114 Murray Avenue (1918), 48 Coligni Avenue (1942), 46 Mechanic Street (1952, death). He worked as a house painter. He was married twice. His first wife (name unknown) gave him a daughter, Dorothy, who appears on his 1918 draft card at 216 Hamilton Street, Bridgeport, Connecticut. He then married Frances Towey, an Irish-American woman, with whom he had two sons: Edward ("Eddie") and Joseph (Seb's grandfather). He claimed citizenship through "Father's Papers" on the 1918 draft card — implying Leonardantonio may have been naturalized. He was described in Sammy's obituary as "their non-golfing brother." He died January 16, 1952, at New Rochelle Hospital from arteriosclerotic heart disease. The 1940 Census confirms his household at this time: Michael (head, age 55, painter), Frances (wife), Edward (son), and Joseph (son). His birth year discrepancy — 1885 on the 1918 draft card vs. 1883 on the 1942 draft card — is typical of the era; self-reported ages on government forms were often inconsistent. His death certificate was later unearthed during the family's genealogical research, confirming his parents as Anthony Belfiore and Maria Circelli. In one generation, the family went from illiterate farmers to a literate tradesman — Michael signed his draft cards in a clear hand.`,
        details: {
            "Born": "December 15, 1883 or 1885, Italy",
            "Died": "January 16, 1952, New Rochelle Hospital",
            "Middle Name": "Kirtus (unusual — likely Americanized)",
            "Occupation": "Painter (house painter)",
            "First Marriage": "Unknown wife → daughter Dorothy",
            "Second Marriage": "Frances Towey → sons Edward, Joseph",
            "Addresses": "114 Murray Ave → 48 Coligni Ave → 46 Mechanic St",
            "Buried": "Holy Sepulchre Cemetery, Jan 19, 1952",
            "Citizenship": "Claimed via Father's Papers (1918 draft)"
        }
    },
    frances: {
        name: "Frances Towey",
        subtitle: "Frances M. Towey — Michael's Second Wife, The Irish Connection",
        tags: ["Great-Grandmother", "Direct Line", "Irish-American", "Towey"],
        description: `Frances M. Towey was born September 17, 1897, in New York — likely New Rochelle. She was Michael's second wife — he had been previously married and had a daughter, Dorothy, before Frances. With Michael, Frances had two sons: Edward ("Eddie") and Joseph (Seb's grandfather). The Towey surname is definitively Irish, deriving from the Gaelic Ó Tuathaigh. The Towey sept traces to County Mayo, concentrated around Ballaghaderreen on the Mayo/Roscommon border. Irish-Italian marriages were rare before World War II — a 1920s study found Irish New Yorkers were more likely to marry a German Jew than an Italian. Shared Catholic faith was the primary bridge. Frances lived at 46 Mechanic Street and was the informant on Michael's death certificate, listed as "Frances M. Belfiore." Her brother was John J. Towey (~1909, also New Rochelle). She died April 5, 1967, in New Rochelle, aged 69. Her death certificate has been ordered.`,
        details: {
            "Born": "September 17, 1897, New York",
            "Died": "April 5, 1967, New Rochelle, NY",
            "SSN": "120-26-7124",
            "Children": "Edward (Eddie), Joseph (Seb's grandfather)",
            "Irish Origin": "Towey — County Mayo/Roscommon, Ballaghaderreen area",
            "Death Cert": "Ordered — pending receipt"
        }
    },
    sammy: {
        name: "Sammy Belfiore",
        subtitle: "Born Christmas Day 1899 — PGA Tour Winner, Ridgeview CC & Seabreeze Pro",
        tags: ["Golfing Brother", "PGA Tour", "Ridgeview CC", "Seabreeze Club", "Daytona Beach"],
        image: "images/samme-belfiore-golfer.jpeg",
        links: [
            { label: "Full Story", url: "golfing-brothers.html" },
            { label: "Golfdom Article (PDF)", url: "pdfs/sammy-belfore-full-article.pdf" },
            { label: "Making the Swing (PDF)", url: "pdfs/sammy-belfore-daytona-newspaper.pdf" },
            { label: "Clinton Russell Bio (PDF)", url: "pdfs/blind-golfer.pdf" }
        ],
        description: `Sammy Belfiore (later "Belfore") was born December 25, 1899 (Christmas Day) in New Rochelle, NY. He became one of the first native-born Americans of Italian descent to enter professional golf — described in his obituary as "the first of the native born trio to blossom forth." He served as golf professional at Ridgeview Country Club in Westchester for many years before moving to Florida. In the 1930s he won a PGA Tour event — confirmed by his PGA of America player profile, which lists one official PGA Tour win. He was also the personal golf instructor for Clinton Russell, a prominent blind golfer from New Rochelle whose remarkable story was covered by Time magazine. Sammy guided Russell in a famous exhibition match at Wykagyl Country Club in 1938 against Charley Oxenham, the English blind golf champion. In 1948, after 36 years of golf, he became head professional at Seabreeze Golf and Tennis Club in Daytona Beach, Florida. He wrote about the experience in Golfdom magazine (February 1948), describing how the club had been "shutdown for 5 years" during the war and the $4,600 reseeding effort. His brother Frank joined him at Seabreeze, running the pro shop — a photo in the Golfdom article shows them together behind the counter. He married Virginia Hupp, whose family was connected to the Hupp Motor Car Company of Detroit. He changed the spelling of his surname to "Belfore." He died in Daytona Beach around 1971–1972 at age 72 after a long illness. He was survived by son Samuel Alexander Belfore Jr. and daughter Patricia Hupp Fleming. His obituary in The Standard-Star is the single most important document in this research.`,
        details: {
            "Born": "December 25, 1899, New Rochelle, NY",
            "Died": "~1971/1972, Daytona Beach, FL (age 72)",
            "Wife": "Virginia Hupp (Hupp Motor Car family)",
            "Career": "Ridgeview CC → PGA Tour (1 win) → Seabreeze G&TC (1948)",
            "Clinton Russell": "Personal golf instructor to the blind golfer",
            "Name Change": "Belfiore → Belfore",
            "Children": "Samuel Alexander Belfore Jr., Patricia Hupp Fleming",
            "Sources": "PGA of America profile, Golfdom magazine (Feb 1948), Standard-Star obituary"
        }
    },
    frank: {
        name: "Frank Belfiore",
        subtitle: "Francesco Belfiore — Golf Pro, Seabreeze Club, Daytona Beach",
        tags: ["Golfing Brother", "Daytona Beach", "Seabreeze Club", "Golf Shop"],
        image: "images/belfiore-golf-brothers.jpeg",
        links: [
            { label: "Full Story", url: "golfing-brothers.html" },
            { label: "Golfdom Article (PDF)", url: "pdfs/sammy-belfore-full-article.pdf" }
        ],
        description: `Frank Belfiore (Francesco) was born around November 1897 in New Rochelle, NY. His parents are confirmed as Antonio Belfiore and Maria D. Circelli via Ancestry indexed records. Like his brothers, he became a professional golfer. He followed Sammy to Florida and took over the golf shop at Seabreeze Golf and Tennis Club in Daytona Beach. A photograph in Sammy's February 1948 Golfdom magazine article shows both brothers together behind the counter of the Seabreeze pro shop. The two brothers worked together at the same Florida club for two decades. Frank died April 21, 1968, in Daytona Beach — three or four years before Sammy.`,
        details: {
            "Born": "~November 1897, New Rochelle, NY",
            "Died": "April 21, 1968, Daytona Beach, FL",
            "Parents": "Antonio Belfiore & Maria D. Circelli (confirmed)",
            "Career": "Golf pro — Seabreeze G&TC pro shop, Daytona Beach",
            "Source": "Golfdom magazine photo (Feb 1948), Standard-Star obituary"
        }
    },
    joseph_golfer: {
        name: "Joseph Belfiore (The Golfer)",
        subtitle: "Head Golf Professional — Country Club of Detroit, Grosse Pointe Farms",
        tags: ["Golfing Brother", "Country Club of Detroit", "Grosse Pointe", "Michigan PGA President", "2x Michigan PGA Champion", "Author"],
        image: "images/joe-book-4.jpeg",
        links: [
            { label: "Full Story", url: "golfing-brothers.html" },
            { label: "Golfing Aids — Cover", url: "images/joe-book-1.jpeg" },
            { label: "Golfing Aids — Title Page", url: "images/joe-book-3.jpeg" },
            { label: "Golfing Aids — Signed Portrait", url: "images/joe-book-4.jpeg" },
            { label: "Golfing Aids — Swing Instruction", url: "images/joe-book-5.jpeg" },
            { label: "PGA REACH Provenance Letter", url: "images/joe-book-6.jpeg" },
            { label: "CCD Board Minutes", url: "images/frank-belfore-michigan-golfcourse.jpg" },
            { label: "CCD Meeting Header", url: "images/frank-belfore-michigan-golfcourse2.jpg" },
            { label: "Michigan PGA Centennial", url: "https://michiganpga.com/news/michigan-pga-centennial-1922-2022-2/" },
            { label: "Golfing Aids Book (Auction)", url: "https://thegolfauction.com/1940__Golfing_Aids__Signed_By_Author_Joe_Belfore-LOT176227.aspx" },
            { label: "1927 Met Open (NYT)", url: "https://www.nytimes.com/1927/05/25/archives/golf-stars-begin-met-open-today-hagen-sarazen-and-mehlhorn-among.html" },
            { label: "Golfdom Jan 1934 (PDF)", url: "https://archive.lib.msu.edu/tic/golfd/article/1934jan9.pdf" }
        ],
        description: `Joseph "Joe" Belfore was far more than just a club pro — he was one of the most accomplished golf professionals in Michigan history. He served as head golf professional and Golf Shop operator at the Country Club of Detroit in Grosse Pointe Farms, Michigan — one of the most prestigious private clubs in America. According to the Michigan PGA's Centennial history (1922–2022), Belfore was "a highly regarded player and teacher at Country Club of Detroit" who served as President of the Michigan PGA Section from 1959 to 1960. He won the Michigan PGA Professional Championship twice, in 1933 and 1937. The Michigan PGA noted that "he also had the business skills to serve in acting management roles at the club when needed." In 1927, Joe competed in the Metropolitan Open alongside legends Walter Hagen, Gene Sarazen, and Bill Mehlhorn — as reported by The New York Times. In 1940, he authored a book titled "Golfing Aids," which he personally signed — copies have appeared at golf memorabilia auctions. He also appeared in Golfdom magazine (January 1934). Joe died in 1963 after a long illness. The Country Club of Detroit's Board of Governors met on October 29, 1963, to discuss replacing him and settling his affairs. The board voted to pay $750 to his wife ("Mrs. Belfore") as a gift to assist with obligations from his long illness, and allowed her to continue running the Golf Shop through the Christmas season until January 2, 1964. Joe's assistant professional was Danny Bianco. The board granted golfing privileges for two years to Joe's two sons — David Belfore and Joseph F. Belfore Jr. (nicknamed "Jeffery") — starting November 1, 1963. The middle initial "F." in Joseph Jr.'s name may stand for "Frank" after Joe's brother, following Italian naming customs. CRITICAL DISTINCTION: This Joseph (the golfer, Michael's brother) is NOT Seb's grandfather.`,
        details: {
            "Born": "Unknown, New Rochelle, NY",
            "Died": "1963, after a long illness",
            "Club": "Country Club of Detroit, Grosse Pointe Farms, MI",
            "Role": "Head Golf Professional & Golf Shop operator",
            "Michigan PGA President": "1959–1960",
            "Michigan PGA Champion": "1933, 1937 (2x winner)",
            "Author": "Golfing Aids (1940, signed edition)",
            "1927 Met Open": "Competed alongside Hagen, Sarazen, Mehlhorn",
            "Wife": "Mrs. Belfore (first name unknown)",
            "Sons": "David Belfore, Joseph F. 'Jeffery' Belfore Jr.",
            "Assistant Pro": "Danny Bianco",
            "Note": "Michael's brother — NOT Seb's grandfather",
            "Source": "CCD Board Minutes (1963), Michigan PGA Centennial, NYT (1927)"
        }
    },
    rose: {
        name: "Rose Belfiore",
        subtitle: "Never Married — Wykagyl Gardens, New Rochelle",
        tags: ["Sister", "New Rochelle", "Unmarried"],
        description: `Rose Belfiore was one of the five Belfiore sisters. She never married — listed as "Miss" in Sammy's obituary. She lived at Wykagyl Gardens, New Rochelle, together with her sister Caroline. Wykagyl Gardens was likely an apartment complex near Wykagyl Country Club, where Sammy had worked as assistant golf pro.`,
        details: {
            "Residence": "Wykagyl Gardens, New Rochelle, NY",
            "Marital Status": "Never married",
            "Lived With": "Sister Caroline"
        }
    },
    caroline: {
        name: "Caroline Belfiore",
        subtitle: "Never Married — Wykagyl Gardens, New Rochelle",
        tags: ["Sister", "New Rochelle", "Unmarried"],
        description: `Caroline Belfiore was one of the five sisters. Like Rose, she never married and was listed as "Miss" in Sammy's obituary. She lived at Wykagyl Gardens, New Rochelle, together with her sister Rose. The two unmarried sisters living together was a common arrangement in mid-20th century America.`,
        details: {
            "Residence": "Wykagyl Gardens, New Rochelle, NY",
            "Marital Status": "Never married",
            "Lived With": "Sister Rose"
        }
    },
    mollie: {
        name: "Mollie Belfiore",
        subtitle: "Mrs. Anthony Drew — Davenport Avenue, New Rochelle",
        tags: ["Sister", "New Rochelle", "Married"],
        description: `Mollie Belfiore married Anthony Drew and lived on Davenport Avenue, New Rochelle, NY. She was one of the five Belfiore sisters named in Sammy's obituary.`,
        details: {
            "Married": "Anthony Drew",
            "Residence": "Davenport Avenue, New Rochelle, NY"
        }
    },
    phyl: {
        name: "Phyl Belfiore",
        subtitle: "Mrs. Angelo Paternostro — Hartford, Connecticut",
        tags: ["Sister", "Hartford", "Married"],
        description: `Phyl Belfiore (likely Phyllis or Filomena) married Angelo Paternostro and lived in Hartford, Connecticut. The Paternostro surname is southern Italian — often from Campania or Sicily — so this marriage maintained the Italian connection. She was one of the five Belfiore sisters named in Sammy's obituary.`,
        details: {
            "Full Name": "Possibly Phyllis or Filomena",
            "Married": "Angelo Paternostro",
            "Residence": "Hartford, Connecticut",
            "Note": "Paternostro is a southern Italian surname"
        }
    },
    mary_sister: {
        name: "Mary Belfiore",
        subtitle: "Mrs. Joseph D'Onofrio — Hollywood, Florida",
        tags: ["Sister", "Hollywood FL", "Married"],
        description: `Mary Belfiore married Joseph D'Onofrio and lived in Hollywood, Florida. Another sister who married into an Italian family — D'Onofrio is a common southern Italian surname. She was one of the five Belfiore sisters named in Sammy's obituary.`,
        details: {
            "Married": "Joseph D'Onofrio",
            "Residence": "Hollywood, Florida"
        }
    },
    joseph_grandfather: {
        name: "Joseph Belfiore",
        subtitle: "Seb's Grandfather — Son of Michael & Frances",
        tags: ["Grandfather", "Direct Line", "West Babylon"],
        description: `Joseph Belfiore was Seb's grandfather — the son of Michael Kirtus Belfiore and Frances Towey (Michael's second wife). He was almost certainly named after his uncle Joseph (the golfer, Michael's brother), following the classic Italian naming tradition. He married Dorothy Hennessey, an Irish-American woman (not to be confused with Dorothy, Michael's daughter from his first marriage — two different Dorothys in the family). His SSN (218-30-3629) was issued with a Maryland prefix. He died in West Babylon, NY. Joseph and Dorothy had four children: Robert (Seb's father), William (Seb's uncle), Karen (later Carpenter), and Beth.`,
        details: {
            "Born": "Unknown (likely 1920s, New Rochelle)",
            "Died": "West Babylon, NY",
            "SSN": "218-30-3629 (Maryland-issued)",
            "Father": "Michael Kirtus Belfiore",
            "Mother": "Frances Towey",
            "Wife": "Dorothy Hennessey Belfiore (née Hennessey, Irish-American)",
            "Children": "Robert Belfiore, William Belfiore, Karen Carpenter (née Belfiore), Beth Belfiore",
            "Named After": "Uncle Joseph (the golfer)"
        }
    },
    first_wife: {
        name: "First Wife (Unknown)",
        subtitle: "Michael's First Wife — Name Unknown",
        tags: ["First Wife", "Unknown"],
        description: `Michael Kirtus Belfiore was married before Frances Towey. His first wife's name is not yet known. She gave him a daughter, Dorothy, who appears on his 1918 WWI draft registration card at 216 Hamilton Street, Bridgeport, Connecticut. The first wife likely died before Michael married Frances Towey circa 1920–1922.`,
        details: {
            "Name": "Unknown",
            "Child": "Dorothy Belfiore",
            "Husband": "Michael Kirtus Belfiore"
        }
    },
    dorothy_daughter: {
        name: "Dorothy Belfiore",
        subtitle: "Michael's Daughter from First Marriage — Bridgeport, CT",
        tags: ["Michael's Daughter", "First Marriage", "Bridgeport"],
        description: `Dorothy Belfiore was Michael Kirtus Belfiore's daughter from his first marriage (before Frances Towey). She appears as "(Child) Dorothy Belfiore" on Michael's September 12, 1918, WWI draft registration card, listed at 216 Hamilton Street, Bridgeport, Fairfield County, Connecticut. Family memory confirms she was Michael's daughter — his aunt per the next generation. Not to be confused with Dorothy Belfiore who married Joseph (Seb's grandmother) — two different Dorothys in the family.`,
        details: {
            "Father": "Michael Kirtus Belfiore",
            "Mother": "First wife (unknown)",
            "1918 Address": "216 Hamilton St, Bridgeport, CT",
            "Source": "1918 WWI Draft Registration Card"
        }
    },
    edward: {
        name: "Edward Belfiore",
        subtitle: "Eddie — Son of Michael & Frances",
        tags: ["Michael's Son", "Second Marriage", "New Rochelle"],
        description: `Edward "Eddie" Belfiore was the son of Michael Kirtus Belfiore and Frances Towey. He was born around 1923 and appears in the 1940 census household. He would have been draft-age during WWII. He does not appear on the New York State WWII Honor List of Dead and Missing, indicating he likely survived the war if he served. The 1973 fire at the National Personnel Records Center destroyed nearly 80% of Army records from 1912–1960.`,
        details: {
            "Born": "~1923, New Rochelle, NY",
            "Father": "Michael Kirtus Belfiore",
            "Mother": "Frances Towey",
            "Census": "1940 — appears in Michael's household"
        }
    },
    dorothy_grandmother: {
        name: "Dorothy Hennessey Belfiore",
        subtitle: "Seb's Grandmother — née Hennessey, Irish-American",
        tags: ["Grandmother", "Direct Line", "Irish-American", "Hennessey"],
        description: `Dorothy Hennessey Belfiore (née Hennessey) was Joseph Belfiore's wife and Seb's grandmother. She was Irish-American. Not to be confused with Dorothy Belfiore, Michael's daughter from his first marriage — two different Dorothys in the family. Dorothy and Joseph had four children: Robert (Seb's father), William (Seb's uncle), Karen (later Carpenter), and Beth.`,
        details: {
            "Maiden Name": "Hennessey",
            "Husband": "Joseph Belfiore",
            "Heritage": "Irish-American",
            "Children": "Robert Belfiore, William Belfiore, Karen Carpenter (née Belfiore), Beth Belfiore",
            "Note": "Different person from Dorothy (Michael's daughter)"
        }
    },
    robert: {
        name: "Robert Belfiore",
        subtitle: "Seb's Father",
        tags: ["Father", "Direct Line", "New Rochelle"],
        description: `Robert Belfiore is Seb's father, son of Joseph Belfiore and Dorothy Hennessey Belfiore. He was raised in the New Rochelle area. His siblings are William, Karen (Carpenter), and Beth.`,
        details: {
            "Father": "Joseph Belfiore",
            "Mother": "Dorothy Hennessey Belfiore",
            "Children": "Seb Belfiore, Alexander Belfiore",
            "Siblings": "William Belfiore, Karen Carpenter, Beth Belfiore",
            "Residence": "New Rochelle area"
        }
    },
    william: {
        name: "William Belfiore",
        subtitle: "Seb's Uncle",
        tags: ["Uncle", "New Rochelle"],
        description: `William Belfiore was born around 1950 — he was "not even 2 years old" when Michael died in January 1952. He is the son of Joseph Belfiore and Dorothy Hennessey Belfiore, and the brother of Robert (Seb's father), Karen (Carpenter), and Beth. He married Susan. Together they have six children: Loredana, Dani, Ionel, Ramona, Michaela, and Aidan.`,
        details: {
            "Born": "~1950",
            "Father": "Joseph Belfiore",
            "Mother": "Dorothy Hennessey Belfiore",
            "Wife": "Susan Belfiore",
            "Children": "Loredana, Dani, Ionel, Ramona, Michaela, Aidan",
            "Siblings": "Robert Belfiore, Karen Carpenter, Beth Belfiore"
        }
    },
    seb: {
        name: "Seb Belfiore",
        subtitle: "Fifth Generation — Davis Island, Tampa",
        tags: ["You", "5th Generation", "Tampa FL"],
        description: `Seb Belfiore was born in 1991 in the United Kingdom. He holds dual US/UK citizenship. He is a product designer living on Davis Island, Tampa, FL. He married Valeria (German). He is the great-great-grandson of Anthony and Maria Belfiore — the immigrants from San Bartolomeo in Galdo. Through his father Robert, grandfather Joseph, great-grandfather Michael, and great-great-grandparents Anthony and Maria, the line stretches back five generations to the mountains of Campania. His son Enzo, born January 2026, carries the name into the sixth generation.`,
        details: {
            "Born": "1991, United Kingdom",
            "Citizenship": "UK, US (dual)",
            "Residence": "Davis Island, Tampa, FL",
            "Married": "Valeria (German)",
            "Occupation": "Product designer",
            "Heritage": "5th generation from the immigrants"
        }
    },
    valeria: {
        name: "Valeria Belfiore",
        subtitle: "Seb's Wife — German",
        tags: ["Spouse", "German", "Tampa FL"],
        description: `Valeria Belfiore is the wife of Seb Belfiore and the mother of Enzo Belfiore. She is German. Together with Seb, she lives on Davis Island, Tampa, FL. Enzo, born January 2026, holds triple citizenship — US, UK, and German — with the German citizenship coming through Valeria.`,
        details: {
            "Husband": "Seb Belfiore",
            "Son": "Enzo Belfiore (b. January 2026)",
            "Nationality": "German",
            "Residence": "Davis Island, Tampa, FL"
        }
    },
    enzo: {
        name: "Enzo Belfiore",
        subtitle: "Sixth Generation — Born January 2026",
        tags: ["6th Generation", "Tampa FL", "Triple Citizenship"],
        description: `Enzo Belfiore was born in January 2026 in Tampa, Florida, to Seb and Valeria Belfiore. He holds triple citizenship: US, UK, and German — the German citizenship through his mother Valeria. Named in the Italian tradition, he is the sixth generation from the immigrants Anthony and Maria. His great-great-great-grandparents left a mountain town in southern Italy in the 1890s. Six generations later, the Belfiore name continues on the Gulf Coast of Florida. His cousin Violet is the daughter of Alexander and Lauren Belfiore.`,
        details: {
            "Born": "January 2026, Tampa, FL",
            "Parents": "Seb & Valeria Belfiore",
            "Citizenship": "US, UK, German (triple)",
            "Cousin": "Violet Belfiore",
            "Heritage": "6th generation from the immigrants"
        }
    },
    violet: {
        name: "Violet Belfiore",
        subtitle: "Sixth Generation — Alexander & Lauren's Daughter",
        tags: ["6th Generation", "Enzo's Cousin"],
        description: `Violet Belfiore is the daughter of Alexander and Lauren Belfiore. She is Enzo's cousin — together they represent the sixth generation of Belfiores from the immigrants Leonardantonio and Maria Donata Circelli.`,
        details: {
            "Father": "Alexander Belfiore",
            "Mother": "Lauren Belfiore",
            "Cousin": "Enzo Belfiore",
            "Heritage": "6th generation from the immigrants"
        }
    },
    lena: {
        name: "Lena Belfiore",
        subtitle: "Confirmed in 1940 Census — Possible 10th Sibling or Nickname",
        tags: ["Census Record", "1940", "New Rochelle"],
        description: `Lena Belfiore appears in the 1940 U.S. Census in New Rochelle Ward 1, Westchester County, NY. Her parents are listed as Antonio Belfiore and Maria D. Circelli — confirming she is part of this family. She was born around 1901. However, she is NOT listed in Sammy's obituary, which names only nine siblings (4 brothers, 5 sisters). She may have died before Sammy, or "Lena" may be a nickname for one of the five sisters — possibly Caroline or another formal name. Further research is needed.`,
        details: {
            "Born": "~1901, New Rochelle, NY",
            "Census": "1940 U.S. Census, New Rochelle Ward 1",
            "Parents": "Antonio Belfiore & Maria D. Circelli",
            "Status": "Not in Sammy's obituary — may be nickname or pre-deceased"
        }
    },
    sammy_jr: {
        name: "Samuel Alexander Belfore Jr.",
        subtitle: "Son of Sammy — Ormond Beach, Florida",
        tags: ["Next Generation", "Ormond Beach", "Belfore"],
        description: `Samuel Alexander Belfore Jr. was the son of Sammy Belfore Sr. and Virginia Hupp. He lived in Ormond Beach, Florida (adjacent to Daytona Beach), near the family's Seabreeze club connections. His middle name "Alexander" is notable. He married Julia Clair Belfore. He died approximately 2024–2025 in Ormond Beach. He carried the changed spelling "Belfore" that his father had adopted.`,
        details: {
            "Full Name": "Samuel Alexander Belfore Jr.",
            "Father": "Sammy Belfore Sr.",
            "Mother": "Virginia Hupp",
            "Wife": "Julia Clair Belfore",
            "Residence": "Ormond Beach, FL",
            "Died": "~2024/2025, Ormond Beach, FL"
        }
    },
    patricia_fleming: {
        name: "Patricia Hupp Fleming",
        subtitle: "1933–2022 — Sammy's Daughter, Birmingham, Michigan",
        tags: ["Next Generation", "Michigan", "Hupp Motor Car", "Birmingham"],
        description: `Patricia Hupp Fleming (née Belfore) was born June 11, 1933, and died January 1, 2022, age 88, in Birmingham, Michigan. She was the daughter of Sammy Belfore Sr. and Virginia Hupp. Her middle name "Hupp" confirms the family connection to the Hupp Motor Car Company of Detroit, which manufactured the Hupmobile automobile from 1909 to 1940. She married John J. Fleming and had four children: Lisa Fleming, Chris Fleming, John Fleming Jr., and Geoff Fleming. She was buried at Cedar Hill Cemetery in Birmingham, Michigan — her Find a Grave memorial provides the key dates. Her father's obituary listed her as "Mrs. Patricia Fleming (Birmingham, Michigan)."`,
        details: {
            "Born": "June 11, 1933",
            "Died": "January 1, 2022, Birmingham, MI (age 88)",
            "Parents": "Sammy Belfore Sr. & Virginia Hupp",
            "Husband": "John J. Fleming",
            "Children": "Lisa, Chris, John Jr., Geoff Fleming",
            "Buried": "Cedar Hill Cemetery, Birmingham, MI",
            "Hupp Connection": "Middle name confirms link to Hupp Motor Car Co."
        }
    },
    mrs_belfore: {
        name: "Mrs. Belfore",
        subtitle: "Joe Belfore's Wife — Country Club of Detroit",
        tags: ["Spouse", "Country Club of Detroit", "Grosse Pointe"],
        description: `Mrs. Belfore (first name unknown) was the wife of Joe Belfore, head golf professional at the Country Club of Detroit. After Joe's death in 1963, she presented a letter of appreciation to the Board of Governors, handled the estate, and ran the Golf Shop. The board voted to pay her $750 as a gift to help settle obligations from Joe's long illness. She was permitted to keep the Golf Shop open through the Christmas season until January 2, 1964. Her two sons, David and Joseph F. "Jeffery" Jr., were granted personal golfing privileges at the club for two years.`,
        details: {
            "Husband": "Joe Belfore (d. 1963)",
            "Sons": "David Belfore, Joseph F. 'Jeffery' Belfore Jr.",
            "Club": "Country Club of Detroit",
            "Source": "CCD Board of Governors Minutes, Oct 29, 1963"
        }
    },
    david_belfore: {
        name: "David Belfore",
        subtitle: "Son of Joe Belfore — Country Club of Detroit",
        tags: ["Joe's Son", "Country Club of Detroit", "Grosse Pointe"],
        description: `David Belfore was one of two sons of Joe Belfore, head golf professional at the Country Club of Detroit. After Joe's death in 1963, the club's Board of Governors granted David personal golfing privileges for two years starting November 1, 1963. He could sign chits and use the Men's Grill and Locker Room, though the privileges were personal and didn't extend to his family.`,
        details: {
            "Father": "Joe Belfore",
            "Mother": "Mrs. Belfore (first name unknown)",
            "Brother": "Joseph F. 'Jeffery' Belfore Jr.",
            "Source": "CCD Board of Governors Minutes, Oct 29, 1963"
        }
    },
    joseph_jr_belfore: {
        name: "Joseph F. \"Jeffery\" Belfore Jr.",
        subtitle: "Son of Joe Belfore — Country Club of Detroit",
        tags: ["Joe's Son", "Country Club of Detroit", "Grosse Pointe"],
        description: `Joseph F. Belfore Jr., nicknamed "Jeffery," was one of two sons of Joe Belfore, head golf professional at the Country Club of Detroit. The middle initial "F." may stand for "Frank" after Joe's brother, following Italian naming customs. After Joe's death in 1963, the club's Board of Governors granted Jeffery personal golfing privileges for two years starting November 1, 1963. He could sign chits and use the Men's Grill and Locker Room, though the privileges were personal and didn't extend to his family.`,
        details: {
            "Father": "Joe Belfore",
            "Mother": "Mrs. Belfore (first name unknown)",
            "Brother": "David Belfore",
            "Middle Initial": "F. — possibly 'Frank' after uncle (Italian naming tradition)",
            "Source": "CCD Board of Governors Minutes, Oct 29, 1963"
        }
    },
    virginia_hupp: {
        name: "Virginia Hupp",
        subtitle: "Sammy's Wife — Hupp Motor Car Family",
        tags: ["Spouse", "Hupp Motor Car", "Detroit"],
        description: `Virginia Hupp was Sammy Belfore's wife. Her surname "Hupp" connects her to the Hupp Motor Car Company of Detroit, which manufactured the Hupmobile automobile from 1909 to 1940. The company was founded by Bobby Hupp in Detroit in 1908. The Grosse Pointe golf connection (where brother Joseph was pro) and the Hupp family's Detroit roots suggest the brothers' Michigan connections may have led to the match. Virginia's daughter Patricia carried the middle name "Hupp," preserving the family connection.`,
        details: {
            "Husband": "Sammy Belfore Sr.",
            "Children": "Samuel Alexander Belfore Jr., Patricia Hupp Fleming",
            "Family": "Connected to Hupp Motor Car Company (Detroit)"
        }
    },
    lisa_fleming: {
        name: "Lisa Fleming",
        subtitle: "Daughter of Patricia & John Fleming",
        tags: ["Sammy's Grandchild", "Fleming"],
        description: `Lisa Fleming is the daughter of Patricia Hupp Fleming and John J. Fleming, and granddaughter of Sammy Belfore Sr. She is one of the "three grandchildren" mentioned in Sammy's obituary.`,
        details: {
            "Parents": "Patricia Hupp Fleming & John J. Fleming",
            "Grandfather": "Sammy Belfore Sr."
        }
    },
    chris_fleming: {
        name: "Chris Fleming",
        subtitle: "Son of Patricia & John Fleming",
        tags: ["Sammy's Grandchild", "Fleming"],
        description: `Chris Fleming is the son of Patricia Hupp Fleming and John J. Fleming, and grandson of Sammy Belfore Sr.`,
        details: {
            "Parents": "Patricia Hupp Fleming & John J. Fleming",
            "Grandfather": "Sammy Belfore Sr."
        }
    },
    john_fleming_jr: {
        name: "John Fleming Jr.",
        subtitle: "Son of Patricia & John Fleming",
        tags: ["Sammy's Grandchild", "Fleming"],
        description: `John Fleming Jr. is the son of Patricia Hupp Fleming and John J. Fleming, and grandson of Sammy Belfore Sr.`,
        details: {
            "Parents": "Patricia Hupp Fleming & John J. Fleming",
            "Grandfather": "Sammy Belfore Sr."
        }
    },
    geoff_fleming: {
        name: "Geoff Fleming",
        subtitle: "Son of Patricia & John Fleming",
        tags: ["Sammy's Grandchild", "Fleming"],
        description: `Geoff Fleming is the son of Patricia Hupp Fleming and John J. Fleming, and grandson of Sammy Belfore Sr.`,
        details: {
            "Parents": "Patricia Hupp Fleming & John J. Fleming",
            "Grandfather": "Sammy Belfore Sr."
        }
    },
    loredana: {
        name: "Loredana Belfiore",
        subtitle: "William's Daughter — Adopted from Romania",
        tags: ["Next Generation", "Adopted", "Romania"],
        description: `Loredana Belfiore is one of William Belfiore's four children adopted from Romania.`,
        details: {
            "Father": "William Belfiore",
            "Origin": "Romania (adopted)"
        }
    },
    ionel: {
        name: "Ionel Belfiore",
        subtitle: "William's Son — Adopted from Romania",
        tags: ["Next Generation", "Adopted", "Romania"],
        description: `Ionel Belfiore is one of William Belfiore's four children adopted from Romania.`,
        details: {
            "Father": "William Belfiore",
            "Origin": "Romania (adopted)"
        }
    },
    ramona: {
        name: "Ramona Belfiore",
        subtitle: "William's Daughter — Adopted from Romania",
        tags: ["Next Generation", "Adopted", "Romania"],
        description: `Ramona Belfiore is one of William Belfiore's four children adopted from Romania.`,
        details: {
            "Father": "William Belfiore",
            "Origin": "Romania (adopted)"
        }
    },
    michaela: {
        name: "Michaela Belfiore",
        subtitle: "William's Daughter — Adopted from Romania",
        tags: ["Next Generation", "Adopted", "Romania"],
        description: `Michaela Belfiore is one of William Belfiore's four children adopted from Romania.`,
        details: {
            "Father": "William Belfiore",
            "Origin": "Romania (adopted)"
        }
    },
    aidan: {
        name: "Aidan Belfiore",
        subtitle: "William's Son — US Born",
        tags: ["Next Generation", "US"],
        description: `Aidan Belfiore is the US-born son of William Belfiore.`,
        details: {
            "Father": "William Belfiore",
            "Origin": "United States"
        }
    },
    alexander: {
        name: "Alexander Belfiore",
        subtitle: "b. 1989 — Seb's Brother",
        tags: ["Generation 5", "Robert's Son"],
        description: `Alexander Belfiore was born in 1989 in the United Kingdom. He is the son of Robert Belfiore and Seb's older brother. He married Lauren Belfiore. They have a daughter, Violet — Enzo's cousin.`,
        details: {
            "Born": "1989, United Kingdom",
            "Father": "Robert Belfiore",
            "Wife": "Lauren Belfiore",
            "Daughter": "Violet Belfiore",
            "Sibling": "Seb Belfiore"
        }
    },
    lauren: {
        name: "Lauren Belfiore",
        subtitle: "Alexander's Wife",
        tags: ["Spouse", "Generation 5"],
        description: `Lauren Belfiore is the wife of Alexander Belfiore (Seb's brother). They have a daughter, Violet.`,
        details: {
            "Husband": "Alexander Belfiore",
            "Daughter": "Violet Belfiore"
        }
    },
    karen: {
        name: "Karen Carpenter",
        subtitle: "née Belfiore — Joseph & Dorothy's Daughter",
        tags: ["Joseph's Daughter", "Direct Line", "Carpenter"],
        description: `Karen Carpenter (née Belfiore) is the daughter of Joseph Belfiore and Dorothy Hennessey Belfiore. She is a sister to Robert (Seb's father), William, and Beth. She married Bill Carpenter. Their son is Christian Carpenter.`,
        details: {
            "Maiden Name": "Belfiore",
            "Married Name": "Carpenter",
            "Husband": "Bill Carpenter",
            "Son": "Christian Carpenter",
            "Father": "Joseph Belfiore",
            "Mother": "Dorothy Hennessey Belfiore",
            "Siblings": "Robert Belfiore, William Belfiore, Beth Belfiore"
        }
    },
    bill_carpenter: {
        name: "Bill Carpenter",
        subtitle: "Karen's Husband",
        tags: ["Carpenter", "Spouse"],
        description: `Bill Carpenter is the husband of Karen Carpenter (née Belfiore). Karen is the daughter of Joseph and Dorothy Hennessey Belfiore. Bill and Karen have a son, Christian Carpenter.`,
        details: {
            "Wife": "Karen Carpenter (née Belfiore)",
            "Son": "Christian Carpenter",
            "In-Laws": "Joseph & Dorothy Hennessey Belfiore"
        }
    },
    christian_carpenter: {
        name: "Christian Carpenter",
        subtitle: "Son of Karen & Bill Carpenter",
        tags: ["5th Generation", "Carpenter"],
        description: `Christian Carpenter is the son of Karen Carpenter (née Belfiore) and Bill Carpenter. Through his mother Karen, he is a grandson of Joseph and Dorothy Hennessey Belfiore, and a cousin to Seb, Alexander, and William's children. He is the fifth generation from the immigrants Leonardantonio and Maria Donata Circelli.`,
        details: {
            "Mother": "Karen Carpenter (née Belfiore)",
            "Father": "Bill Carpenter",
            "Grandparents": "Joseph & Dorothy Hennessey Belfiore",
            "Heritage": "5th generation from the immigrants"
        }
    },
    beth: {
        name: "Beth Belfiore",
        subtitle: "Joseph & Dorothy's Daughter",
        tags: ["Joseph's Daughter", "Direct Line"],
        description: `Beth Belfiore is the daughter of Joseph Belfiore and Dorothy Hennessey Belfiore. She is a sister to Robert (Seb's father), William, and Karen (Carpenter).`,
        details: {
            "Father": "Joseph Belfiore",
            "Mother": "Dorothy Hennessey Belfiore",
            "Siblings": "Robert Belfiore, William Belfiore, Karen Carpenter"
        }
    },
    susan: {
        name: "Susan Belfiore",
        subtitle: "William's Wife",
        tags: ["Spouse", "William's Wife"],
        description: `Susan Belfiore is the wife of William Belfiore (Seb's uncle). Together they have six children: Loredana, Dani, Ionel, Ramona, Michaela, and Aidan.`,
        details: {
            "Husband": "William Belfiore",
            "Children": "Loredana, Dani, Ionel, Ramona, Michaela, Aidan"
        }
    },
    dani: {
        name: "Dani Belfiore",
        subtitle: "William & Susan's Child",
        tags: ["Next Generation", "William's Child"],
        description: `Dani Belfiore is the child of William and Susan Belfiore.`,
        details: {
            "Father": "William Belfiore",
            "Mother": "Susan Belfiore"
        }
    }
};

// ============================================
// NAVIGATION
// ============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.tree-generation').forEach(el => {
    observer.observe(el);
});

// ============================================
// TREE FILTER
// ============================================
document.querySelectorAll('.tree-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tree-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const view = btn.dataset.view;
        document.querySelectorAll('.tree-person').forEach(person => {
            const side = person.dataset.side;
            if (view === 'full') {
                person.style.opacity = '1';
                person.style.transform = 'scale(1)';
            } else if (side === view) {
                person.style.opacity = '1';
                person.style.transform = 'scale(1)';
            } else {
                person.style.opacity = '0.2';
                person.style.transform = 'scale(0.95)';
            }
        });
    });
});

// ============================================
// SIDEBAR BIO PANEL (desktop)
// ============================================
const sidebar = document.getElementById('bioSidebar');
const bioContent = document.getElementById('bioContent');

function showBio(id) {
    const data = personData[id];
    if (!data) return;

    // Mark active
    document.querySelectorAll('.tree-person').forEach(p => p.classList.remove('active'));
    const activeCard = document.querySelector(`[data-id="${id}"]`);
    if (activeCard) activeCard.classList.add('active');

    let tagsHTML = data.tags.map(t => `<span class="bio-tag">${t}</span>`).join('');
    let detailsHTML = '';
    if (data.details) {
        detailsHTML = '<div class="bio-details">';
        for (const [label, value] of Object.entries(data.details)) {
            detailsHTML += `<div class="bio-detail-row"><span class="bio-detail-label">${label}</span><span class="bio-detail-value">${value}</span></div>`;
        }
        detailsHTML += '</div>';
    }

    let imageHTML = '';
    if (data.image) {
        imageHTML = `<img class="bio-image" src="${data.image}" alt="${data.name}">`;
    }

    let linksHTML = '';
    if (data.links && data.links.length > 0) {
        linksHTML = '<div class="bio-links"><h4>Related Documents</h4>';
        data.links.forEach(link => {
            linksHTML += `<a class="bio-link" href="${link.url}" target="_blank"><span class="bio-link-label">${link.label}</span> &rarr;</a>`;
        });
        linksHTML += '</div>';
    }

    bioContent.innerHTML = `
        ${imageHTML}
        <h3 class="bio-name">${data.name}</h3>
        <p class="bio-subtitle">${data.subtitle}</p>
        <div class="bio-tags">${tagsHTML}</div>
        <p class="bio-description">${data.description}</p>
        ${detailsHTML}
        ${linksHTML}
    `;

    // On mobile, open sidebar drawer
    if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.add('has-bio');
        // Small delay so the display:block takes effect before the transform transition
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                sidebar.classList.add('open');
            });
        });
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) overlay.classList.add('active');
    }
}

// Close mobile sidebar drawer
function closeMobileSidebar() {
    if (sidebar) {
        sidebar.classList.remove('open');
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) overlay.classList.remove('active');
        // Remove has-bio after transition ends to hide it
        sidebar.addEventListener('transitionend', function handler() {
            if (!sidebar.classList.contains('open')) {
                sidebar.classList.remove('has-bio');
                document.querySelectorAll('.tree-person').forEach(p => p.classList.remove('active'));
            }
            sidebar.removeEventListener('transitionend', handler);
        });
    }
}

const sidebarClose = document.getElementById('sidebarClose');
if (sidebarClose) {
    sidebarClose.addEventListener('click', closeMobileSidebar);
}
const sidebarOverlay = document.getElementById('sidebarOverlay');
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
}

document.querySelectorAll('.tree-person').forEach(person => {
    person.addEventListener('click', () => {
        const id = person.dataset.id;
        showBio(id);
    });
});

// Close mobile sidebar on tap outside
if (sidebar) {
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !e.target.closest('.tree-person')) {
            sidebar.classList.remove('open');
        }
    });
}

// ============================================
// MODAL (fallback for pages without sidebar)
// ============================================
const modal = document.getElementById('personModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

if (modal && !sidebar) {
    document.querySelectorAll('.tree-person').forEach(person => {
        person.addEventListener('click', () => {
            const id = person.dataset.id;
            const data = personData[id];
            if (!data) return;

            let tagsHTML = data.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');
            modalBody.innerHTML = `
                <h3>${data.name}</h3>
                <p class="modal-subtitle">${data.subtitle}</p>
                <div style="margin-bottom: 1rem;">${tagsHTML}</div>
                <p>${data.description}</p>
            `;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// SMOOTH SCROLL FOR NAV
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const position = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: position, behavior: 'smooth' });
        }
    });
});
