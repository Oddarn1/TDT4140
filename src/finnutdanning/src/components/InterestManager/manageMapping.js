import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import * as ROLES from '../../constants/roles';


class MappingManager extends Component{
    constructor(props){
        super(props);
        this.state={
            selectedStudies:[],
            unselectedStudies:[],
            loading: false,
            interest:"",
        };
        this.onSelect=this.onSelect.bind(this);
        this.onUnselect=this.onUnselect.bind(this);
        this.onChange=this.onChange.bind(this);
        this.submit=this.submit.bind(this);
    }

    //Leser inn alle studieprogrammer i studyprogrammes-objektet i firebase.
    componentDidMount(){
        this.setState({
            loading:true,
        });
        this.props.firebase.db.ref('studyprogrammes').on('value',s=>{
            this.setState({unselectedStudies:s.val().sort()})
        });
        this.setState({loading:false});
    }

    //Fjerner lytter til databasen for å unngå memory-leaks
    componentWillUnmount(){
        this.props.firebase.db.ref('studyprogrammes').off();
    }

    //Mapper liste over valgte knapper med studieprogram så disse vises adskilt
    SelectedList(selected){
        return(
            <div>
                {selected.map((sel,index)=>(
                    <button value={index} style={{backgroundColor:'lightgreen'}} onClick={this.onUnselect}>{sel+(" \u24E7".toUpperCase())}</button>
                ))}
            </div>
        )
    }

    //Mapper liste over studieprogram til knapper
    UnselectedList(unselected){
        return(
            <div>
                {unselected.map((unsel,index)=>(
                    <button value={index} onClick={this.onSelect}>{unsel}</button>
                ))}
            </div>
        )
    }

    //Uvalgte knapper føres til valgte
    onSelect(event){
        const unselected=[...this.state.unselectedStudies];
        const temp = unselected.splice(event.target.value,1)[0];
        this.setState(prevState=>({
            selectedStudies:[...prevState.selectedStudies,temp],
            unselectedStudies:unselected,
        }));
    }

    //Valgte knapper føres til uvalgte
    onUnselect(event){
        const selected=[...this.state.selectedStudies];
        const temp = selected.splice(event.target.value,1)[0];
        this.setState(prevState=>({
            unselectedStudies:[...prevState.unselectedStudies,temp],
            selectedStudies:selected,
        }));
    }

    //Oppdaterer inputfelt for interessenavn
    onChange(event){
        event.preventDefault();
        this.setState({
            interest:event.target.value,
        });
    }

    //Går over valgte studier og setter disse inn i studies for interesse og skriver dette til database.
    submit(event){
        event.preventDefault();
        this.props.firebase.interest(this.state.interest).set({
            hits:0,
            studies: this.state.selectedStudies,
        }).then(()=>{this.setState(prevState => ({
            unselectedStudies:[...prevState.unselectedStudies,this.state.selectedStudies].sort(),
            selectedStudies:[],
            interest:"",
            }))})
            .catch(error=>console.log(error))
    }

    render(){
        const {selectedStudies,unselectedStudies}=this.state;
        const selectedList=this.SelectedList(selectedStudies);
        const unselectedList=this.UnselectedList(unselectedStudies);

        return(<div>
            <input type="text" onChange={this.onChange} value={this.state.interest} placeholder={"Fyll inn navn på interesse her:"}/>
            <button onClick={this.submit}>Lagre interessemapping</button>
            <br/>
            <p>Valgte studieretninger:</p>
            {selectedList}
            <p>Valgbare studieretninger:</p>
            {unselectedList}
        </div>)
    }

}

const condition=authUser=>authUser&&(authUser.role!==ROLES.USER);

export default withAuthorization(condition)(MappingManager);