const fs = require('fs');

function decodeValue(base, value) {
    let bigint = 0n;
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
    value = value.toLowerCase();
    for (let i = 0; i < value.length; i++) {
        const c = value[i];
        const idx = digits.indexOf(c);
        bigint = bigint * BigInt(base) + BigInt(idx);
    }
    return bigint;
}

function lagrangeInterpolation(points, k) {
    let sum = 0n;
    for (let i = 0; i < k; i++) {
        const { x: xi, y: yi } = points[i];
        let numerator = 1n;
        let denominator = 1n;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const xj = points[j].x;
                numerator *= BigInt(-xj);
                denominator *= BigInt(xi - xj);
            }
        }
        const term = (yi * numerator) / denominator;
        sum += term;
    }
    return sum.toString();
}

function processTestCase(file) {
    const data = fs.readFileSync(file, 'utf8');
    const jsonData = JSON.parse(data);
    const points = [];
    const k = jsonData.keys.k;
    for (const key of Object.keys(jsonData)) {
        if (key === 'keys') continue;
        const root = jsonData[key];
        const base = parseInt(root.base, 10);
        const value = root.value;
        const y = decodeValue(base, value);
        points.push({ x: BigInt(key), y });
    }
    points.sort((a, b) => (a.x < b.x ? -1 : 1));
    const c = lagrangeInterpolation(points.slice(0, k), k);
    console.log(`Secret for ${file}:`, c);
}

processTestCase('test_case_1.json');
processTestCase('test_case_2.json');