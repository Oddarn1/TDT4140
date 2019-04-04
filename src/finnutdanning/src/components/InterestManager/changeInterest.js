import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import * as ROLES from '../../constants/roles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const INITIAL_STATE={
    selectedInterest:null,
    loading:false,
    mapping:[],
};

class ChangeInterest extends Component{
    constructor(props){
        super(props);
        this.state={
            interests:[],
            selectedInterest:null,
            loading:false,
            mapping:[],
        };
        this.openMapping=this.openMapping.bind(this);
        this.addMapping=this.addMapping.bind(this);
        this.mapChange=this.mapChange.bind(this);
        this.submit=this.submit.bind(this);
    }

    //Leser inn alle interesser i databasen når komponenten mountes
    componentDidMount(){
        this.setState({loading:false});
        this.props.firebase.interests().on('value',snapshot=>{
            const obj=snapshot.val();
            const interestList=Object.keys(obj).map(key=>({
                ...obj[key],
                    interestName:key
            }));
            this.setState({interests: interestList,
            loading:false})
            }
        )
    }

    //Fjerner lytter til database for å unngå memory leaks
    componentWillUnmount(){
        this.props.firebase.interests().off();
    }

    //Åpner valgt interesse og setter state deretter for bruk i visning av interessen
    openMapping(event){
        event.preventDefault();
        this.setState({mapping:this.state.interests[event.currentTarget.value]['studies'],
        selectedInterest:this.state.interests[event.currentTarget.value]});
    }

    //Oppdaterer studieretningene som tilhører interessen som er valgt
    mapChange(event,index){
        const mapping=[...this.state.mapping];
        mapping[index]=event.currentTarget.value;
        this.setState({mapping});
    }

    //Når pluss-knappen trykkes åpnes et nytt tekstfelt som kan fylles ut
    addMapping(event){
        event.preventDefault();
        this.setState(prevState=>({mapping:[...prevState.mapping,""]}))
    }

    //Filtrerer ut tomme feltet i mapping-arrayet og skriver til firebase med ny mapping
    submit(event){
        const {mapping}=this.state;
        var mappingfilter=mapping.filter(elem=>elem!=="");
        event.preventDefault();
        this.props.firebase.interest(this.state.selectedInterest.interestName).set({
            hits:this.state.selectedInterest['hits'],
            studies: mappingfilter,
        }).then(()=>this.setState({...INITIAL_STATE}))
            .catch(error=>console.log(error))
    }

    //Mapper interesser til knapper som kan trykkes.
    InterestList({interests}){
        return(
        <div className="interestChange">
            {interests.map((interest,index)=>
                <Button variant="contained" style={{padding:15,margin:10,width:200}} name="mapping" value={index} onClick={this.openMapping}>{interest.interestName}</Button>
            )}
        </div>)
    }

    //Mapper interesse med tilhørende studieretning til tekstfelter som kan endres
    MappingList(mapping){
        return (
            <div style={{paddingLeft:10}}>
                <Typography variant={"body1"} gutterBottom>For å slette mapping la feltet stå tomt</Typography><br/>
                {mapping.map((mapp, index) =>
                    <TextField variant="outlined" type="text" style={{marginBottom:10}} value={this.state.mapping[index]}
                           onChange={(event) => this.mapChange(event, index)} label={"Studieretning"+(index+1)}/>)
                }
                {mapping.length<=4&&<Button variant="contained" style={{padding:15}} onClick={this.addMapping}> + </Button>}
                </div>
        )
    }

    render(){
        const {interests,mapping}=this.state;
        const interestList=this.InterestList({interests});
        const mappingList=this.MappingList(mapping);
        const isValid=mapping.filter(p=>p!=="").length!==0;
        return(
            <div className="changeInterests">
                {mapping.length!==0&&
                <form onSubmit={this.submit}>
                    {mappingList}
                    <Button style={{padding:15,margin:10}} variant="contained" disabled={!isValid}>Oppdater</Button>
                </form>}
                {interestList}
            </div>
        )
    }

}

const condition=authUser=>authUser&&(authUser.role===ROLES.COUNSELOR||authUser.role===ROLES.ADMIN);

export default withAuthorization(condition)(ChangeInterest);