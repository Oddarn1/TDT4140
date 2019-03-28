import React from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import "./index.css";
import {AuthUserContext} from '../Session';
import * as ROLES from '../../constants/roles';
import SignOut from "../SignOut";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';


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

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class SimpleTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };
}


const NavigationAuth = ({authUser}) => (
            <div className="header">
                <AppBar position="static">
                    <Toolbar className="NavButtons">
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
                        <p className="loggetinn">Logget inn som: {authUser.email}</p>
                        <SignOut className="signout"/>

                    </Toolbar>
                </AppBar>
            </div>
        );


const NavigationNonAuth = () => (
    <div className="header">
        <AppBar position="static">
            <Toolbar className="NavButtons">
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
            </Toolbar>
        </AppBar>
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
