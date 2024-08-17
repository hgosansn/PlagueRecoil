// Environment variables
const env = {
    domain: 'hgosansn.github.io/PlagueRecoil/',
    publicPath: '/PlagueRecoil/',
    proto: 'https://',
};

module.exports = {
    ...env,
    url: `${env.proto}${env.domain}`,
};
