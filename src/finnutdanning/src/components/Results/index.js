import React, {Component} from 'react';
import GetResults from "./getResults";
import InterestCloud from "./wordCloud";

class Results extends Component {

  render(){
      let query;
      console.log(this.props.history);
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
                <GetResults query={query}/>
            </div>
            <div>
              <InterestCloud/>
            </div>
    </div>

  );}
}


export default Results;
