// Environment variables
const env = {
    domain: 'hson.fr',
    proto: 'https://',
};

module.exports = {
    ...env,
    url: `${env.proto}${env.domain}`,
};
