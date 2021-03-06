/** 
PING INTEGRATION:
This entire component is Ping-developed.
Implements functions to integrate with
IPStack's geo-location API.
Used to regionally format date and currency. 
Not implemented today - will be in a future release.

@author Michael Sanchez
@see {@link https://ipstack.com/documentation}
*/

class GeoLocate { 
    
    /**
    Configurations for the IPStack API. 

    @property {string} ACCESS_KEY API Acess Key for IPStack API.
    @property {string} ipStackHost Base URL for IPStack API.
    */
    constructor() {
        this.ACCESS_KEY = "c69c11a8d992802d8470122f4302bc43";
        this.ipStackHost = "http://api.ipstack.com";
    }

    /** 
    GeoLocate Country Code Lookup: 
    Looks up geo-location for a single IP address.

    @return {string} Country code for the IP address.
    */
    countryCode() {
        const ipAddress = this.getIPAddress({ipVer : "v4"});
        
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        const url = this.ipStackHost + "/" + ipAddress + "?access_key=" + this.ACCESS_KEY;
        const response = fetch(url, requestOptions)
        const country_code = response.country_code;
        return country_code;
    }

    /** 
    GeoLocate Standard Lookup: 
    Looks up geo-location data for a single IP address.

    @return {object} The response JSON object.
    */
    standardLookup() {
        //TODO Method stub today. Implement if needed.
        const response = {"Method": "stub", "Echo": address};
        return response;
    }

    /**
    GeoLocate Bulk Lookup: 
    Looks up geo-location data for a multiple IP addresses.

    @param {string} addressList Comma-separated list of IP address to be looked up.
    @return {object} The response JSON object.
    */
    bulkLookup(addressList) {
        //TODO Method stub today. Implement if needed.
        const response = { "Method": "stub", "Echo": addressList };
        return response;
    }

    /** 
    GeoLocate Requester Lookup: 
    Looks up geo-location data for this calling API's IP address.
    This can be used for testing data if you don't have a user's IP address yet.

    @return {object} The response JSON object.
    */
    requesterLookup() {
        let myHeaders = new Headers();

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch("http://api.ipstack.com/check?access_key=c69c11a8d992802d8470122f4302bc43&format=1", requestOptions);
            /* .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error)); 
        return response; */
    }

    /**
    Get IP address: 
    Gets the user's IP address using react-public-ip.
    This is only used by internal component methods so the app UIs don't have to deal with this. "Single responsibilty".
    This would ideally be a "private" method, but it's not sensitive data.

    @param {string} ipVer The IP version you want of the address. Defaults to v4.
    @return {string} ipv4 or ipv6 address.
    */
    async getIPAddress({ipVer = "v4"} = {}) {
        //This COULD be a switch/case but there are only 2 IP versions and it will be ages before that changes.
        //Don't want to over engineer it with that kind of consideration.
        publicIp = require("react-public-ip");
        let ipAddress = "0";
        if (ipVer === "v4") {
            ipAddress = await publicIp.v4() || "0";
        } else {
            ipAddress = await publicIp.v6() || "0";
        }

    }
};

export default GeoLocate;
