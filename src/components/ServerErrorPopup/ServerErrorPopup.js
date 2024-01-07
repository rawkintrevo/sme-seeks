import React, { useState } from 'react';

const ServerErrorPopup = (closePopup, serverErrorMessage, serverErrorStackTrace) => {


    // Add functions and event handlers as needed

    return (
        <div>
            <h5>Error Message:</h5>
            <p>{serverErrorMessage}</p>

            <h5>Stack Trace:</h5>
            <pre>{serverErrorStackTrace}</pre>
        </div>
    );
};

export default ServerErrorPopup;
