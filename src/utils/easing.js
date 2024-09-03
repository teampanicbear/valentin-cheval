export const quint = {
    inOut: (x) => {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }
}
export const back = {
    inOut: (x) => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;

        return x < 0.5
          ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
          : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }
}

export const circ = {
    in: (x) => {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
    },
    out: (x) => {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    },
    inOut: (x) => {
        return x < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    }
}
export const sine = {
    inOut: (x) => {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }
}