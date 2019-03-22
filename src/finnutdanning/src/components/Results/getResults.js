import React, {Component} from 'react';
import {withFirebase} from '../Firebase';

import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

class GetResults extends Component {

    constructor(props) {
      super(props);
      this.state = {
        interests : Object,
        loading : false
      }
    }

    componentDidMount(){

      this.setState({ loading: true });
      this.props.firebase.interests().once('value', snapshot => {
          const interestObjects = snapshot.val();
          this.setState({
              interests: interestObjects,
              loading: false
          });
      });
    }

    componentWillUnmount() {
      this.props.firebase.interests().off();
    }

    render() {

      const {interests, loading}=this.state;

      // Tar inn interessene som det søkes med
      const search = this.props.query;

      // Lager en array med strings fra søket
      let query = search==="" ? ["Ingen interesser angitt"]:search.split(', ');

      // Lager en liste som i utgangspunktet sier at interessen ikke har noen studieretninger
      var listOfStudyProgramme = <li> Ingen studieretninger </li>;

      // En liste med alle studieretninger som kommer fra interessene
      var studiesList = [];

      if (interests != null) {
        // Itererer gjennom alle interessene
        query.forEach(interest => {
          // Sjekker om interessen eksisterer i json filen
          if (interest in interests) {

            // Øker hits med en for den søkte interessen
            var hits = this.props.firebase.hits(interest);
            hits.transaction(function (currentHits) {
              return (currentHits || 0) + 1;
            });

            // Henter ut en array med strings som er studieretninger
            var studies = interests[interest]["studies"];
            // Regner ut en vekting basert på antall studier mappet til interessen
            var weight = 1 + 1/studies.length
            // Itererer gjennom alle studieretningene som tilhører interessen
            studies.forEach(study => {
                // Sjekker om studieretningen allerede er i listen
                if (!studiesList.some(e => e.studyProgramme === study)) {
                  // Lager et nytt objekt for denne studieretningen
                  const newStudy = {studyProgramme: study, relevance: 0, reason: []}
                  // Dette objektet legges til listen
                  studiesList.push(newStudy);
                }
                // Oppdaterer liste over studier
                studiesList.forEach(element =>{
                  if (element.studyProgramme === study){
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
            <ListItem >
              <Typography component="h5" variant = "overline">
              {studie.studyProgramme}
              </Typography>
            </ListItem>
        );
      };


      return(
        <div>
            <Typography component="h5" variant = "overline" style={{padding:5}}>Dine søk: {search}</Typography>
            {loading && <div>Loading ...</div>}
            {!loading && <Typography component="h2" variant = "h4" style = {{padding: 15}}>Resultat</Typography>}
            <List>
              { listOfStudyProgramme }
          </List>
        </div>
      );}
    }


export default withFirebase(GetResults);
