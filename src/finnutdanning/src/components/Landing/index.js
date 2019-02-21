import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Dropdown from './dropdown';

class Landing extends Component {
    constructor(props){
        super(props);
        this.state={
          search: "",
            showMenu:false,
        };
        this.showMenu=this.showMenu.bind(this);
        this.closeMenu=this.closeMenu.bind(this);
        this.onChange=this.onChange.bind(this);
        this.submit=this.submit.bind(this);
        this.capture=this.capture.bind(this);
    }

    /*Gets event from searchbar, provides the state with a value to be displayed in the input field's value*/
    onChange(event){
        this.setState({search: event.target.value});
    }

    /*Redirects the user to result-page on button-press*/
    submit() {
        this.props.history.push({
            pathname: ROUTES.RESULTS,
            state: {query: this.state.search}
        })
    }

    /*Render dropdown-component*/
    showMenu(event){
        event.preventDefault();

        this.setState({showMenu:true},
        () => {document.addEventListener('click',this.closeMenu)});
    }

    /*Un-render dropdown when clicked anywhere else on page*/
    closeMenu(event){
        event.preventDefault();

        if (this.dropDownMenu===null){
            return;
        }
        if(!this.dropDownMenu.contains(event.target)) {

            this.setState({showMenu: false},
                () => {
                    document.removeEventListener('click', this.closeMenu)
                })
        }
    }

    /*Gets the value from buttons that will be made into a list*/
    capture(event){
        let text = this.state.search;
        let input = event.target.value;

        text +=(this.containsString(text,input) ? "" : input + ", ");
        this.setState({search:text});
    }

    /*Control method to check if searchstring already contains string*/
    containsString(text,elem){
        if (text.length === 0) {
            return false;
        }
        return text.includes(elem);
        }

    render(){
        return(
    <div className="searchBar">
        <input type="text" placeholder="Interesser" onChange={this.onChange} value={this.state.search} onClick={this.showMenu}/>
        {this.state.showMenu ?
            <div className="dropDown" ref={(element)=>
            this.dropDownMenu=element}>
                <Dropdown capture={this.capture}/>
            </div>
            :null}
            <div className="submitButton">
                <button onClick={this.submit}> Resultater </button>
            </div>
    </div>
            );
    }
}

export default withRouter(Landing);