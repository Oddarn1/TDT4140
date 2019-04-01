import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


class DeleteInterest extends Component{
    constructor(props){
        super(props);
        this.state={
            selectedInterest:null,
            interests:[],
            loading: false,
        };
        this.deleteInterest=this.deleteInterest.bind(this);
        this.cancel=this.cancel.bind(this);
        this.deleteConfirm=this.deleteConfirm.bind(this);
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

    //Avbryter sletting
    cancel(event){
        event.preventDefault();
        this.setState({selectedInterest:null});
    }

    //Fjerner lytter på databasen ved unmount for å unngå memory-leaks
    componentWillUnmount(){
        this.props.firebase.interests().off();
    }

    //Setter valgt interesse til state, får prompt om "Vil du virkelig slette.."
    deleteInterest(event){
        this.setState({selectedInterest:this.state.interests[event.target.value]});
    }

    //Bekrefter sletting, fjerner denne fra databasen og nullstiller valget av interesse.
    deleteConfirm(event){
        event.preventDefault();
        this.props.firebase.interest(this.state.selectedInterest.interestName).remove()
            .then(this.setState({selectedInterest: null}))
            .catch(error=>console.log(error))
    }

    //Mapper interesser til knapper som kan velges
    InterestList({interests}){
        return(
            <div className="interestChange">
                {interests.map((interest,index)=>
                    <Button name="mapping" value={index} onClick={this.deleteInterest} variant="contained" style={{margin:10}} >
                        {interest.interestName}
                    </Button>
                )}
            </div>)
    }


    render(){
        const {interests,selectedInterest}=this.state;
        const interestList=this.InterestList({interests});
        return(
            <div>
                {interestList}
                {selectedInterest&&
                <div>
                    <Typography component="h3" variant = "h6" gutterBottom style = {{padding: 24, color:"red"}}>
                        Er du sikker på at du ønsker å slette {selectedInterest.interestName}?
                    </Typography>
                    <Button variant="contained" onClick={this.deleteConfirm} style={{padding:5, margin:24}}>
                        Bekreft
                    </Button>
                    &nbsp;
                    <Button variant="contained" onClick={this.cancel} style={{padding:5}}>
                        Avbryt
                    </Button>
                </div>}
            </div>
        )
    }
}

const condition=authUser=>! !authUser;

export default withAuthorization(condition)(DeleteInterest);
