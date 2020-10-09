module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true
    },
    extends: [
        'standard'
    ],
    parserOptions: {
        ecmaVersion: 12
    },
    rules: {
        semi: 'error',
        indent: ['error', 4],
        'no-void': 'off',
        curly: 'off'
    }
}
