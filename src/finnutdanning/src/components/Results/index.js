import React, {Component} from 'react';
import GetResults from "./getResults";
import InterestCloud from "./wordCloud";
import './index.css';

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
    <div className="center">
            <div className="results">
                <GetResults query={query} recent={this.props.location.state.recent}
                results={this.props.location.state.results}/>
            </div>
            <div>
              <InterestCloud/>
            </div>
    </div>

  );}
}


export default Results;
