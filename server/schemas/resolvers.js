const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // console.log(context.user);
      if (context.user) {
        return await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('book');
    }
      throw new AuthenticationError('Not logged in');
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
      // console.log(user);
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { input }, context) => {
      // console.log('in graphQL', context.user);
      if (context.user) {
        // console.log('in graphQL 2', context.user._id);
        const book = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true }
        );
        return book;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    deleteBook: async (parent, args, context) => {
      if (context.user) {
        const revUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
        return revUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;