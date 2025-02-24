export interface IProductProps {
    item: {
        _id: string;
        name: string;
        images: [string];
        price: number;
        quantity?: number;
    };
    productProps: {
        imageBg?: string;
       percentageWidth?: number;
        onPress?: () => void;
    };

    pStyleProps: {
        width?: number;
        height?: number;
        marginHorizontal?: number;
        marginBottom?: number;
        resizeMode?: "contain" | "cover" | "stretch";
    };
}