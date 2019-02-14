import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';


class Navigation extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
          <div className="header">
              <ul>
                  <li>
                      <Link to={ROUTES.LANDING}> Finn Utdanning </Link>
                  </li>
                  <li>
                      <Link to={ROUTES.MESSAGES}> Meldinger </Link>
                  </li>
                  <li>
                      <Link to={ROUTES.ABOUT}> Om oss </Link>
                  </li>
              </ul>
          </div>
        );
    }


}

export default Navigation;