import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class Landing extends Component {
    constructor(props){
        super(props);
        this.state={
          search: "",
        };
        this.onChange=this.onChange.bind(this);
        this.submit=this.submit.bind(this);
    }

    onChange(event){
        this.setState({search: event.target.value});
    }

    submit(){
        this.props.history.push(ROUTES.RESULTS);
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