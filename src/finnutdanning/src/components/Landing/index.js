import React, {Component} from 'react';
import {withRouter,Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {compose} from 'recompose';
import {withAuthentication} from '../Session';
import RecentSearches from "./recentSearches";
import './index.css';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Landing extends Component {
    constructor(props){
        super(props);
        this.state={
          search: "",
            showMenu:false,
            selectedInterests:[],
            unselectedInterests:[],
            queriedInterests:[],
            loading: false,
        };
        this.submit=this.submit.bind(this);
        this.intersearch=this.intersearch.bind(this);
        this.select=this.select.bind(this);
        this.unselect=this.unselect.bind(this);
    }

    //Leser inn interesser i databasen
    componentDidMount(){
        this.setState({
            loading:true,
        });
        this.props.firebase.interests().once('value',snapshot=>{
            const obj=snapshot.val();
            if (obj===null){
                this.setState({loading:false});
                return;
            }
            const interestList=Object.keys(obj).map(key=>({
                ...obj[key],
                interestid:key,
            }));
            const interests=[];
            //Sjekker om bruker er redirigert fra "Bruk i nytt søk" - knappen i results
            try{
                if(this.props.location.state.newsearch) {
                    this.props.location.state.query.map(study=>{
                        //Går over og flytter allerede valgte interesser over til riktig
                        interestList.map((inter,index)=>{
                            if (study===inter.interestid){
                                interests.push(interestList.splice(index,1)[0])
                            }
                    })}
                    );
                }
            }catch(error){
                console.log(error)
            }
            this.setState({
                unselectedInterests:interestList,
                selectedInterests:interests,
                loading:false,
            });

        });

    }

    //Setter sammen søkestreng som brukes i results. Dette omgjøres til array igjen i getresults men inntil videre funker dette
    makeString(){
        let search="";
        this.state.selectedInterests.map(inter=>{
            search+=inter.interestid+", ";
        });
        return search;
    }


    /*Omdirigerer bruker til resultater når bruker søker*/
    submit() {
        let search=this.makeString();
        this.props.history.push({
            pathname: ROUTES.RESULTS,
            state: {query: search.substring(0,search.length-2)}
        })
    }

    //Foretar søk blant uvalgte interesser basert på tekstfelt
    intersearch(event){
        this.setState({search: event.target.value,
        queriedInterests:[]});
        this.state.unselectedInterests.map(inter=>{
            if (inter.interestid.includes(this.state.search)){
                this.setState(prevState=>({
                        queriedInterests:[...prevState.queriedInterests,inter]
                    })
                )
            }
        });
    }

    //Mapper valgte interesser til knapper for å displaye disse for seg selv
    SelectedButtons(selected){
        return(
            <div>
                {selected.map((sel,index)=>(
                    <Button value={index} onClick={this.unselect}
                            variant="contained" style={{padding:15, margin:10,backgroundColor:"lightgreen"}}>
                        {sel.interestid+(" \u24E7".toUpperCase())}
                    </Button>
                ))}
            </div>
        )
    }

    //Mapper uvalgte interesser til knapper for å displaye disse
    UnselectedButtons(unselected){
        return(
            <div>
                {unselected.map((unsel,index)=>(
                    <Button value={index} onClick={this.select} variant="contained"
                            style={{padding:15, margin:10,width: 150}}>{unsel.interestid}</Button>
                ))}
            </div>
        )
    }


    //Flytter uvalgt interesse til valgte interesser
    select(event){
        let temp=[];
        if(this.state.search===""){
            temp=this.state.unselectedInterests;
        }else{
            temp=this.state.queriedInterests;
        }
        const tempObj=temp.splice(event.target.value,1)[0];
        if (this.state.search!==""){
            temp=this.state.unselectedInterests;
            temp.splice(temp.indexOf(tempObj),1);
        }
        event.preventDefault();
        this.setState(prevState=>({
            selectedInterests: [...prevState.selectedInterests,tempObj].sort(),
            unselectedInterests: temp,
            search:"",
        }))
    }

    //Flytter valgt interesse til uvalgte interesser
    unselect(event){
        const temp=this.state.selectedInterests;
        const tempObj=temp.splice(event.target.value,1)[0];
        this.setState(prevState => ({
            unselectedInterests:[...prevState.unselectedInterests,tempObj].sort(),
            selectedInterests:temp,
            })
        )
    }


    render(){
        const {selectedInterests,unselectedInterests,queriedInterests,loading}=this.state;
        const selectedList=this.SelectedButtons(selectedInterests);
        const unselectedList=this.UnselectedButtons(this.state.search===""?unselectedInterests:queriedInterests);
        return(
            <div className="center">
                <div className="searchBar">
                    {this.props.firebase.auth.currentUser ? null:
                        <p> For å få tilgang til flere funksjoner på nettsiden må du være <Link to={ROUTES.SIGNIN}> logget inn</Link>.</p>}

                    <div className="selectedInterests">
                        <Button className="finnutdanning" style={{fontWeight:'bold',padding:15, margin:10,backgroundColor:"white"}} onClick={this.submit}>Finn Utdanning!</Button>
                        <Typography variant="display1" gutterBottom style={{padding:20}}>Valgte interesser: </Typography>
                        {!loading&&selectedList}
                    </div>
                    <br/><br/>
                    <div className="unselectedInterests">
                        <TextField
                            label={"Søk på interesser"}
                            style={{width:"75%",textAlign:"center",color:"#3F51B5",borderWidth:"1px",borderColor:"#3F51B5"}}
                            variant={"outlined"} className="inputField" onChange={this.intersearch} value={this.state.search}
                            placeholder="Søkeord"/>
                        <br/>
                        <Typography variant="display1" gutterBottom style={{padding:20}}>Liste over interesser: </Typography>
                    {!loading&&unselectedList}
                        <RecentSearches/>
                    </div>
                </div>
            </div>
            );
    }
}

export default compose(withAuthentication,withRouter)(Landing);
