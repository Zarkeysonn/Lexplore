const { getAllBooksFromLibrary } = require("../api/api_quizz");
const { myReading } = require("../pageObjectModel/myReading");

module.exports = {
  generateString(length) {
    let chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = chars.length;
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
};
