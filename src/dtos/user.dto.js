export class UserDTO {
  constructor(u) {
    this.id = u._id ?? u.id;
    this.first_name = u.first_name;
    this.last_name = u.last_name;
    this.email = u.email;
    this.age = u.age;
    this.role = u.role;
    this.cart = u.cart ?? null;
  }
}
