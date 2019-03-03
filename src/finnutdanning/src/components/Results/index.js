import React, {Component} from 'react';

import {GetResults} from "./getResults"

class Results extends Component {

  render(){
      let query;
      try {
          query = this.props.location.state.query;
      }catch(e){
          console.log(e);
          query = "";
      }
    return(
    <div>
        {/*Sprint 2 TODO:
        * Save queries to json-file or similar, analytics on values and create wordcloud by popularity.
        * Sprint 3 TODO:
        * Save results to specific users, make most recent (max 10) searches available when searching.*/}

            <div>
                <GetResults interests={query}/>
            </div>
        <div>[Placeholder for ordsky]</div>
    </div>

  );}
}


export default Results;
