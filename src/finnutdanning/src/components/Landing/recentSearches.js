import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import './index.css';

class RecentSearches extends Component{
    constructor(props){
        super(props);
        this.state={
            recentSearches:[],
            recentResults:[],
            timestamp:[],
            weights:[],
            loading:false,
        }
    }

    //Leser inn nylige søk for bruker. Nylige søk er lagret på brukerid i databasen
    componentDidMount(){
        this.setState({
            loading:true,
        });
        this.props.firebase.db.ref("searchhistory").orderByChild('uid').equalTo(this.props.authUser.uid)
            .on('value',snapshot=>{
                const obj=snapshot.val();

                if (obj===null) {
                    this.setState({loading: false,});
                    return;
                }

                const searching=Object.keys(obj).map(key=>({
                    ...obj[key],
                    searchid:key
                }));
                /*Etter mapping har vi en liste med ett objekt, henter ut dette på 0-index. Er det mer enn 1 objekt her har
                * databasen fucka seg*/
                this.setState({
                    recentSearches:searching[0]['searches'],
                    recentResults: searching[0]['results'],
                    timestamp: searching[0]['timestamp'],
                    weights: searching[0]['weights'],
                    loading: false,
                })
            })
    }

    //Fjerner lytter fra database for å unngå memory-leaks
    componentWillUnmount(){
        this.props.firebase.db.ref('searchhistory').off();
    }

    //Lister nylige søk for innloggede brukere
    SearchList(searches){
        return(
            <div className="recentSearches">
                <h4 id="date">Dato for søk:</h4>
                <h4 id="search">Du søkte på:</h4>
                {searches.map((search,index)=>(
                    //Listes i linkformat som ved klikk tar en til resultat med samme søk og resultat
                    <div className="linkElem">
                    <Link id="date" to={{pathname: ROUTES.RESULTS,
                    state:{query:search,
                    recent: true,
                    results:this.state.recentResults[index],
                    weights: this.state.weights[index]}}}>
                        {this.state.timestamp[index]}
                        </Link>
                    <Link id="search" to={{pathname: ROUTES.RESULTS,
                    state:{query:search,
                    recent: true,
                    results:this.state.recentResults[index],
                    weights: this.state.weights[index]}}}>
                        {/*Hvis lengden på søket er over 40 karakterer: legg til "..." og kutt ned*/}
                        {this.state.recentSearches[index].length>40?
                            this.state.recentSearches[index].substr(0,40)+"...":
                            this.state.recentSearches[index]}
                    </Link>
                    </div>
                    ))}
            </div>
        )
    }

    render(){
        const {recentSearches,loading}=this.state;
        const searchList=this.SearchList(recentSearches);
        return(
            <div>
                <h2>
                    Tidligere søk:
                </h2>
                <div className="searchList">
                    {!loading&&searchList}
                </div>
            </div>
        )
    }
}

const condition=authUser=>! !authUser;

export default withAuthorization(condition)(RecentSearches);
