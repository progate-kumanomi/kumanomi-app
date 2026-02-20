/**
 * キャンバス座標変換ユーティリティ
 * 基準サイズ（800x1200）と現在のキャンバスサイズ間の座標変換を行う
 */

export const BASE_WIDTH = 800;
export const BASE_HEIGHT = 1200;

/**
 * 画面座標を基準サイズに正規化
 */
export const normalizeCoordinate = (
    x: number,
    y: number,
    currentWidth: number,
    currentHeight: number
): { x: number; y: number } => {
    return {
        x: (x / currentWidth) * BASE_WIDTH,
        y: (y / currentHeight) * BASE_HEIGHT,
    };
};

/**
 * 基準座標を現在のキャンバスサイズにスケーリング
 */
export const scaleCoordinate = (
    x: number,
    y: number,
    currentWidth: number,
    currentHeight: number
): { x: number; y: number } => {
    return {
        x: (x / BASE_WIDTH) * currentWidth,
        y: (y / BASE_HEIGHT) * currentHeight,
    };
};

/**
 * ポイント配列をスケーリング
 */
export const scalePoints = (
    points: number[],
    currentWidth: number,
    currentHeight: number
): number[] => {
    return points.map((point, index) => {
        if (index % 2 === 0) {
            // x座標
            return (point / BASE_WIDTH) * currentWidth;
        } else {
            // y座標
            return (point / BASE_HEIGHT) * currentHeight;
        }
    });
};

/**
 * 線の太さをスケーリング
 */
export const scaleStrokeWidth = (
    strokeWidth: number,
    currentWidth: number
): number => {
    return (strokeWidth / BASE_WIDTH) * currentWidth;
};
