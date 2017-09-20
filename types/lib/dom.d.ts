export declare function getStyle(element: Element, styleName: string): string;
export declare function getNumStyle(element: Element, styleName: string): number;
export declare function setStyle(element: HTMLElement, obj: {
    [key: string]: string | number;
}): void;
export declare function matches(element: HTMLElement, query: string): boolean;
export declare function remove(element: HTMLElement): void;
