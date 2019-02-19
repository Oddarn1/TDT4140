import React, {Component} from 'react';

class Results extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const query=this.props.location.state.query;
        return (
        <div>
            {/*Sprint 1 TODO:
        * Get queries from searchbar on landingpage and map to relevant education. Save queries to json-file or similar,
        * analytics on values and create wordcloud by popularity.
        * Sprint 3 TODO:
        * Save results to specific users, make most recent (max 10) searches available when searching.*/}
            <ul>
                <li>Resultat 1</li>
                <li>Resultat 2</li>
                <li>Resultat 3</li>
                <li>Resultat 4</li>
                <li>Resultat 5</li>
            </ul>
            <div>{query}</div>
            <div>[Placeholder for ordsky]</div>
        </div>
        );
    }
}

export default Results;