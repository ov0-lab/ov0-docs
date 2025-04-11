import { Mesh, PlaneGeometry, Group, Vector3, MathUtils } from 'three'
import { useRef, useState, useLayoutEffect, useEffect, Fragment } from 'react'
import { createRoot, events, extend, useFrame, ReconcilerRoot } from '@react-three/fiber'
import { Plane, useAspect, useTexture, Html } from '@react-three/drei'
import {
  EffectComposer,
  DepthOfField,
  Vignette,
} from '@react-three/postprocessing'
import { Live2D } from './Live2DModel'
import { MaskFunction } from 'postprocessing'
import Fireflies from './Fireflies'
import bgUrl from '@site/static/header/bg.jpg'
import starsUrl from '@site/static/header/stars.png'
import groundUrl from '@site/static/header/ground.png'
// import bearUrl from '@site/static/header/ying.png'
import leaves1Url from '@site/static/header/leaves1.png'
import leaves2Url from '@site/static/header/leaves2.png'
import '../materials/layerMaterial'

function Experience() {
  const scaleN = useAspect(1600, 1000, 1.05)
  const scaleW = useAspect(2200, 1000, 1.05)
  const textures = useTexture([
    bgUrl.src.src,
    starsUrl.src.src,
    groundUrl.src.src,
    // bearUrl.src.src,
    leaves1Url.src.src,
    leaves2Url.src.src,
  ])
  const group = useRef<Group>(null)
  const layersRef = useRef<Mesh[]>([])
  const [movement] = useState(() => new Vector3())
  const [temp] = useState(() => new Vector3())
  const layers = [
    { texture: textures[0], x: 0, y: 0, z: 0, factor: 0.005, scale: scaleW },
    { texture: textures[1], x: 0, y: 0, z: 10, factor: 0.005, scale: scaleW },
    { texture: textures[2], x: 0, y: 0, z: 20, scale: scaleW },
    // 角色
    // {
    //   texture: textures[3],
    //   x: -30,
    //   y: 0,
    //   z: 30,
    //   scaleFactor: 0.83,
    //   scale: scaleN,
    // },
    {
      texture: textures[3],
      x: 0,
      y: 0,
      z: 40,
      factor: 0.03,
      scaleFactor: 1,
      wiggle: 0.6,
      scale: scaleW,
    },
    {
      texture: textures[4],
      x: -20,
      y: -20,
      z: 49,
      factor: 0.04,
      scaleFactor: 1.3,
      wiggle: 1,
      scale: scaleW,
    },
  ]

  useFrame((state, delta) => {
    movement.lerp(temp.set(state.pointer.x, state.pointer.y * 0.2, 0), 0.2)
    if (group.current) {
      group.current.position.x = MathUtils.lerp(
        group.current.position.x,
        state.pointer.x * 20,
        0.05,
      )

      group.current.rotation.x = MathUtils.lerp(
        group.current.rotation.x,
        state.pointer.y / 20,
        0.05,
      )

      group.current.rotation.y = MathUtils.lerp(
        group.current.rotation.y,
        -state.pointer.x / 2,
        0.05,
      )
    }

    //@ts-ignore
    layersRef.current[3].uniforms.time.value = layersRef.current[4].uniforms.time.value += delta
  }, 1)

  return (
    <group ref={group}>
      <Fireflies count={20} radius={80} colors={['orange']} />
      {layers.map(({ scale, texture, ref, factor = 0, scaleFactor = 1, wiggle = 0, x, y, z }, i) => (
        <Plane
          key={i}
          scale={scale}
          args={[1, 1, wiggle ? 10 : 1, wiggle ? 10 : 1]}
          position={[x, y, z]}
          ref={ref}
        >
          {/* @ts-ignore */}
          <layerMaterial
            movement={movement}
            textr={texture}
            factor={factor}
            ref={(el) => (layersRef.current[i] = el)}
            wiggle={wiggle}
            scale={scaleFactor}
          />
        </Plane>
      ))}
      <Html
        transform
        scale={25}
        position={[-30, 0, -70]}
        zIndexRange={[1, 1]}
        style={{
          width: '200px',
          color: 'white',
          pointerEvents: 'none',
        }}>
        <Live2D
          modelUrl="/header/live2d/纳西妲.model3.json"
          scale={0.83}
          position={[0, -40]}
        />
      </Html>
    </group>
  )
}

function Effects() {
  const ref = useRef<any>(null)
  useLayoutEffect(() => {
    if (ref.current) {
      const maskMaterial = ref.current.maskPass?.getFullscreenMaterial()
      maskMaterial.maskFunction = MaskFunction.MULTIPLY_RGB_SET_ALPHA
    }
  })
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <DepthOfField
        ref={ref}
        target={[0, 0, 30]}
        bokehScale={8}
        focalLength={0.1}
        width={1024}
      />
      <Vignette />
    </EffectComposer>
  )
}

export default function Scene() {
  return (
    <Canvas>
      <Experience />
      <Effects />
    </Canvas>
  )
}

function Canvas({ children }: { children: React.ReactNode }) {
  extend({ Mesh, PlaneGeometry, Group })
  const canvas = useRef<HTMLCanvasElement>(null)
  const root = useRef<ReconcilerRoot<HTMLCanvasElement>>(null)

  useLayoutEffect(() => {
    let mounted = true

    const resize = () => {
      //@ts-ignore
      root.current && root.current?.configure({ width: window.innerWidth, height: window.innerHeight })

      return () => window.removeEventListener('resize', resize)
    }

    const renderCanvas = async () => {
      if (!canvas.current) return

      root.current = await createRoot<HTMLCanvasElement>(canvas.current).configure({
        events,
        orthographic: true,
        gl: { antialias: false },
        camera: { zoom: 5, position: [0, 0, 200], far: 300, near: 50 },
        onCreated: (state) => {
          // state.events.connect(canvas.current)
          //@ts-ignore 放到外层
          state.events.connect(document.getElementById('home__header') as HTMLDivElement)
          state.setEvents({
            compute: (event, state) => {
              state.pointer.set(
                (event.clientX / state.size.width) * 2 - 1,
                -(event.clientY / state.size.height) * 2 + 1,
              )
              state.raycaster.setFromCamera(state.pointer, state.camera)
            },
          })
        },
      })

      root.current.render(children)

      window.addEventListener('resize', resize)
    }

    renderCanvas()

    return () => {
      mounted = false
      if (root.current) {
        root.current?.unmount()
        window.removeEventListener('resize', resize)
      }
    }

  }, [children])

  return (
    <canvas
      ref={canvas}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'block',
      }}
    />
  )
}
