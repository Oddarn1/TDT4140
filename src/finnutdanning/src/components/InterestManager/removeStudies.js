import React, {Component} from 'react';
import {withAuthorization} from '../Session';

class RemoveStudies extends Component{
    constructor(props) {
        super(props);
        this.state={
          studiesList:[],
            studiesObject:[],
          loading:false,
            selectedStudy:null,
        };
        this.removeConfirm=this.removeConfirm.bind(this);
        this.cancel=this.cancel.bind(this);
        this.removeStudy=this.removeStudy.bind(this);
    }

    //Leser inn verdier fra firebase på mount
    componentDidMount(){
        this.setState({loading:true,});
        this.props.firebase.interests().on('value',snapshot=>{
            const obj=snapshot.val();
            console.log(obj);

            //Mapper et objekt av objekter til et array av objekter
            const studiesList=Object.keys(obj).map(key=>({
                ...obj[key],
                studyid:key
            }));
            //Går gjennom hvert interesseobjekt og legger til studieretninger fra alle
            let templist=[];
            for (let i=0;i<studiesList.length;i++){
                templist.push.apply(templist,studiesList[i].studies);
            }
            //Fjerner duplikate verdier
            const unique=[...new Set(templist)].sort();
            this.setState({
                //sutdiesObject blir en liste med objekter, studiesList blir en liste med strenger
                studiesObject:studiesList,
                studiesList:unique,
                loading: false,
            })
        })
    }

    //Fjerner lytter til database for å unngå memory leak
    componentWillUnmount(){
        this.props.firebase.interests().off();
    }

    //Velger studie som skal fjernes, får prompt om å bekrefte valget
    removeStudy(event){
        this.setState({selectedStudy:event.target.value});
    }

    //Avbryter valget av studie
    cancel(event){
        event.preventDefault();
        this.setState({selectedStudy:null});
    }

    //Går gjennom alle interesser i databasen og oppdaterer/fjerner studieretning herfra
    removeConfirm(event){
        const {studiesObject}=this.state;
        event.preventDefault();
        studiesObject.map(study=>{
            if(study.studies.includes(this.state.selectedStudy)){
                let studies=study.studies;
                //Hvis interessen kun har dette studiet, fjernes interessen helt fra databasen
                if (studies.length===1){
                    this.props.firebase.interest(study.studyid).remove()
                        .then(this.setState({selectedStudy: null}))
                        .catch(error=>console.log(error));
                    return;
                }
                //Fjern studiet fra interessens studielist og oppdater databasen
                studies.splice(studies.indexOf(this.state.selectedStudy),1);
                this.props.firebase.interest(study.studyid).set({
                    hits:study.hits,
                    studies:studies,
                }).catch(error=>console.log(error));
            }
        });
        this.setState({selectedStudy:null});
    }

    //Mapper alle studier til en knapp
    StudiesList(studylist){
        return(
            <div>
                {studylist.map(study=>(
                    <button key={study} value={study} onClick={this.removeStudy}>{study}</button>
                ))}
            </div>
        )
    }

    render(){
        const {studiesList,loading}=this.state;
        const studyList=this.StudiesList(studiesList);
        return(
            <div>
                <p>Dersom du sletter en studieretning som eksisterer alene i en interesse, vil interessen slettes.</p>
            {!loading&&studyList}
                {this.state.selectedStudy &&<div>
                <h3 style={{color: "red"}}>Er du sikker på at du ønsker å slette {this.state.selectedStudy}</h3>
                < button onClick={this.removeConfirm}>Bekreft</button>
                    &nbsp;<button onClick={this.cancel}>Avbryt</button>
                </div>
                }
            </div>
        )
    }

}

const condition=authUser=>! !authUser;

export default withAuthorization(condition)(RemoveStudies);