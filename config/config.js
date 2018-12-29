const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' +
    (process.env.MONGO_PORT || '27017') +
    '/mernproject',
  stripe_connect_test_client_id: 'ca_E1dSMW6qP8dfXA5Y3caexUcm2mJ7TjSy',
  stripe_test_secret_key: 'sk_test_2Fsxkvf8d4L3nx6GiDXsPiHM',
  stripe_test_api_key: 'pk_test_gWbWCEcNuIGhBFzHMwEALMgS'
}
export default config
