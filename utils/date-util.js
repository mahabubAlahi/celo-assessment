

/*
* Convert timestamp to Human readable Date format ("YYYY-MM-DD")
* @param {timeStamp} timeStamp value
* @returns {convertedDate} converted Date to the required format
*/
const convertTimestampToDate = (timeStamp) => {

     let date = new Date(Number(timeStamp)*1000);

     let convertedDate = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);

     return convertedDate;
}

module.exports = {
    convertTimestampToDate
}