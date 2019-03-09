/*Midlertidig lagring av kall til firebase for å hente ut meldinger. Vil bli brukt til å hente meldinger fra samtale
som blir valgt i index
 */

import React from "react";

this.setState({loading: true});
        //.messages() er definert i firebase.js. Det samme er også .message(msgid) som kan hente ut spesifikke id-er på
        // samme vis.
        this.props.firebase.messages().orderByChild("senderid").on('value',snapshot => {
            const messageObject=snapshot.val();

            if (messageObject===null) {
                return;
            }
            const messageList = Object.keys(messageObject).map(key => ({
                ...messageObject[key],
                msgid: key,
            }));

            this.setState({
            messages: messageList,
            loading: false})
            }
        );


//Mapper meldingsobjekter til en liste, kan reformateres senere. attributter kan hentes på message.*attributt*.
MessageList({messages}) {
    return (
        <ul>
            {messages.map(message => (
                <li key={message.msgid}><span>{message.content}</span></li>
            ))}
        </ul>
    )
}
