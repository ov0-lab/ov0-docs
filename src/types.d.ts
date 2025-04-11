declare module '*.jpg' {
    const path: {
        preSrc: string,
        src: {
            width: number,
            height: number,
            images: Array<{
                height: number,
                width: number,
                path: string
            }>,
            src: string,
            srcSet: string,
            placeholder: string | undefined
        },

    }
    export default path;
}
declare module '*.png';
declare module '*.svg';
declare module '*.scss';


