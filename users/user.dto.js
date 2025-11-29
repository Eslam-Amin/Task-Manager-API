// User DTO defines the shape of user data returned to clients.
// Excludes sensitive fields like password, session tokens, and verification codes.

class UserDTO {
  static toUserDTO(user) {
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      gender: user.gender,
      age: user.age
    };
  }
}

module.exports = UserDTO;
