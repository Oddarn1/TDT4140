import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class Landing extends Component {
    constructor(props){
        super(props);
        this.state={
          search: "",
        };
        /*Functions that alter the state*/
        this.onChange=this.onChange.bind(this);
        this.submit=this.submit.bind(this);
    }

    /*Gets event from searchbar, provides the state with a value to be displayed in the input field's value*/
    onChange(event){
        this.setState({search: event.target.value});
    }

    /*Redirects the user to result-page on button-press*/
    submit(){
        this.props.history.push({pathname:ROUTES.RESULTS, state:{search:this.state.search}});
    }

    render(){
        return(
    <div>
        <input type="text" placeholder="Interesser" onChange={this.onChange} value={this.state.search}/>
        <button onClick={this.submit}> Resultater </button>
    </div>
            );
    }
}

export default withRouter(Landing);
