## Kjøre koden første gang lokalt

For å kjøre koden må node.js lastes ned: 
https://nodejs.org/en/

Ved installasjon følger også npm package manager. Npm benyttes for å lage production builds og kjøre kode lokalt.

Etter installering vil det kanskje være nødvendig å endre på miljøvariabler og legge til bin-mappen i installasjonsmappen til npm i path.

Etter installasjon vil det være nødvendig å navigere inn i mappen /src/finnutdanning/ ved hjelp av kommandoen `cd src/finnutdanning`.


Du vil nå være i root-folderen for prosjektet, finnutdanning. Grunnen til at det må navigeres inn i root-folder oppstod ved opprettelse av prosjektet,
og vi har enda til gode å finne en god løsning på å trekke root-folderen ut av git-mappen uten å miste funksjonalitet for git-synkronisering.

For å installere alle dependencies i prosjektet som er nødvendig for å kjøre programmet må du kjøre kommandoen: `npm install`

Dette legger til alle dependencies som er listet i package.json.

Etter at alle dependencies er installert er veien til å kjøre programmet lokalt kort.

For å ha en localhost med nettsiden kjørende: Bruk kommandoen `npm run-script start`

Etter dette vil du da ha en localhost på port 3000 (kan variere) (http://localhost:3000/) kjørende med live-updates fra endringer i koden. 

## Kjøre tester

Kort tid etter prosjektet begynte ble vi enige om et større fokus på akseptansetester. I vår gruppes tilpasning av Scrum-prossessen
hadde vi ikke mulighet til å legge til rette for unit-testing av ønsket funksjonalitet inniblant en travel studenthverdag. Vi 
jobbet heller ikke i samarbeid med produkteier om testhistorier, men fikk heller disse bekreftet/avkreftet som ønsket funksjonalitet
etter fortløpende møter med produkteier. Dette gjorde det vanskelig å spesifisere hva vi nøyaktig ville teste på underveis.

Vi har nå ønsket funksjonalitet som er stabil, så neste steg vil naturligvis være å utvikle tester som vil bevare denne funksjonaliteten
videre i programvarens levetid. 

Med andre ord er det enkelt å kjøre testene: Det er for øyeblikket ingen å kjøre.

## Kjøre koden ved senere anledning

Såfremt alle dependencies er installert i prosjektmappen er det kort vei til å kjøre koden på localhost.

Naviger som tidligere inn i /src/finnutdanning/ og kjør så kommandoen `npm run-script start`

Du vil nå kjøre koden igjen lokalt på http://localhost:3000/ .

## Deploy til hjemmeside

Nettsiden kjøres på Google sine firebase-servere. Firebase har også en realtime-database som vi benytter i programvaren.
Dette gjør at integrasjonen mellom autorisering, database og hosting av nettside går sømløst. 

For å kunne deploye endringer til firebase hosting må du først ha editor-tilgang på prosjektets konsoll (https://console.firebase.google.com/). 
For å få dette, send en e-post til oddaow@stud.ntnu.no. Du vil så motta en invitasjonslenke på epost for å bli del av prosjektet.
Dette gir også tilgang til databasen i prosjektet, og er i hovedsak forbeholdt Admin-brukere ved Finn Utdanning.

Etter du har fått tilgang til prosjektet vil du nå kunne deploye nye versjoner av programvaren på få minutter.

Naviger som vanlig til /src/finnutdanning/, og kjør kommandoen `npm run-script build`

Dette lager en statisk build av programvaren som er klar til å lastes opp på en nettside. 

I `package.json` er det definert at filmappen for deployment er /build. Dersom `"public"`-feltet i `package.json` ikke er `"build"`, så må dette settes til det før neste trinn.

For å logge inn i prosjektet fra terminal må du kjøre kommandoen `firebase login`, for så å oppgi kredentialene du benytter til å logge inn i konsollen.
Dette behøver ikke å gjentas for hver gang man ønsker å deploye.

Etter dette kan du nå kjøre kommandoen `firebase deploy` og den statiske builden som ble generert vil lastes til 
https://finnutdanning.firebaseapp.com/ og oppdateres etter ca. 1 minutt. 

I firebase-konsollen er det mulig å rulle tilbake til en av de siste 3 (kan endres) releasene om nødvendig. Dette gjøres ved å gå inn
på "Hosting" i konsollen, og bla til du finner "finnutdanning release history". Her kan du velge releases, og enten slette eller rulle tilbake til en tidligere release.

## Ekstern API

Vi har hentet et datasett fra https://data.norge.no/ som inneholder en beskrivelse av over 350 ulike utdanninger. Utdanningene er skrevet av redaksjonen hos utdanning.no.
Datasettet er en .xml-fil og lister alle studieretningene i Atom-format.

En direkte link til ressursen: https://utdanning.no/data/atom/utdanningsbeskrivelse

Metode for å hente ut studieretningene:
1. Finn en xml-viwer (F.eks. https://countwordsfree.com/xmlviewer) (Dokumentet er stort, så en side som er effektiv vil være nyttig).
2. Legg inn linken for dataen til utdanning.no
3. Gjør om xml-daten til json-data. (Ligger inne på de fleste nettsider med xml-viewer)
4. Lagre dataen og importer (copy/paste) de inn i en side for json-queries (F.eks. http://www.jsonquerytool.com/)
5. Spørringen for å hente ut en liste med alle studieretninger: $.feed.entry.[*].title.__text
6. Du vil så få ut en ny liste med data som skal være alle studieretningene fra datasettet til utdanning.no.

I firebase-konsollen er det egen funksjonalitet for å importere .json-filer, samt eksportere for å ta backup av databasen. 

Under feltet "studyprogrammes" ligger listen over studieretninger, den er gjort tilgjengelig for veiledere og admins ved Finn Utdanning som
kan sette en kobling til en interesse som vil dukke opp for brukere som vil søke på interesser. 

Det er viktig at man velger "studyprogrammes" i databasen før man går til "import JSON-file", hvis ikke vil hele databasen bli overskrevet av importeringen.
Det anbefales å ta en "export JSON-file" på hele databasen før dette gjøres, som et sikkerhetstiltak for å ha en backup.