export const loadScript = async (src: string, onload?: () => void, onerror?: () => void) => {
    await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
        script.onload = () => {
            onload && onload()
            resolve(true);
        };
        script.onerror = () => {
            onerror && onerror()
            reject(new Error(`加载脚本错误: ${script.src}`));
        };
    });
}