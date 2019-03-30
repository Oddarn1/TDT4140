import React from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import "./index.css";
import {AuthUserContext} from '../Session';
import * as ROLES from '../../constants/roles';
import SignOut from "../SignOut";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';



function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};



const NavigationAuth = ({authUser}) => (
            <div className="header">
                <Link to={ROUTES.LANDING}>
                    <button> Hjem</button>
                </Link>
                <Link to={ROUTES.MESSAGES}>
                    <button> Meldinger</button>
                </Link>
                {authUser.role === ROLES.ADMIN &&
                <Link to={ROUTES.ADMIN}>
                    <button> Admin </button>
                </Link>
                }
                {authUser.role === ROLES.COUNSELOR &&
                <Link to={ROUTES.BLACKBOARD}>
                    <button> Veiledertavle </button>
                </Link>
                }
                {authUser.role!==ROLES.USER&&
                <Link to={ROUTES.INTERESTMANAGER}>
                    <button> Interessebehandling </button>
                </Link>}
                {authUser.role === ROLES.ADMIN &&
                <Link to={ROUTES.BLACKBOARD}>
                    <button> Vedlikeholdstavle </button>
                </Link>
                }
                {authUser.role === ROLES.USER &&
                <Link to={ROUTES.NEWMESSAGE}>
                    <button>Kontakt veileder</button>
                </Link>
                }
                <Link to={ROUTES.ACCOUNT}>
                    <button>Brukerinnstillinger</button>
                </Link>
                <Link to={ROUTES.ABOUT}>
                    <button> Om oss</button>
                </Link>
                <SignOut className="signout"/>
                <p className="loggetinn">Logget inn som: <br/>{authUser.email}</p>

            </div>
        );


const NavigationNonAuth = () => (
    <div className="header">
            <Link to={ROUTES.LANDING}>
                <button>Hjem</button>
            </Link>
            <Link to={ROUTES.ABOUT}>
                <button>Om oss</button>
            </Link>
            <Link to={{pathname: ROUTES.SIGNIN,
            error: "Du må være logget inn for å kontakte veileder."}}>
                <button>Kontakt veileder</button>
            </Link>
                <Link to={ROUTES.SIGNIN}>
                    <button className="signin">Logg inn</button>
                </Link>
    </div>
);

const Navigation = ()=>(
    <AuthUserContext.Consumer>
        {authUser =>
            authUser ?
                <NavigationAuth authUser={authUser}/>
                :
                <NavigationNonAuth/>}
    </AuthUserContext.Consumer>
);

export default Navigation;
