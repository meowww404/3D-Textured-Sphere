"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColormapData = exports.AddColors = void 0;
const interp = require('interpolate-arrays');
const AddColors = (colormapName, min, max, x) => {
    const colors = exports.ColormapData(colormapName);
    if (!colors)
        return;
    if (x < min)
        x = min;
    if (x > max)
        x = max;
    if (min == max)
        return [0, 0, 0];
    const xn = (x - min) / (max - min);
    return interp(colors, xn);
};
exports.AddColors = AddColors;
const ColormapData = (colormapName) => {
    let colors;
    switch (colormapName) {
        case 'hsv':
            colors = [[1, 0, 0], [1, 0.5, 0], [0.97, 1, 0.01], [0, 0.99, 0.04], [0, 0.98, 0.52], [0, 0.98, 1], [0.01, 0.49, 1], [0.03, 0, 0.99], [1, 0, 0.96], [1, 0, 0.49], [1, 0, 0.02]];
            break;
        case 'hot':
            colors = [[0, 0, 0], [0.3, 0, 0], [0.6, 0, 0], [0.9, 0, 0], [0.93, 0.27, 0], [0.97, 0.55, 0], [1, 0.82, 0], [1, 0.87, 0.25], [1, 0.91, 0.5], [1, 0.96, 0.75], [1, 1, 1]];
            break;
        case 'cool':
            colors = [[0.49, 0, 0.7], [0.45, 0, 0.85], [0.42, 0.15, 0.89], [0.38, 0.29, 0.93], [0.27, 0.57, 0.91], [0, 0.8, 0.77], [0, 0.97, 0.57], [0, 0.98, 0.46], [0, 1, 0.35], [0.16, 1, 0.03], [0.58, 1, 0]];
            break;
        case 'spring':
            colors = [[1, 0, 1], [1, 0.1, 0.9], [1, 0.2, 0.8], [1, 0.3, 0.7], [1, 0.4, 0.6], [1, 0.5, 0.5], [1, 0.6, 0.4], [1, 0.7, 0.3], [1, 0.8, 0.2], [1, 0.9, 0.1], [1, 1, 0]];
            break;
        case 'summer':
            colors = [[0, 0.5, 0.4], [0.1, 0.55, 0.4], [0.2, 0.6, 0.4], [0.3, 0.65, 0.4], [0.4, 0.7, 0.4], [0.5, 0.75, 0.4], [0.6, 0.8, 0.4], [0.7, 0.85, 0.4], [0.8, 0.9, 0.4], [0.9, 0.95, 0.4], [1, 1, 0.4]];
            break;
        case 'autumn':
            colors = [[1, 0, 0], [1, 0.1, 0], [1, 0.2, 0], [1, 0.3, 0], [1, 0.4, 0], [1, 0.5, 0], [1, 0.6, 0], [1, 0.7, 0], [1, 0.8, 0], [1, 0.9, 0], [1, 1, 0]];
            break;
        case 'winter':
            colors = [[0, 0, 1], [0, 0.1, 0.95], [0, 0.2, 0.9], [0, 0.3, 0.85], [0, 0.4, 0.8], [0, 0.5, 0.75], [0, 0.6, 0.7], [0, 0.7, 0.65], [0, 0.8, 0.6], [0, 0.9, 0.55], [0, 1, 0.5]];
            break;
        case 'bone':
            colors = [[0, 0, 0], [0.08, 0.08, 0.11], [0.16, 0.16, 0.23], [0.25, 0.25, 0.34], [0.33, 0.33, 0.45], [0.41, 0.44, 0.54], [0.5, 0.56, 0.62], [0.58, 0.67, 0.7], [0.66, 0.78, 0.78], [0.83, 0.89, 0.89], [1, 1, 1]];
            break;
        case 'copper':
            colors = [[0, 0, 0], [0.13, 0.08, 0.05], [0.25, 0.16, 0.1], [0.38, 0.24, 0.15], [0.5, 0.31, 0.2], [0.62, 0.39, 0.25], [0.75, 0.47, 0.3], [0.87, 0.55, 0.35], [1, 0.63, 0.4], [1, 0.71, 0.45], [1, 0.78, 0.5]];
            break;
        case 'greys':
            colors = [[0, 0, 0], [0.1, 0.1, 0.1], [0.2, 0.2, 0.2], [0.3, 0.3, 0.3], [0.4, 0.4, 0.4], [0.5, 0.5, 0.5], [0.6, 0.6, 0.6], [0.7, 0.7, 0.7], [0.8, 0.8, 0.8], [0.9, 0.9, 0.9], [1, 1, 1]];
            break;
        case 'jet':
        default:
            colors = [[0, 0, 0.51], [0, 0.24, 0.67], [0.01, 0.49, 0.78], [0.01, 0.75, 0.89], [0.02, 1, 1], [0.51, 1, 0.5], [1, 1, 0], [0.99, 0.67, 0], [0.99, 0.33, 0], [0.98, 0, 0], [0.5, 0, 0]];
            break;
    }
    return colors;
};
exports.ColormapData = ColormapData;
//# sourceMappingURL=colormap-data.js.map