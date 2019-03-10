import React from 'react';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';
import {withFirebase} from '../Firebase';

class InterestCloud extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      interests : Object,
      loading : false
    };
  };

  componentDidMount(){

    this.setState({ loading: true });
    this.props.firebase.interests().once('value', snapshot => {
        const interestObjects = snapshot.val();
        this.setState({
            interests: interestObjects,
            loading: false
        });
    });
  }

  componentWillUnmount() {
    this.props.firebase.interests().off();
  }

  render() {

    const {interests, loading}=this.state;

    var interestList = [];

    if (interests != null) {
      // Lager en array med objekter som inneholder interesse og hvor mange "hits" de har.
      Object.keys(interests).forEach(function(key) {
        interestList.push({
          text: key,
          value: interests[key]["hits"]
        });
      });
    };

    // Beregning av størrelse ut i fra verdiene.
    //const fontSizeMapper = word => Math.log2(word.value) * 5;
    const fontSizeMapper = word => word.value;

    // Vet ikke enda hva denne er for
    document.getElementById('root')

    return(
      <div>
      {loading && <div>Loading ...</div>}
      {!loading && <h1>Resultat: </h1>}
      </div>,
      <div>
        <WordCloud
          data={interestList}
          fontSizeMapper={fontSizeMapper}
          height = {"300"}
        />
      </div>
    );
  };
};

export default withFirebase(InterestCloud);
