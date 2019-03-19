import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class RecentSearches extends Component{
    constructor(props){
        super(props);
        this.state={
            recentSearches:[],
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
                console.log(searching[0]);
                this.setState({
                    recentSearches:searching[0],
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
                    <Link to={ROUTES.RESULTS} params={{searchQuery:search}}>
                        {search} - {this.state.recentSearches.results[index]}
                        </Link>))}
            </div>
        )
    }

    render(){
        const {recentSearches,loading}=this.state;
        const searchList=this.SearchList(recentSearches.searches)
        return(
            <div>
                Hei
            </div>
        )
    }
}

const condition=authUser=>! !authUser;

export default withAuthorization(condition)(RecentSearches);