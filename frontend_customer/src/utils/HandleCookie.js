import Cookies from 'js-cookie';

// Function to set the token in the cookie
export const setTokenCookie = (token) => {
  // console.log("kk",token);
  // const secretKey = 'CumaNginepLho';;
  // const data = jwt.sign(token, secretKey, { expiresIn: '1h' })
  // console.log(data,"mkmk");
  Cookies.set('token', token  , { expires: 7 }); // Set the token cookie with a 7-day expiration
};

// Function to get the token from the cookie
export const getTokenCookie = () => {
  const token = Cookies.get('token');
  // const data = jwt.decode(token);

  // if (token) {
  //   try {
  //      const userData = {
  //     email: data.email,
  //     googleId: data.sub,
  //     name: data.name,
  //     profile: data.picture,
  //   };
  //     return userData;
  //   } catch (error) {
  //     console.error('Error parsing token:', error);
  //     return null; // or handle the error in a way that makes sense for your application
  //   }
  // }

  return token; // Return null if the token is not found
};

// Function to remove the token from the cookie
export const removeTokenCookie = () => {
  Cookies.remove('token');
};