// ============================================
// BELFIORE & CIRCELLI FAMILY TREE
// Interactive Script
// ============================================

const personData = {
    anthony: {
        name: "Leonardantonio Belfiore",
        subtitle: "A Foundling — The Patriarch of the Belfiore Line",
        tags: ["Foundling", "Patriarch", "San Bartolomeo in Galdo"],
        description: `Leonardantonio Belfiore was born around 1860–1861 in the Province of Benevento, Campania. His marriage record reveals a remarkable origin: he was a foundling — the son of padre ignoto and madre ignota (both parents unknown). The surname "Belfiore" — bel fiore, beautiful flower — was not inherited. It was assigned by a foundling home, almost certainly the Ruota dei Proietti, the revolving door where unwanted infants were anonymously deposited. Italian authorities gave these children invented, often beautiful surnames. The Belfiore genealogical line terminates with Leonardantonio — there are no Belfiore ancestors to trace further back. He married Maria Donata Circelli on January 27, 1884, in San Bartolomeo in Galdo. Both were illiterate — they could not sign their own names. The evidence strongly suggests Leonardantonio died in Italy before 1896 — Maria traveled under her maiden name, and no immigration record for him has ever been found. An "Anthony Belfiore" died July 11, 1938, in New Rochelle (cert #42184), but whether this was Leonardantonio or another family member remains unresolved pending the 1900 census. American records shortened his name to "Anthony" or "Antonio."`,
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
        description: `Michael Kirtus Belfiore (Michele Belfiore) was born December 15, 1883 or 1885, in Italy — almost certainly San Bartolomeo in Galdo. His 1918 draft card shows 1885; his 1942 draft card shows 1883. The middle name "Kirtus" is unusual and likely an Americanization of an Italian name. He arrived in America as a child. His addresses trace a life within New Rochelle's Italian West End: 114 Murray Avenue (1918), 48 Coligni Avenue (1942), 46 Mechanic Street (1952, death). He worked as a house painter. He was married twice. His first wife (name unknown) gave him a daughter, Dorothy, who appears on his 1918 draft card at 216 Hamilton Street, Bridgeport, Connecticut. He then married Frances Towey, an Irish-American woman, with whom he had two sons: Edward ("Eddie") and Joseph (Seb's grandfather). He claimed citizenship through "Father's Papers" on the 1918 draft card — implying Leonardantonio may have been naturalized. He was described in Sammy's obituary as "their non-golfing brother." He died January 16, 1952, at New Rochelle Hospital from arteriosclerotic heart disease. His death certificate was the document that started this entire research. In one generation, the family went from illiterate farmers to a literate tradesman — Michael signed his draft cards in a clear hand.`,
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
        subtitle: "Born Christmas Day 1899 — Golf Pro, Daytona Beach",
        tags: ["Golfing Brother", "Seabreeze Club", "Daytona Beach"],
        description: `Sammy Belfiore was born December 25, 1899 (Christmas Day) in New Rochelle, NY. He became a professional golfer — first as assistant pro at Wykagyl Country Club in New Rochelle, then as golf pro at Seabreeze Golf and Tennis Club in Daytona Beach, Florida, from 1948. He had been golfing for 36 years before taking the Seabreeze position. His obituary in The Standard-Star described him as "the first of the native born trio to blossom forth" — among the first native-born Americans to enter professional golf, a field previously dominated by Scottish and foreign-born players. He changed the spelling of his surname from Belfiore to "Belfore." He died in Daytona Beach around 1971–1972 at age 72 after a long illness. He was survived by son Sammy Belfore Jr. (Daytona Beach), daughter Mrs. Patricia Fleming (Birmingham, Michigan), and three grandchildren. He was the last surviving golfing brother. His obituary is the single most important document in this research — it named every sibling and confirmed the complete family structure.`,
        details: {
            "Born": "December 25, 1899, New Rochelle, NY",
            "Died": "~1971/1972, Daytona Beach, FL (age 72)",
            "Career": "Golf pro — Wykagyl CC, then Seabreeze G&TC (1948)",
            "Name Change": "Belfiore → Belfore",
            "Children": "Sammy Jr., Patricia Fleming",
            "Grandchildren": "Three"
        }
    },
    frank: {
        name: "Frank Belfiore",
        subtitle: "Francesco Belfiore — Golf Pro, Daytona Beach",
        tags: ["Golfing Brother", "Daytona Beach", "Golf Shop"],
        description: `Frank Belfiore (Francesco) was born around November 1897 in New Rochelle, NY. His parents are confirmed as Antonio Belfiore and Maria D. Circelli via Ancestry indexed records. Like his brothers, he became a professional golfer. He took over the golf shop at the club in Daytona Beach, Florida. He died April 21, 1968, in Daytona Beach. Three of the four Belfiore brothers followed each other to Florida — Sammy and Frank to Daytona Beach, Joseph to Michigan, and Michael stayed in New Rochelle.`,
        details: {
            "Born": "~November 1897, New Rochelle, NY",
            "Died": "April 21, 1968, Daytona Beach, FL",
            "Parents": "Antonio Belfiore & Maria D. Circelli (confirmed)",
            "Career": "Golf pro — ran golf shop at Daytona Beach club"
        }
    },
    joseph_golfer: {
        name: "Joseph Belfiore (The Golfer)",
        subtitle: "Golf Pro at Grosse Pointe, Michigan — NOT Seb's Grandfather",
        tags: ["Golfing Brother", "Grosse Pointe", "Michigan"],
        description: `Joseph Belfiore was the third golfing brother. He became golf pro at Grosse Pointe, Michigan, where he served "for many years" according to Sammy's obituary. He died before Sammy's obituary (~pre-1971). CRITICAL DISTINCTION: This Joseph (the golfer, Michael's brother) is NOT Seb's grandfather. Seb's grandfather Joseph was Michael's SON — almost certainly named after this uncle following the classic Italian naming tradition. There are two Josephs in the family.`,
        details: {
            "Born": "Unknown, New Rochelle, NY",
            "Died": "Before ~1971",
            "Career": "Golf pro at Grosse Pointe, Michigan",
            "Note": "Michael's brother — NOT Seb's grandfather"
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
        description: `Joseph Belfiore was Seb's grandfather — the son of Michael Kirtus Belfiore and Frances Towey (Michael's second wife). He was almost certainly named after his uncle Joseph (the golfer, Michael's brother), following the classic Italian naming tradition. He married Dorothy Belfiore, an Irish-American woman (not to be confused with Dorothy, Michael's daughter from his first marriage — two different Dorothys in the family). His SSN (218-30-3629) was issued with a Maryland prefix. He died in West Babylon, NY. His sons were Robert (Seb's father) and William (Seb's uncle).`,
        details: {
            "Born": "Unknown (likely 1920s, New Rochelle)",
            "Died": "West Babylon, NY",
            "SSN": "218-30-3629 (Maryland-issued)",
            "Father": "Michael Kirtus Belfiore",
            "Mother": "Frances Towey",
            "Wife": "Dorothy Belfiore (Irish-American)",
            "Children": "Robert Belfiore, William Belfiore",
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
        name: "Dorothy Belfiore",
        subtitle: "Seb's Grandmother — Joseph's Wife, Irish-American",
        tags: ["Grandmother", "Direct Line", "Irish-American"],
        description: `Dorothy Belfiore was Joseph Belfiore's wife and Seb's grandmother. She was Irish-American. Not to be confused with Dorothy Belfiore, Michael's daughter from his first marriage — two different Dorothys in the family. Dorothy and Joseph had two sons: Robert (Seb's father) and William.`,
        details: {
            "Husband": "Joseph Belfiore",
            "Heritage": "Irish-American",
            "Children": "Robert Belfiore, William Belfiore",
            "Note": "Different person from Dorothy (Michael's daughter)"
        }
    },
    robert: {
        name: "Robert Belfiore",
        subtitle: "Seb's Father",
        tags: ["Father", "Direct Line", "New Rochelle"],
        description: `Robert Belfiore is Seb's father, son of Joseph Belfiore. He was raised in the New Rochelle area. His brother William Belfiore provided the key documents — Michael's death certificate and Sammy's obituary — that started this entire genealogical research.`,
        details: {
            "Father": "Joseph Belfiore",
            "Children": "Seb Belfiore, Alexander Belfiore",
            "Residence": "New Rochelle area"
        }
    },
    william: {
        name: "William Belfiore",
        subtitle: "Seb's Uncle — The Family Archivist",
        tags: ["Uncle", "New Rochelle", "Family Records"],
        description: `William Belfiore was born around 1950 — he was "not even 2 years old" when Michael died in January 1952. He is the son of Joseph Belfiore and the brother of Robert (Seb's father). William adopted four children from Romania — Loredana, Ionel, Ramona, and Michaela — and has one US-born son, Aidan. Most importantly, William was the keeper of the family records — he provided Michael's death certificate and Sammy's obituary to the family, the two documents that unlocked this entire research.`,
        details: {
            "Born": "~1950",
            "Father": "Joseph Belfiore",
            "Children": "Loredana (adopted, Romania), Ionel (adopted, Romania), Ramona (adopted, Romania), Michaela (adopted, Romania), Aidan (US)",
            "Role": "Provided death certificate & obituary that started the research"
        }
    },
    seb: {
        name: "Seb Belfiore",
        subtitle: "Fifth Generation — Davis Island, Tampa",
        tags: ["You", "5th Generation", "Tampa FL"],
        description: `Seb Belfiore was born in 1989 in the United Kingdom. He holds dual US/UK citizenship. He is a product designer living on Davis Island, Tampa, FL. He married Valeria (German). He is the great-great-grandson of Anthony and Maria Belfiore — the immigrants from San Bartolomeo in Galdo. Through his father Robert, grandfather Joseph, great-grandfather Michael, and great-great-grandparents Anthony and Maria, the line stretches back five generations to the mountains of Campania. His son Enzo, born January 2026, carries the name into the sixth generation.`,
        details: {
            "Born": "1989, United Kingdom",
            "Citizenship": "UK, US (dual)",
            "Residence": "Davis Island, Tampa, FL",
            "Married": "Valeria (German)",
            "Occupation": "Product designer",
            "Heritage": "5th generation from the immigrants"
        }
    },
    enzo: {
        name: "Enzo Belfiore",
        subtitle: "Sixth Generation — Born January 2026",
        tags: ["6th Generation", "Tampa FL", "Triple Citizenship"],
        description: `Enzo Belfiore was born in January 2026 in Tampa, Florida. He holds triple citizenship: US, UK, and German. Named in the Italian tradition, he is the sixth generation from the immigrants Anthony and Maria. His great-great-great-grandparents left a mountain town in southern Italy in the 1890s. Six generations later, the Belfiore name continues on the Gulf Coast of Florida.`,
        details: {
            "Born": "January 2026, Tampa, FL",
            "Citizenship": "US, UK, German (triple)",
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
        name: "Sammy Belfore Jr.",
        subtitle: "Son of Sammy — Daytona Beach",
        tags: ["Next Generation", "Daytona Beach"],
        description: `Sammy Belfore Jr. lived in Daytona Beach, Florida. He was the son of Sammy Belfiore (Belfore) and was listed as a survivor in his father's obituary. He carried the changed spelling "Belfore."`,
        details: {
            "Father": "Sammy Belfiore/Belfore",
            "Residence": "Daytona Beach, FL"
        }
    },
    patricia_fleming: {
        name: "Mrs. Patricia Fleming",
        subtitle: "Daughter of Sammy — Birmingham, Michigan",
        tags: ["Next Generation", "Michigan"],
        description: `Patricia Fleming (née Belfore) lived in Birmingham, Michigan. She was the daughter of Sammy Belfiore/Belfore and was listed as a survivor in his obituary.`,
        details: {
            "Father": "Sammy Belfiore/Belfore",
            "Residence": "Birmingham, Michigan"
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
        subtitle: "Seb's Brother",
        tags: ["Generation 5", "Robert's Son"],
        description: `Alexander Belfiore is the son of Robert Belfiore and Seb's brother.`,
        details: {
            "Father": "Robert Belfiore",
            "Sibling": "Seb Belfiore"
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

    bioContent.innerHTML = `
        <h3 class="bio-name">${data.name}</h3>
        <p class="bio-subtitle">${data.subtitle}</p>
        <div class="bio-tags">${tagsHTML}</div>
        <p class="bio-description">${data.description}</p>
        ${detailsHTML}
    `;

    // On mobile, open sidebar
    if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.add('open');
    }
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
