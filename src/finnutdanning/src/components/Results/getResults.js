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
    var studiesList = [];
    
    // Itererer gjennom alle interessene
    interests.forEach(interest => {
      // Sjekker om interessen eksisterer i json filen
      if (interest in jsonData) {
        // Henter ut en array med strings som er studieretninger
        var studies = eval("jsonData." + interest);
        // Regner ut en vekting basert på antall studier mappet til interessen
        var weight = 1 + 1/studies.length
        // Itererer gjennom alle studieretningene som tilhører interessen
        studies.forEach(study => {
            // Sjekker om studieretningen allerede er i listen
            if (!studiesList.some(e => e.name === study)) {
              // Lager et nytt objekt for denne studieretningen
              const newStudy = {studyProgramme: study, relevance: 0, reason: []}
              // Dette objektet legges til listen
              studiesList.push(newStudy);
            };
            // Oppdaterer liste over studier
            studiesList.forEach(element =>{
              if (element.studyProgramme == study){
                element.relevance += weight;
                element.reason.push(interest);
              }
            })
        });
      }
    });
    
    // Sorterer listen basert på relevans
    studiesList.sort(function(a, b){
      return b.relevance - a.relevance;
    });

    // Lager en html-liste for alle studieretningene som matchet med søket
    listOfStudyProgramme = studiesList.length===0?<li> Ingen studieretninger </li>: studiesList.slice(0,5).map((studie) =>
        <li> {studie.studyProgramme} {studie.relevance} </li>
    );

    return(
      <div>
        <ul>
            { listOfStudyProgramme }
        </ul>
      </div>
    );}
}
