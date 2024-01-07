import React from 'react';
import {Link} from "react-router-dom";

const ServerErrorPopup = ({ closePopup, errorMessage, stackTrace }) => {
    return (
        <div>
            Jokes aside, if you're here, you're a grown up and you know what to do. <br />
            Send Trevor the info below and he'll look into it. <br />
            Alternatively, you could try to help; code is&nbsp;
            <a href={"https://github.com/rawkintrevo/sme-seeks/blob/main/functions/main.py"}
               target={"_blank"}>
                here
            </a>.
            <h5>Error Message:</h5>
            <p>{errorMessage}</p>

            <h5>Stack Trace:</h5>
            <pre>{stackTrace}</pre>
        </div>
    );
};

export default ServerErrorPopup;
