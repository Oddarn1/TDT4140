import React, {Component} from 'react';
import {withAuthorization} from '../Session';

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

    cancel(event){
        event.preventDefault();
        this.setState({selectedInterest:null});
    }

    componentWillUnmount(){
        this.props.firebase.interests().off();
    }

    deleteInterest(event){
        this.setState({selectedInterest:this.state.interests[event.target.value]});
    }

    deleteConfirm(event){
        event.preventDefault();
        this.props.firebase.interest(this.state.selectedInterest.interestName).remove()
            .then(this.setState({selectedInterest: null}))
            .catch(error=>console.log(error))
    }

    InterestList({interests}){
        return(
            <div className="interestChange">
                {interests.map((interest,index)=>
                    <button name="mapping" value={index} onClick={this.deleteInterest}>{interest.interestName}</button>
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
                   <h3 style={{color:"red"}}>Er du sikker på at du ønsker å slette {selectedInterest.interestName}?</h3>
                    <button onClick={this.deleteConfirm}>Bekreft</button>
                    &nbsp;<button onClick={this.cancel}>Avbryt</button>
                </div>}
            </div>
        )
    }
}

const condition=authUser=>! !authUser;

export default withAuthorization(condition)(DeleteInterest);
