/** @format */

export function convertKelvinToCelsius(tempInKelevin: number): number {
    const tempinCelsius = tempInKelevin - 273.15;
    return Math.floor(tempinCelsius);
}