module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "amd": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "no-unused-vars": "off",
        "no-undef": "off",
        "react/prop-types": 0,
        "react/jsx-key": 0
    }
};
