const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().select("-__v -password").populate("book");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("book");
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password').populate('savedBooks');
        return userData;
      }
      throw new AuthenticationError('You need to be logged in.');
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { SavedBook }, context) => {
      if (context.user) {
      const revUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true }
        );
        return revUser;
      }
      throw new AuthenticationError('You need to be logged in to save a book.')
    },
    deleteBook: async (parent, args, context) => {
      if (context.user) {
      const revUser = await User.findByIdAndUpdate(
          { _id: context.user._id},
          { $pull: { bookId: args.bookId } },
          { new: true } 
        );
        return revUser;
      }
      throw new AuthenticationError('You need to be logged in to delete a book.')
    }
  }
};

module.exports = resolvers; 
