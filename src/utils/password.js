import bcrypt from 'bcrypt';

export const createHash = (plain) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plain, salt);
};
export const isValidPassword = (user, plain) => bcrypt.compareSync(plain, user.password);
