import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { RequestHandler } from 'express';
import { SALT_ROUNDS, ACCESS_JWT_SECRET } from '#config';
import { RefreshToken, User } from '#models';
import { createTokens, setAuthCookies } from '#utils';

export const register: RequestHandler = async (req, res) => {
  // we need access the user info from the request body
  const { firstName, lastName, email, password } = req.body;
  // check if user has that email already
  const userExists = await User.exists({ email });

  // throw an error if a user has that email
  if (userExists) throw new Error('Email already exists', { cause: { status: 409 } });

  // salt and hash password
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPW = await bcrypt.hash(password, salt);

  // create user in DB with create method
  const user = await User.create({ firstName, lastName, email, password: hashedPW });

  const [refreshToken, accessToken] = await createTokens(user);

  setAuthCookies(res, refreshToken, accessToken);

  // send the new user in the response
  res.status(201).json({ message: 'Registered' });
};

export const login: RequestHandler = async (req, res) => {
  // get email and password from request body
  const { email, password } = req.body;

  // query the DB to find user with that email
  const user = await User.findOne({ email }).lean();

  // if not user is found, throw a 401 error and indicate invalid credentials
  if (!user) throw new Error('Incorrect credentials', { cause: { status: 401 } });

  // compare the password to the hashed password in the DB with bcrypt
  const match = await bcrypt.compare(password, user.password);

  // if match is false, throw a 401 error and indicate invalid credentials
  if (!match) throw new Error('Incorrect credentials', { cause: { status: 401 } });

  // delete all Refresh Tokens in DB where userId is equal to _id of user
  await RefreshToken.deleteMany({ userId: user._id });

  // create new tokens with util function
  const [refreshToken, accessToken] = await createTokens(user);

  // set auth cookies with util function
  setAuthCookies(res, refreshToken, accessToken);

  // send generic success response in body of response
  res.json({ message: 'Logged in' });
};

export const refresh: RequestHandler = async (req, res) => {
  // get refreshToken from request cookies
  console.log(req.cookies);

  // if there is no refresh token throw a 401 error with an appropriate message
  //
  // query the DB for a RefreshToken that has a token property that matches the refreshToken
  //
  // if no storedToken is found, throw a 403 error with an appropriate message
  //
  // delete the storedToken from the DB
  //
  // query the DB for the user with _id that matches the userId of the storedToken
  //
  // if not user is found, throw a 403 error
  //
  // create new tokens with util function
  //
  // set auth cookies with util function
  //
  // send generic success response in body of response
};

export const logout: RequestHandler = async (req, res) => {
  // get refreshToken from request cookies
  console.log(req.cookies);

  // if there is a refreshToken cookie, delete corresponding RefreshToken from the DB
  //
  // clear the refreshToken cookie
  res.clearCookie('refreshToken');

  // clear the accessToken cookie
  //
  // send generic success message in response body
};

export const me: RequestHandler = async (req, res, next) => {
  // get accessToken from request cookies
  const { accessToken } = req.cookies;
  // if there is no access token throw a 401 error with an appropriate message
  if (!accessToken) throw new Error('Access token is required', { cause: { status: 401 } });

  try {
    // verify the access token
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;
    console.log(decoded);
    // if there is now decoded.sub is falsy, throw a 403 error and indicate Invalid or expired token
    if (!decoded.sub) throw new Error('Invalid access token', { cause: { status: 403 } });

    // query the DB to find user by id that matches decoded.sub
    const user = await User.findById(decoded.sub).select('-password').lean();

    // throw a 404 error if no user is found
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    // send generic success message and the user in response body
    res.json({ message: 'Valid token', user });
  } catch (error) {
    // if error is an because token was expired, call next with a 401 and `ACCESS_TOKEN_EXPIRED' code
    if (error instanceof jwt.TokenExpiredError) {
      next(
        new Error('Expired access token', { cause: { status: 401, code: 'ACCESS_TOKEN_EXPIRED' } })
      );
    } else {
      // call next with a new 401 Error indicated invalid access token
    }
  }
};
