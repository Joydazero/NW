import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
    // Next.js 앱의 경로
    dir: './',
})

const config = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
}

export default createJestConfig(config)