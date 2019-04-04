import React from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import "./index.css";
import {AuthUserContext} from '../Session';
import * as ROLES from '../../constants/roles';
import SignOut from "../SignOut";
import img from "./finnutdanning.png";

//Innlogget bruker får se denne navbaren
const NavigationAuth = ({authUser}) => (
            <div className="header">
                <Link to={ROUTES.LANDING}>
                <img className="logo" src={img} alt={"Logo"}/>
                </Link>
                <Link to={ROUTES.LANDING}>
                    <button> Hjem</button>
                </Link>
                <Link to={ROUTES.MESSAGES}>
                    <button> Meldinger</button>
                </Link>
                {/*Dersom bruker er Admin får de lenke til admin i navbar*/}
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
                <Link to={ROUTES.ABOUT}>
                    <button> Om oss</button>
                </Link>
                <SignOut className="signout"/>
                <Link className="account" to={ROUTES.ACCOUNT}>
                    <button>Brukerinnstillinger</button>
                </Link>
                <p className="loggetinn">Logget inn som: <br/>{authUser.email}</p>

            </div>
        );


//Dersom bruker ikke er logget inn får de denne navbaren med begrenset funksjonalitet
const NavigationNonAuth = () => (
    <div className="header">
        <Link to={ROUTES.LANDING}>
            <img className="logo" src={img} alt={"Logo"}/>
        </Link>
            <Link to={ROUTES.LANDING}>
                <button>Hjem</button>
            </Link>
            <Link to={{pathname: ROUTES.SIGNIN,
            error: "Du må være logget inn for å kontakte veileder."}}>
                <button>Kontakt veileder</button>
            </Link>
        <Link to={ROUTES.ABOUT}>
            <button>Om oss</button>
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
