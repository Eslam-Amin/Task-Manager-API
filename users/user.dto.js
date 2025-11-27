class UserDTO {
  constructor(user) {
    this._id = user._id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.fullName = user.fullName;
    this.email = user.email;
    this.gender = user.gender;
    this.age = user.age;
  }
}

module.exports = UserDTO;
