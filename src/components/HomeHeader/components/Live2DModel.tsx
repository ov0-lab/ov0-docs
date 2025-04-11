import { useEffect, useRef } from 'react'
import { loadScript } from '../utils/loadscript';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

interface Live2DProps {
    modelUrl: string
    scale?: number
    position?: [number, number]
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            live2DTexture: any
        }
    }
    var PIXI: any
    var Live2DCubismCore: any
}

const loadLive2dScript = async () => {
    if (!window.Live2DCubismCore) {
        await loadScript('/header/live2dcubismcore.min.js',)
            .then(() => console.log('live2dcubismcore脚本加载完成！'))
            .catch((err) => console.error('live2dcubismcore脚本加载失败！', err))
    }

    if (!window.PIXI) {
        await loadScript('/header/pixi.min.js')
            .then(() => console.log('PIXI脚本加载完成！'))
            .catch((err) => console.error('PIXI脚本加载失败！', err))
    }

    await loadScript('/header/cubism4.min.js')
        .then(() => console.log('cubism4脚本加载完成！'))
        .catch((err) => console.error('cubism4脚本加载失败！', err))

}

// 创建材质
class Live2DTexture extends THREE.Mesh {
    canvas: HTMLCanvasElement
    texture: THREE.CanvasTexture
    pixiApp: any
    constructor() {
        super()
        this.canvas = document.createElement('canvas')
        this.canvas.width = 512
        this.canvas.height = 512
        this.texture = new THREE.CanvasTexture(this.canvas)
        this.geometry = new THREE.PlaneGeometry(1, 1)
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true
        })
    }

    async init() {
        await loadLive2dScript()
        // 初始化 PIXI
        this.pixiApp = new window.PIXI.Application({
            view: this.canvas,
            backgroundAlpha: 0,
            width: 512,
            height: 512
        })
    }
}

extend({ Live2DTexture })


export function Live2D({ modelUrl, scale = 1, position = [0, -1] }: Live2DProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const appRef = useRef<any>(null);

    useEffect(() => {

        if (!canvasRef.current) return

        // 加载模型
        const loadModel = async () => {

            await loadLive2dScript()
            const live2d = window.PIXI.live2d;
            appRef.current = new window.PIXI.Application({
                view: canvasRef.current,
                autoStart: true,
                // transparent: true,
                backgroundAlpha: 0,
                // autoDensity:true,
                // autoResize: true,
                antialias: true,
                width: 800,  // 固定画布尺寸
                height: 800,
                premultipliedAlpha: false
            });

            const model = await live2d.Live2DModel.from(modelUrl)

            // 计算合适缩放比例
            const maxSize = Math.min(
                appRef.current.screen.width * 1.4,
                appRef.current.screen.height * 1.4
            );
            const scaleRatio = Math.min(
                maxSize / model.width,
                maxSize / model.height
            ) * scale;

            // 设置模型
            model.scale.set(scaleRatio);

            // model.position.set(
            //     appRef.current.screen.width / 2 + position[0],
            //     appRef.current.screen.height / 2 + position[1]
            // );
            model.position.set(
                position[0],
                position[1]
            );

            // 调试边框
            // const border = new window.PIXI.Graphics();
            // border.lineStyle(2, 0x00FF00);
            // border.drawRect(0, 0, appRef.current.screen.width, appRef.current.screen.height);
            // appRef.current.stage.addChild(border);

            // const hitAreaGraphics = new PIXI.Graphics();
            // model.hitAreas.forEach(area => {
            //     const bounds = model.getHitArea(area);
            //     hitAreaGraphics.lineStyle(1, 0xFF0000);
            //     hitAreaGraphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
            // });
            // appRef.current.stage.addChild(hitAreaGraphics);

            // 挂载模型
            model.interactive = true;
            appRef.current.stage.addChild(model);

            // model.motion("Idle", 0 /*优先级*/, {
            //     loop: true,      // 循环播放
            //     fadeIn: 1000,    // 淡入时间（毫秒）
            //     fadeOut: 1000    // 淡出时间（毫秒）
            // });

            // const backup = model.internalModel.model.getParameterValues();
            model.on("pointerdown", (e: any) => {

                const { expressions } = model.internalModel.settings
                if (expressions) {
                    const randomIndex = Math.floor(Math.random() * expressions.length);
                    const expressionFile = expressions[randomIndex].File
                    model.expression(expressionFile); // 直接触发
                    console.log(expressionFile)
                    // setTimeout(() => {
                    //     model.internalModel.model.setParameterValues(backup);
                    // }, 1000);
                }
            });

        }

        loadModel()

        return () => {
            // app.destroy(true)
            // if (ref.current) {
            //     ref.current.pixiApp.destroy(true)
            // }
            appRef.current?.destroy(true);
        }
    }, [modelUrl])


    // return <live2DTexture ref={ref} />
    return <canvas ref={canvasRef} width={1024} height={1024} style={{
        width: '100%',
        height: '100%',
    }} />
}