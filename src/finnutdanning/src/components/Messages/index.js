import React from 'react';
import withAuthorization from "../Session/withAuthorization";

const Messages=()=>(
  <div>
      {/*Sprint 2 TODO:
      * Create a messaging service, connection to a firebase with stored messages. General messages to counselor
      * can be accessed by all counselors, messages from counselors and admin to users can only be accessed by
      * that user.*/}
      [Placeholder for meldingsboks]
  </div>
);

const condition =authUser => ! !authUser;

export default withAuthorization(condition)(Messages);