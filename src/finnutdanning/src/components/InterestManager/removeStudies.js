import React, {Component} from 'react';
import {withAuthorization} from '../Session';

class RemoveStudies extends Component{
    constructor(props) {
        super(props);
        this.state={
          studiesList:[],
          loading:false,
        };
    }

    componentDidMount(){
        this.setState({loading:true,});
        this.props.firebase.interests().on('value',snapshot=>{
            const obj=snapshot.val();
            console.log(obj);

            const studiesList=Object.keys(obj).map(key=>({
                ...obj[key],
                studyid:key
            }));
            console.log(studiesList);
            let templist=[];
            for (let i=0;i<studiesList.length;i++){
                templist.push.apply(templist,studiesList[i].studies);
            }
            const unique=[...new Set(templist)];
            this.setState({
                studiesList:unique,
                loading: false,
            })
        })
    }

    componentWillUnmount(){
        this.props.firebase.interests().off();
    }

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
            {!loading&&studyList}
            </div>
        )
    }

}

const condition=authUser=>! !authUser;

export default withAuthorization(condition)(RemoveStudies);