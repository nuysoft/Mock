export default {
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: './src/mock.ts',
            name: 'Mock',
            formats: ['es', 'umd'],
            // the proper extensions will be added
            fileName: 'mock',
        },
    },
    test: {
        coverage: {
            reporter: ['text', 'json', 'html', 'lcov'],
        },
    }
}
