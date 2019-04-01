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

For å ha en localhost med nettsiden kjørende: Bruk kommandoen `npm run start`

Etter dette vil du da ha en localhost på port 3000 (kan variere) (http://localhost:3000/) kjørende med live-updates fra endringer i koden. 

## Kjøre koden ved senere anledning

Såfremt alle dependencies er installert i prosjektmappen er det kort vei til å kjøre koden på localhost.

Naviger som tidligere inn i /src/finnutdanning/ og kjør så kommandoen `npm run start`

Du vil nå kjøre koden igjen lokalt på http://localhost:3000/ .

##Deploy til hjemmeside

Nettsiden kjøres på Google sine firebase-servere. Firebase har også en realtime-database som vi benytter i programvaren.
Dette gjør at integrasjonen mellom autorisering, database og hosting av nettside går sømløst. 

For å kunne deploye endringer til firebase hosting må du først ha editor-tilgang på prosjektets konsoll (https://console.firebase.google.com/). 
For å få dette, send en e-post til oddaow@stud.ntnu.no. Du vil så motta en invitasjonslenke på epost for å bli del av prosjektet.
Dette gir også tilgang til databasen i prosjektet, og er i hovedsak forbeholdt Admin-brukere ved Finn Utdanning.

Etter du har fått tilgang til prosjektet vil du nå kunne deploye nye versjoner av programvaren på få minutter.

Naviger som vanlig til /src/finnutdanning/, og kjør kommandoen `npm run build`

Dette lager en statisk build av programvaren som er klar til å lastes opp på en nettside. 

I `package.json` er det definert at filmappen for deployment er /build. Dersom `"public"`-feltet i `package.json` ikke er `"build"`, så må dette settes til det før neste trinn.

For å logge inn i prosjektet fra terminal må du kjøre kommandoen `firebase login`, for så å oppgi kredentialene du benytter til å logge inn i konsollen.
Dette behøver ikke å gjentas for hver gang man ønsker å deploye.

Etter dette kan du nå kjøre kommandoen `firebase deploy` og den statiske builden som ble generert vil lastes til 
https://finnutdanning.firebaseapp.com/ og oppdateres etter ca. 1 minutt. 

I firebase-konsollen er det mulig å rulle tilbake til en av de siste 3 (kan endres) releasene om nødvendig. Dette gjøres ved å gå inn
på "Hosting" i konsollen, og bla til du finner "finnutdanning release history". Her kan du velge releases, og enten slette eller rulle tilbake til en tidligere release.