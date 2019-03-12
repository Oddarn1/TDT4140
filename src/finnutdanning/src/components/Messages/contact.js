import React, {Component} from 'react';
import withAuthorization from "../Session/withAuthorization";

<!DOCTYPE html>
<html>
<body>

<button id="myButton" class="float-left submit-button" >Kontakt veileder</button>

<script type="text/javascript">
    document.getElementById("myButton").onclick = function () {
        location.href = "www.finnutdanning.no";
    };
</script>


</body>
</html>

//

// Put this code after user first logs in
jQuery(window).load(function() {
  sessionStorage.setItem('status','loggedIn')
});


if (sessionStorage.getItem('status') != null))
    //redirect to page
}
else{
    //show validation message
}
