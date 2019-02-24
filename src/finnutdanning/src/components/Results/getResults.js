import React, {Component} from 'react'

export class GetResults extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Tar inn interessene som det søkes med
    const search = this.props.interest;

    // Henter json-filen som har alle mulige interesser og koblingen til studieretninger
    var jsonData = require('../../data/interests');

    // Lager en liste som i utgangspunktet sier at interessen ikke har noen studieretninger.
    var listOfStudyProgramme = <li> Ingen studieretninger </li>;

    // Sjekker om interessen finnes i json-filen
    if (this.props.interest in jsonData) {

      // Henter en array med studieretninger til den tilhørende interessen
      var studies = eval("jsonData." + search);

      // Legger alle studieretningene inn listen (HER MÅ VI ENDRE FOR Å BEGRENSE OG VELGE NÅR VI HAR FLERE INTERESSER)
      try {
        listOfStudyProgramme = studies.map((studie) =>
          <li> {studie} </li>
      )} catch {

      };
    };

    return(
      <div>
        <ul>
            { listOfStudyProgramme }
        </ul>
      </div>
    );}
}
