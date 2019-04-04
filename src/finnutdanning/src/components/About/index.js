import React from 'react';
import Typography from '@material-ui/core/Typography';
import './index.css';

/*Om oss-siden. Her kan hva som står på "Om oss" endres. Formateringen teksten er definert av Typography-komponenten, og kan også
* endres i style.*/
const About = () =>(
    <div className="about">
        <Typography variant="h3" style={{textAlign:"left", paddingLeft:24}} gutterBottom>Om Oss </Typography>
          <Typography paragraph = "true" align = "left" style = {{padding: 24}}>
          Veldig mange sitter lenge på kveldene og tenker over hva de skal studere. Enkelte ender opp med å velge feil utdanning og må bytte studie underveis. Dette koster studentene penger, krefter og verdifulle ungdomsår. Samfunnet vil også kunne spare masse på å få en masse unge og velutdannede arbeidere i gang tidlig. <br/><br/>
          Vårt mål er at det skal være enkelt å få en fulltreffer på første studievalg. FINN UTDANNING har kommet med en genial idé om som skal hjelpe på de slitsomme kveldene der studenter må ta beslutninger. Vi tror at studieretning er avhengig av fritidsinteresser i tillegg til de faglige interessene og vil bygge forslagene basert på dette.
          </Typography>
    </div>
);


export default About;
