import React, {Component} from 'react';
import {withFirebase} from '../Firebase';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';
import * as ROUTES from '../../constants/routes';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import './index.css';

class GetResults extends Component {

    constructor(props) {
      super(props);
      this.state = {
        interests : Object,
        loading : false,
          searches:[],
          results:[],
          timestamps:[],
          weights:[],
          studies:[],
      };
      this.studies=[];
      this.newSearch=this.newSearch.bind(this);
      this.saveRecentSearch=this.saveRecentSearch.bind(this);
    }

    componentDidMount() {
        this.setState({loading: true});
        //Laster inn alle interesser
        this.props.firebase.interests().once('value', snapshot => {
            const interestObjects = snapshot.val();
            this.setState({
                interests: interestObjects,
            });
        });
        //Laster inn nylige søk dersom en bruker er logget inn
        if (this.props.firebase.auth.currentUser) {
            let uid = this.props.firebase.auth.currentUser.uid;
            const uidlist = [uid];
            /*Tar uidlist og returnerer en liste med promises per element, bare ett i dette tilfellet.
             * Bruk av promise var i dette tilfellet nødvendig for å holde styr på asynkrone handlinger
             * mot databasen. Databasen fikk ikke lest inn søkehistorikk på bruker før bruker var bekreftet
             * som innlogget på siden.
             * Bruk av uidlist er en workaround for dette.*/

            const uidprom = uidlist.map(uid => {
                return this.props.firebase.db.ref('searchhistory/' + uid).once('value', s => s);
            });
            /*Resolver alle promises i listen og bruker callbacket for å gjøre handlinger på objektet som er hentet
            *fra databasen, dette er den foreløpige listen med tidligere søk*/
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
                                timestamps:child.val()['timestamp'],
                                weights:child.val()['weights'],
                                loading: false,
                        })
                    })}
                    //Lagrer søket dersom props-verdien av recent ikke er satt, altså at bruker kommer fra eget søk, ikke nylige
                }).then(()=>{
                    if(!this.props.recent){
                        this.saveRecentSearch();
                    }
            })//Hvis bruker ikke har gjort søk før: (Dette er også en workaround for en side-breaking bug for nye brukere:) )
                .catch(error => {
                    this.setState({loading: false});
                    if (!this.props.recent) {
                        this.saveRecentSearch()
                    }
                });
        }else{
            this.setState({loading:false})
        }
    }

    componentWillUnmount() {
      this.props.firebase.interests().off();
      this.props.firebase.db.ref("searchhistory").off();
    }

    //Formaterer tidsstempel til nylige søk
    getTime(){
        const currentDate=new Date();
        const time=currentDate.getDate()+"."+(currentDate.getMonth()+1)+"."+currentDate.getFullYear()+" "+currentDate.getHours()+":"+(currentDate.getMinutes()<10?"0"+currentDate.getMinutes():currentDate.getMinutes());
        return time;
    }

    saveRecentSearch(){
        //MAINTAINER: Denne variabelen endrer hvor mange nylige søk som skal lagres av gangen.
        const noOfRecent=5;
        const {searches,results,timestamps,weights}=this.state;
        const time=this.getTime();
        const uid=this.props.firebase.auth.currentUser.uid;
        console.log(this.studies);
            let output = [];
            let weight="";
            for (let i = 0; i < this.studies.length; i++) {
                output.push(this.studies[i].studyProgramme);
                weight+=Math.floor(50+(this.studies[i].reason.length/this.props.query.split(", ").length)*50)+", ";
            }
            //Setter inn elementer først i temp-listene
            searches.unshift(this.props.query);
            results.unshift(output);
            timestamps.unshift(time);
            weights.unshift(weight.substr(0,weight.length-2));
            //Skriver nye lister til firebase
            this.props.firebase.db.ref('searchhistory/' + uid).set({
                timestamp: timestamps.slice(0,noOfRecent),
                searches: searches.slice(0,noOfRecent),
                results: results.slice(0,noOfRecent),
                weights: weights.slice(0,noOfRecent),
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
                        /*MAINTAINER: Denne funksjonen kan justeres for å få vekting annerledes*/
                        var weight = 1 + 1/studies.length;
                        // Itererer gjennom alle studieretningene som tilhører interessen
                        studies.forEach(study => {
                            // Sjekker om studieretningen allerede er i listen
                            if (!studiesList.some(e => e.studyProgramme === study)) {
                                // Lager et nytt objekt for denne studieretningen
                                const newStudy = {studyProgramme: study, relevance: 0, reason: []};
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
                //Dersom bruker kommer fra nylige søk displayes resultat og vekting for dette
                if (this.props.recent){
                    studiesList=this.props.results;
                    const weight=this.props.location.state.weights.split(", ");
                    console.log(weight);
                    console.log(studiesList);
                    listOfStudyProgramme=studiesList.map((study,index)=><li className="listElem">
                        <div className="study">{study}</div>
                        <div className="weight">{weight[index]+"%"}</div> </li>)
                }
                else {
                    // Lager en html-liste for alle studieretningene som matchet med søket
                    listOfStudyProgramme = studiesList.length === 0 ?
                        //MAINTAINER: I slice-funksjonen kan man velge hvor mange studieretninger som skal vises i resultater.
                        //MAINTAINER: I Math.floor-funksjonen kan prosentberegningen av relevanse justeres.
                        <li> Ingen studieretninger </li> : studiesList.slice(0, 5).map((studie) =>
                            <li className="listElem"> <div className="study">{studie.studyProgramme}</div>
                                <div className="weight">
                                    {Math.floor(50+((studie.reason.length/(query.length))*50))+"%"}</div></li>
                        );
                }
                return listOfStudyProgramme;
            }
      };

        newSearch(event){
            this.props.history.push({
                pathname:ROUTES.LANDING,
                state:{query:event.target.value.split(", "),
                newsearch:true}
            })
        }

    render() {

      const {loading}=this.state;
      const listOfStudyProgramme=this.interestList();

      return(
        <div>
            <Typography component="h4" variant = "h7" style={{padding:5}}>{this.props.recent?"Du søkte på: ":"Ditt søk: " }{this.props.query}</Typography>
                <button value={this.props.query} onClick={this.newSearch}>Bruk i nytt søk</button>
            {loading && <div>Loading ...</div>}
            {!loading && <Typography component="h2" variant = "h4" style = {{padding: 15}}>Resultat</Typography>}
            <List className="studylist">
                <Typography className="study" component="h4" variant = "h7">Studieretning</Typography>
                <Typography className="weight" component="h4" variant = "h7">Relevanse</Typography>
              { listOfStudyProgramme }
          </List>
        </div>
      );
    }
    }

export default compose(withRouter,withFirebase)(GetResults);
