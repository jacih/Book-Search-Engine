const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id });
        }
        throw new AuthenticationError('You need to be logged in!');
      },
    book: async (parent, )
  },
  Mutation: {
    addUser: async (parent, {username, email, password }) => {
      try {
        const userData = await User.create({ username, email, password });
        const token = signToken(userData);
        return { token, userData };
      } catch (err) {
          console.error(err);
      }
    },
    login: async (parent, { email, password }) => {
      const userData = await User.findOne({ email });  
      if (!User) {
        throw new AuthenticationError('No user associated with this email address');
      }
      const correctPw = await profile.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }
      const token = signToken(userData);
      return { token, userData };
      },
    saveBook: async (parent, { book }, context) => {
      if(context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError('You must be logged in to save books to your profile');
    },
    deleteBook: async (parent, { book }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id},
          { $pull: { savedBooks: book } },
          { new: true } 
        );
      }
      throw new AuthenticationError('You must be logged in to delete books');
    }
  },
};

module.exports = resolvers;
