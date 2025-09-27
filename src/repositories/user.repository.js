import userModel from '../dao/models/user.model.js';

export class UserRepository {
  create(data) { return userModel.create(data); }
  findByEmail(email) { return userModel.findOne({ email }); }
  findById(id) { return userModel.findById(id); }
  findAll() { return userModel.find().select('-password'); }
  updateById(id, update) { return userModel.findByIdAndUpdate(id, update, { new: true }).select('-password'); }
  deleteById(id) { return userModel.findByIdAndDelete(id); }
}
