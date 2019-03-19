import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import * as ROLES from '../../constants/roles';

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

    componentWillUnmount(){
        this.props.firebase.interests().off();
    }

    openMapping(event){
        event.preventDefault();
        this.setState({mapping:this.state.interests[event.target.value]['studies'],
        selectedInterest:this.state.interests[event.target.value]});
    }

    mapChange(event,index){
        const mapping=[...this.state.mapping];
        mapping[index]=event.target.value;
        this.setState({mapping});
    }

    addMapping(event){
        event.preventDefault();
        this.setState(prevState=>({mapping:[...prevState.mapping,""]}))
    }
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

    InterestList({interests}){
        return(
        <div className="interestChange">
            {interests.map((interest,index)=>
                <button name="mapping" value={index} onClick={this.openMapping}>{interest.interestName}</button>
            )}
        </div>)
    }

    MappingList(mapping){
        return (
            <div>
                <label>For å slette mapping la feltet stå tomt</label><br/>
                {mapping.map((mapp, index) =>
                    <input type="text" value={this.state.mapping[index]}
                           onChange={(event) => this.mapChange(event, index)} placeholder="Studieretning"/>)
                }
                {mapping.length<=4&&<button onClick={this.addMapping}> + </button>}
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
                {interestList}
                {mapping.length!==0&&
                <form onSubmit={this.submit}>
                    {mappingList}
                    <button disabled={!isValid}>Oppdater</button>
                </form>}
            </div>
        )
    }

}

const condition=authUser=>! !authUser; {/*authUser.role===ROLES.COUNSELOR||authUser.role===ROLES.EMPLOYEE;*/}

export default withAuthorization(condition)(ChangeInterest);