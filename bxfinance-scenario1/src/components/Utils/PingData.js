/*
PING INTEGRATION
This entire component is Ping developed.
Implements functions to integrate with PingData
API endpoints.

@author Michael Sanchez

*/

export default class PingData {

    // Didn't abstract these since they shouldn't ever change.
    pdReSTURI = "/directory/v1/";
    pdRootDN = "dc=" + process.env.REACT_APP_HOST.substring(process.env.REACT_APP_HOST.indexOf('.')+1);
    pdPeopleRDN = 'ou=People,' + this.pdRootDN;

    /* 
    Get User Entry
    Fetches a user record from PD.
    
    @param uid the uid from the user's directory entry.
    @return response object
    */
    getUserEntry(uid) {

        const userRDN = 'uid=' + uid;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Basic Y249ZG1hbmFnZXI6MkZlZGVyYXRlTTByZQ=="); /* TODO this should be obfuscated somehow. */

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'manual'
        };
        const url = process.env.REACT_APP_HOST + this.pdReSTURI + userRDN + ',' + this.pdPeopleRDN;
        return fetch(url, requestOptions);
    }

    /* 
    Update user record with bank accounts.

    @param 
    @return boolean to state success
    */
   updateUserEntry() {
       var myHeaders = new Headers();
       myHeaders.append("Content-Type", "application/json");
       myHeaders.append("Authorization", "Basic Y249ZG1hbmFnZXI6MkZlZGVyYXRlTTByZQ==");
       myHeaders.append("Cookie", "PF=YdzsRlxXm67qsRriWenYMf");

       var raw = JSON.stringify({ "modifications": [{ "attributeName": "bxFinanceUserAccountIDs", "modificationType": "set", "values": [{ "ids": ["10", "11", "12"] }] }] });

       var requestOptions = {
           method: 'PATCH',
           headers: myHeaders,
           body: raw,
           redirect: 'follow'
       };

       fetch("https://demo.bxfinance.xyz/directory/v1/uid=irenaneski,ou=People,dc=bxfinance.xyz", requestOptions)
           .then(response => response.text())
           .then(result => console.log(result))
           .catch(error => console.log('error', error));

   }
}