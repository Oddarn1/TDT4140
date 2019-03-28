import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class RecentSearches extends Component{
    constructor(props){
        super(props);
        this.state={
            recentSearches:[],
            recentResults:[],
            timestamp:[],
            loading:false,
        }
    }

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
                this.setState({
                    recentSearches:searching[0]['searches'],
                    recentResults: searching[0]['results'],
                    timestamp: searching[0]['timestamp'],
                    loading: false,
                })
            })
    }

    componentWillUnmount(){
        this.props.firebase.db.ref('searchhistory').off();
    }

    SearchList(searches){
        return(
            <div className="recentSearches">
                {searches.map((search,index)=>(
                    <Link to={{pathname: ROUTES.RESULTS,
                    state:{query:search,
                    recent: true,
                    results:this.state.recentResults[index]}}}>
                        {this.state.timestamp[index]+" - "+this.state.recentSearches[index]} <br/>
                        </Link>))}
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
                {!loading&&searchList}
            </div>
        )
    }
}

const condition=authUser=>! !authUser;

export default withAuthorization(condition)(RecentSearches);
