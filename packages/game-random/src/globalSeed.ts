let globalSeed: string
export const GlobalSeedAtom = (val?: string) => {
    if (val) {
        globalSeed = val
        return val
    }
    return globalSeed
}