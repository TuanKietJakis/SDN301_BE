/**
 * Controller for handling user-related operations.
 * @module controllers/user
 */

// Loads dependencies
const httpStatus = require('http-status');
const {catchAsync} = require('../middlewares');
const { userService } = require('../services');
const { coreHelper } = require('../helpers');

/**
 * Get users based on provided query parameters.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response containing users data.
 */
const getUsers = catchAsync(async (req, res) => {
  // Extract filter and options from query parameters
  const filter = coreHelper.pick(req.query, ['name', 'username', 'email', 'role']);
  const options = coreHelper.pick(req.query, ['page', 'limit', 'sortBy', 'populate']);

  // Call userService to get users based on filter and options
  const users = await userService.getUsers(filter, options);

  // Send response with users data
  return res.status(httpStatus.OK).json(users);
});

/**
 * Get user by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response containing user data.
 */
const getUserById = catchAsync(async (req, res) => {
  // Extract user ID from request parameters
  const { id } = req.params;
  console.log(req.params);

  // Call userService to get user by ID
  const user = await userService.getUserById(id);
  const userObject = user.toObject();
  delete userObject.password;

  // Send response with user data
  return res.status(httpStatus.OK).json(userObject);
});

// Export controller methods
module.exports = {
  getUsers,
  getUserById
};
