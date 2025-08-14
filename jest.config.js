module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
