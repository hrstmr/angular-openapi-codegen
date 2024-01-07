module.exports = {
    singleQuote: true,
    tabWidth: 4,
    semi: true,
    printWidth: 100,
    bracketSameLine: true,
    trailingComma: 'es5',
    experimentalTernaries: true,
    plugins: [],
    overrides: [
        {
            files: '**/*astro',
            options: {
                parser: 'astro',
            },
        },
        {
            files: '**/*.mdx',
            options: {
                printWidth: 70,
                tabWidth: 2,
                proseWrap: 'always',
            },
        },
    ],
};
