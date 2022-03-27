const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = User.findOne({ _id: context.user._id }).select('-__v -password');
        return userData;
      }
      throw new AuthenticationError('You need to be logged in.');
    },
  },

  Mutation: {
    createUser: async (parent, args) => {
      const userData = await User.create(args);
      const token = signToken(userData);
      return { token, userData };
    },
    login: async (parent, { email, password }) => {
      const userData = await User.findOne({ email });  
      if (!userData) {
        console.log('No user associated with this email address');
      }
      const correctPw = await profile.isCorrectPassword(password);
      if (!correctPw) {
        console.log('Incorrect password');
      }
      const token = signToken(userData);
      return { token, userData };
    },
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
      const revUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        return revUser;
      }
      throw new AuthenticationError('You need to be logged in to save a book.')
    },
    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
      const revUser = await User.findOneAndUpdate(
          { _id: context.user._id},
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true } 
        );
        return revUser;
      }
      throw new AuthenticationError('You need to be logged in to delete a book.')
    }
  }
};

module.exports = resolvers;
