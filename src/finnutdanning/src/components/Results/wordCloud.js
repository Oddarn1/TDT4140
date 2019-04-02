import React from 'react';
import WordCloud from 'react-d3-cloud';
import {withFirebase} from '../Firebase';

import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

class InterestCloud extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      interests : Object,
      loading : false
    };
  };

  // Vi henter alle interessene fra firebase her.
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
    const fontSizeMapper = word => Math.pow((Math.log2(word.value)), 2);
    //const fontSizeMapper = word => word.value;

    // Vet ikke enda hva denne er for
    document.getElementById('root')

    return(
      <div>
      {loading && <div>Loading ...</div>}
      {!loading && <Typography component="h2" variant = "h4" gutterBottom style = {{padding: 24}}>Resultat: </Typography>}
      </div>,
      <div>
          <Typography component="h2" variant = "h4" gutterBottom style = {{padding: 15}}>
                Mest valgte interesser
          </Typography>
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
