class User {
  constructor(username) {
    this.username = username;
    this.documentType = this._documentType();
    this.nationality = this._nationality();
    this.issuingCountry = this._issuingCountry();
    this.verified = this._verified();
  }

  _countries = () => {
    return [
      "US",
      "GB",
      "AU",
      "CA",
      "MX",
      "BR",
      "AR",
      "ES",
      "VN",
      "CN",
      "FR"
    ];
  };

  _documentType = () => {
    return this._pick([
        "national ID",
        "passport",
        "driver's license",
        "none"
    ]);
  };

  _nationality = () => {
    return this._pick(this._countries());
  };

  _issuingCountry = () => {
    return this.documentType === "none" ? "none" : this._pick(this._countries());
  };

  _verified = () => {
    return this.documentType !== "none";
  };

  _pick = (items) => {
    const userNumber = this._userNumber();
    return items[Math.floor(this._random(userNumber) * items.length)];
  };

  // Usernames are assumed to be of the form "user.x", where x is an integer.
  // For example: user.23.
  _userNumber = () => {
    const match = this.username.split('.');
    return match[1] || 2;
  };

  // Deterministic random number generator. Thanks, Stack Overflow
  _random = (seed) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
}

export default User;