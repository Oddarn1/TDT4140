import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import "./index.css";

/*Whenever TODO:
Implement search bar in the navigation bar.
Sprint 2 TODO:
User-protected routes, make sure registered users get access to messages, employees to employee-protected pages and so on.*/

class Navigation extends Component{

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