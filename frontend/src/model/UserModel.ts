class UserModel {
   idUser: number;
   dateOfBirth: Date;
   deliveryAddress: string;
   email: string;
   firstName: string;
   lastName: string;
   gender: string;
   password: string;
   phoneNumber: string;
   username: string;
   avatar: string;
   enabled: boolean;

   constructor(
      idUser: number,
      dateOfBirth: Date,
      deliveryAddress: string,
      email: string,
      firstName: string,
      lastName: string,
      gender: string,
      password: string,
      phoneNumber: string,
      username: string,
      avatar: string,
      enabled: boolean
   ) {
      this.idUser = idUser;
      this.dateOfBirth = dateOfBirth;
      this.deliveryAddress = deliveryAddress;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.gender = gender;
      this.password = password;
      this.phoneNumber = phoneNumber;
      this.username = username;
      this.avatar = avatar;
      this.enabled = enabled;
   }
}

export default UserModel;