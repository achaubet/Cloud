import * as mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePictureUrl: {
    type: String,
    required: false
  }
});

userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(isPasswordValid);
      if (isPasswordValid) {
        return user;
      } else {
        throw new Error('Mot de passe incorrect');
      }
    } else {
      throw new Error('Utilisateur introuvable');
  }
  };

  userSchema.pre('save', async function (next) {
    if (!this.uuid) {
      this.uuid = uuidv4();
    }
    if (!this.profilePictureUrl) {
      this.profilePictureUrl = "https://projetcloudstorage.blob.core.windows.net/profilepictures/default.jpg";
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  

const User = mongoose.model('User', userSchema);

export default User;
