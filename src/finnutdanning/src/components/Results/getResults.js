import React, {Component} from 'react'

export class GetResults extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Tar inn interessene som det søkes med
    const search = this.props.interests;

    // Lager en array med strings fra søket
    var interests = search.split(', ');

    // Henter json-filen som har alle mulige interesser og koblingen til studieretninger
    var jsonData = require('../../data/interests');

    // Lager en liste som i utgangspunktet sier at interessen ikke har noen studieretninger
    var listOfStudyProgramme = <li> Ingen studieretninger </li>;
    // En liste med alle studieretninger som kommer fra interessene
    var studiesList = []

    // Itererer gjennom alle interessene
    interests.forEach(interest => {
      // Sjekker om interessen eksisterer i json filen
      if (interest in jsonData) {
        // Henter ut en array med strings som er studieretninger
        var studies = eval("jsonData." + interest);
        // Itererer gjennom alle studieretningene som tilhører interessen
        studies.forEach(study => {
            // Sjekker om studieretningen allerede er i listen
            if (!studiesList.includes(study)) {
              // Om det er en ny studieretning settes den bakerst i listen
              studiesList.push(study);
            };
        });
      }
    });

    // Lager en htlm-liste for alle studieretningene som matchet med søket
    listOfStudyProgramme = studiesList.map((studie) =>
        <li> {studie} </li>
    );

    return(
      <div>
        <ul>
            { listOfStudyProgramme }
        </ul>
      </div>
    );}
}
