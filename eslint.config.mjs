import js from "@eslint/js";

export default [
    {
        ignores: ["eslint.config.mjs"]
    },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: {
                console: "readonly",
                process: "readonly",
                require: "readonly",
                module: "readonly",
                __dirname: "readonly",
                describe: "readonly",
                it: "readonly",
                test: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                beforeAll: "readonly",
                afterEach: "readonly",
                afterAll: "readonly",
                jest: "readonly"
            }
        },
        rules: {
            "no-unused-vars": ["warn", { 
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "caughtErrorsIgnorePattern": "^_"
            }],
            "no-undef": "error"
        }
    }
];
