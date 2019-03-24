import React, {Component} from 'react';
import {withFirebase} from '../Firebase';

class GetResults extends Component {

    constructor(props) {
      super(props);
      this.state = {
        interests : Object,
        loading : false,
          searches:[],
          results:[],
          studies:[],
      };
      this.studies=[];
      this.saveRecentSearch=this.saveRecentSearch.bind(this);
    }

    componentDidMount() {
        this.setState({loading: true});
        this.props.firebase.interests().once('value', snapshot => {
            const interestObjects = snapshot.val();
            this.setState({
                interests: interestObjects,
            });
        });
        if (this.props.firebase.auth.currentUser) {
            let uid = this.props.firebase.auth.currentUser.uid;
            const uidlist = [uid];
            const uidprom = uidlist.map(uid => {
                return this.props.firebase.db.ref('searchhistory/' + uid).once('value', s => s);
            });
            Promise.all(uidprom)
                .then(obj => {
                    if (obj===null){
                        this.setState({
                            loading: false,
                        });
                    }else{
                    obj.map(child => {
                            this.setState({
                                searches: child.val()['searches'],
                                results: child.val()['results'],
                                loading: false,
                        })
                    })}
                }).then(()=>{
                    if(!this.props.recent){
                        this.saveRecentSearch();
                    }
            })//Hvis bruker ikke har gjort søk før:
                .catch(error => {
                    this.setState({loading: false});
                    if (!this.props.recent) {
                        this.saveRecentSearch()
                    }
                });
        }
    }

    componentWillUnmount() {
      this.props.firebase.interests().off();
      this.props.firebase.db.ref("searchhistory").off();
    }

    saveRecentSearch(){
        const {searches,results}=this.state;
        const uid=this.props.firebase.auth.currentUser.uid;
            let output = "";
            for (let i = 0; i < this.studies.length; i++) {
                output += this.studies[i].studyProgramme + ", ";
            }
            searches.unshift(this.props.query);
            results.unshift(output.substr(0, output.length - 2));
            this.props.firebase.db.ref('searchhistory/' + uid).set({
                searches: searches.slice(0,5),
                results: results.slice(0,5),
                uid: uid
            })
        }

        interestList(){
            const interests=this.state.interests;
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
                        var weight = 1 + 1/studies.length;
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


                this.studies=studiesList.slice(0,5);
                if (this.props.recent){
                    studiesList=this.props.results.split(', ');
                    listOfStudyProgramme=studiesList.map(study=><li>{study}</li>)
                }
                else {
                    // Lager en html-liste for alle studieretningene som matchet med søket
                    listOfStudyProgramme = studiesList.length === 0 ?
                        <li> Ingen studieretninger </li> : studiesList.slice(0, 5).map((studie) =>
                            <li> {studie.studyProgramme} {/*{studie.relevance}*/} </li>
                        );
                }
                return listOfStudyProgramme;
            }
        }

    render() {

      const {loading}=this.state;
      const listOfStudyProgramme=this.interestList();

      return(
        <div>
            <p>Ditt søk: {this.props.query}</p>
            {!loading && <h1>Resultat: </h1>}
            <ul>
              { listOfStudyProgramme }
          </ul>
        </div>
      );}
    }


export default withFirebase(GetResults);
