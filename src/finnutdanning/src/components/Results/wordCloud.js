import React from 'react';
import WordCloud from 'react-d3-cloud';
import {withFirebase} from '../Firebase';
import Typography from '@material-ui/core/Typography';

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

    const {interests}=this.state;


    var interestList = [];

    if (interests != null) {
      // Lager en array med objekter som inneholder interesse og hvor mange "hits" de har.
      Object.keys(interests).forEach(function(key) {
        interestList.push({
          text: key,
          value: interests[key]["hits"]
        });
      });
    }

    // Beregning av størrelse ut i fra verdiene.
    //const fontSizeMapper = word => Math.log2(word.value) * 5;
    const fontSizeMapper = word => word.value;

    // Skriver til det ene elementet vi har i HTML-filen vår :)
    document.getElementById('root');

    return(
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
}

export default withFirebase(InterestCloud);
