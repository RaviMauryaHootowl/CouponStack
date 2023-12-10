export const calculatePercentile = (newNumber, dataArray) => {
    const sortedArray = dataArray.slice().sort((a, b) => a - b);
    const index = sortedArray.findIndex((element) => newNumber <= element);
    const position = index === -1 ? sortedArray.length : index;
    let percentile;
    if (position === 0) {
        percentile = 0;
    } else if (position === sortedArray.length) {
        percentile = 100;
    } else {
        const lowerValue = sortedArray[position - 1];
        const upperValue = sortedArray[position];
        const range = upperValue - lowerValue;
        const relativePosition = newNumber - lowerValue;

        percentile =
            ((position - 1 + relativePosition / range) / sortedArray.length) * 100;
    }

    return percentile;
}

export const calculateMetricSocialMedia = (totalFollowerCount) => {
    const array = [
        94508, 62489, 58069, 86969, 78033, 77297, 95898, 50844, 55963, 98135, 2364,
        2635, 12012, 74872, 76729, 65400, 30399, 85465, 79530, 54653, 79487, 41193,
        50922, 9956, 24688, 80289, 82873, 3700, 31759, 88850, 11799, 59851, 20243,
        58361, 46578, 96694, 8880, 41723, 5601, 61855, 45356, 927, 9735, 52849,
        39122, 33028, 38427, 53766, 99126, 28881, 47509, 66253, 69415, 7935, 3284,
        57185, 97475, 88476, 50734, 49414, 19397, 22160, 58652, 72042, 87929, 69181,
        41978, 54505, 53854, 76383, 83706, 73459, 90985, 61457, 76534, 20569, 9970,
        6415, 46301, 13122, 53521, 54319, 48328, 58327, 25838, 67743, 11089, 64678,
        53697, 98645, 21945, 51938, 53755, 95956, 67480, 65682, 90437, 35381, 95351,
        11232,
    ];
    const number = totalFollowerCount;
    const percentile = calculatePercentile(number, array);

    return percentile;
}

export const poapMetric = (jsonData) => {
    const tokenSymbolCounts = {};

    jsonData.poap?.data.forEach((entry) => {
        const tokenSymbol = entry.token.symbol;

        tokenSymbolCounts[tokenSymbol] = (tokenSymbolCounts[tokenSymbol] || 0) + 1;
    });
    const denom = Object.values(tokenSymbolCounts).reduce(
        (acc, count) => acc + count,
        0
    );
    const numer = Object.values(tokenSymbolCounts)
        .filter((count) => count > 1)
        .reduce((acc, count) => acc + count, 0);
    return numer / denom;
}

export const nftMetric = (totalTokens) => {
    const array = [
        47, 85, 10, 47, 89, 83, 70, 11, 53, 43, 6, 28, 63, 48, 58, 1, 44, 5, 38, 53,
        35, 94, 30, 16, 71, 77, 86, 77, 95, 66, 96, 24, 77, 37, 92, 71, 95, 38, 18,
        62, 51, 0, 94, 69, 36, 4, 6, 22, 19, 47, 50, 89, 91, 34, 53, 67, 86, 20, 31,
        20, 38, 54, 38, 69, 30, 22, 43, 49, 80, 61, 5, 48, 73, 37, 74, 83, 52, 27,
        96, 2, 70, 57, 59, 16, 93, 61, 22, 9, 80, 86, 24, 92, 56, 36, 68, 26, 95,
        75, 47, 1,
    ];
    const number = totalTokens;
    const percentile = calculatePercentile(number, array);

    return percentile;
}

export const xmtpMetric = (isXMTPEnabled) => {
    const metric = isXMTPEnabled ? 100 : 0;
    return metric;
}