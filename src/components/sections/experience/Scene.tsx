"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ExperienceCard, ExperienceData } from "./ExperienceCard";
import * as THREE from "three";

const EXPERIENCES: ExperienceData[] = [
  {
    company: "OnePlay",
    role: "Product Support & Testing Associate",
    duration: "2025 - Present",
    description: [
      "Triage and resolve technical support tickets, diagnosing service-level issues including connectivity, streaming, and account or session errors.",
      "Collaborate with engineering and QA teams to reproduce edge cases and validate fixes before rollout.",
      "Document recurring issues and contribute to the internal knowledge base to reduce repeat escalations.",
      "Provide tier-1 and tier-2 technical troubleshooting for end users across OnePlay's cloud gaming and streaming platform.",
    ],
  },
  {
    company: "OnePlay",
    role: "Assistant Support Executive",
    duration: "May 2024 - Dec 2024",
    description: [
      "Managed day-to-day support operations, overseeing ticket queues and escalation workflows.",
      "Coordinated with support team members to ensure SLA compliance on issue resolution.",
      "Analyzed recurring customer pain points and relayed technical feedback to product and engineering teams.",
    ],
  },
];

const VIEW_DISTANCE = 8;
const TRAVEL_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 8),
    new THREE.Vector3(-4, 2.5, -2),
    new THREE.Vector3(-10, -1.5, -14),
    new THREE.Vector3(-4, -5, -25),
    new THREE.Vector3(8, 2.5, -36),
    new THREE.Vector3(12, 5, -48),
  ],
  false,
  "catmullrom",
  0.62
);

const START_STATION = TRAVEL_PATH.getPointAt(0);
const END_STATION = TRAVEL_PATH.getPointAt(1);
const START_CARD_POSITION = START_STATION.clone().add(
  TRAVEL_PATH.getTangentAt(0).multiplyScalar(VIEW_DISTANCE)
);
const END_CARD_POSITION = END_STATION.clone().add(
  TRAVEL_PATH.getTangentAt(1).multiplyScalar(VIEW_DISTANCE)
);

interface SceneProps {
  scrollProgress: number;
  reduceMotion?: boolean;
  lowPowerMode?: boolean;
}

export function Scene({
  scrollProgress,
  reduceMotion = false,
  lowPowerMode = false,
}: SceneProps) {
  return (
    <>
      <color attach="background" args={["#01030f"]} />
      <fog attach="fog" args={["#02041a", 82, 190]} />

      <ambientLight intensity={0.32} />
      <directionalLight position={[12, 14, 6]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-12, -8, -12]} intensity={1} color="#5b72ff" />

      <NebulaField />
      <StellarVolume
        reduceMotion={reduceMotion}
        lowPowerMode={lowPowerMode}
      />
      <LuminousStars />

      <CameraController scrollProgress={scrollProgress} reduceMotion={reduceMotion} />

      <ExperienceCardWrapper
        data={EXPERIENCES[0]}
        index={0}
        position={START_CARD_POSITION}
        viewPosition={START_STATION}
        scrollProgress={scrollProgress}
      />
      <ExperienceCardWrapper
        data={EXPERIENCES[1]}
        index={1}
        position={END_CARD_POSITION}
        viewPosition={END_STATION}
        scrollProgress={scrollProgress}
      />
    </>
  );
}

interface ExperienceCardWrapperProps {
  data: ExperienceData;
  index: number;
  position: THREE.Vector3;
  viewPosition: THREE.Vector3;
  scrollProgress: number;
}

function ExperienceCardWrapper({
  data,
  index,
  position,
  viewPosition,
  scrollProgress,
}: ExperienceCardWrapperProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const quaternion = useMemo(() => {
    const anchor = new THREE.Object3D();
    anchor.position.copy(position);
    anchor.lookAt(viewPosition);
    return anchor.quaternion.clone();
  }, [position, viewPosition]);

  useFrame(() => {
    if (!cardRef.current) return;

    const stationProgress = index;
    const distance = Math.abs(scrollProgress - stationProgress);
    const opacity = 1 - THREE.MathUtils.smoothstep(distance, 0.07, 0.3);
    const lift = THREE.MathUtils.lerp(18, 0, opacity);
    const scale = THREE.MathUtils.lerp(0.96, 1, opacity);

    cardRef.current.style.opacity = opacity.toFixed(3);
    cardRef.current.style.visibility = opacity > 0.015 ? "visible" : "hidden";
    cardRef.current.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
  });

  return (
    <group position={position} quaternion={quaternion}>
      <ExperienceCard
        ref={cardRef}
        data={data}
        index={index}
        position={[0, 0, 0]}
      />
    </group>
  );
}

function createSeededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createNebulaTexture(size = 256) {
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x / (size - 1)) * 2 - 1;
      const ny = (y / (size - 1)) * 2 - 1;
      const distance = Math.sqrt(nx * nx + ny * ny);
      const falloff = Math.pow(Math.max(0, 1 - distance), 1.6);
      const filamentA = 0.5 + 0.5 * Math.sin(nx * 8 + Math.sin(ny * 5) * 2.5);
      const filamentB = 0.5 + 0.5 * Math.sin(ny * 11 - nx * 4.5);
      const filamentC =
        0.5 + 0.5 * Math.sin((nx + ny) * 15 + Math.sin(nx * 6));
      const turbulence =
        filamentA * 0.48 + filamentB * 0.32 + filamentC * 0.2;
      const alpha =
        falloff * (0.16 + Math.pow(Math.max(0, turbulence), 1.7) * 0.84);
      const offset = (y * size + x) * 4;

      data[offset] = 255;
      data[offset + 1] = 255;
      data[offset + 2] = 255;
      data[offset + 3] = Math.round(alpha * 255);
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createStarburstTexture(size = 256) {
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x / (size - 1)) * 2 - 1;
      const ny = (y / (size - 1)) * 2 - 1;
      const distance = Math.sqrt(nx * nx + ny * ny);
      const core = Math.exp(-distance * 34);
      const halo = Math.exp(-distance * 8) * 0.45;
      const horizontal =
        Math.exp(-Math.abs(ny) * 60) * Math.pow(Math.max(0, 1 - Math.abs(nx)), 5);
      const vertical =
        Math.exp(-Math.abs(nx) * 60) * Math.pow(Math.max(0, 1 - Math.abs(ny)), 5);
      const diagonalA =
        Math.exp(-Math.abs(nx - ny) * 45) *
        Math.pow(Math.max(0, 1 - distance), 8);
      const diagonalB =
        Math.exp(-Math.abs(nx + ny) * 45) *
        Math.pow(Math.max(0, 1 - distance), 8);
      const alpha = Math.min(
        1,
        core + halo + (horizontal + vertical) * 0.52 + (diagonalA + diagonalB) * 0.2
      );
      const offset = (y * size + x) * 4;

      data[offset] = 255;
      data[offset + 1] = 255;
      data[offset + 2] = 255;
      data[offset + 3] = Math.round(alpha * 255);
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function useNebulaTexture() {
  const texture = useMemo(() => createNebulaTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function useStarburstTexture() {
  const texture = useMemo(() => createStarburstTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

interface NebulaCloud {
  t: number;
  offset: [number, number, number];
  scale: [number, number];
  color: string;
  opacity: number;
  rotation: number;
}

function NebulaField() {
  const texture = useNebulaTexture();
  const galacticCorePosition = useMemo(
    () =>
      TRAVEL_PATH.getPointAt(0.5)
        .add(TRAVEL_PATH.getTangentAt(0.5).multiplyScalar(54))
        .add(new THREE.Vector3(0, 5, 0)),
    []
  );
  const clouds = useMemo<NebulaCloud[]>(
    () => [
      {
        t: 0.02,
        offset: [-28, 8, -18],
        scale: [92, 58],
        color: "#183cff",
        opacity: 0.14,
        rotation: 0.2,
      },
      {
        t: 0.12,
        offset: [18, -12, -24],
        scale: [88, 46],
        color: "#7427ff",
        opacity: 0.13,
        rotation: -0.45,
      },
      {
        t: 0.25,
        offset: [-22, -7, -20],
        scale: [82, 48],
        color: "#de2cff",
        opacity: 0.12,
        rotation: 0.62,
      },
      {
        t: 0.38,
        offset: [22, 10, -28],
        scale: [100, 56],
        color: "#155dff",
        opacity: 0.16,
        rotation: -0.2,
      },
      {
        t: 0.51,
        offset: [-19, 1, -22],
        scale: [96, 52],
        color: "#b51cff",
        opacity: 0.14,
        rotation: 0.35,
      },
      {
        t: 0.62,
        offset: [21, -10, -30],
        scale: [94, 54],
        color: "#006fff",
        opacity: 0.15,
        rotation: -0.6,
      },
      {
        t: 0.74,
        offset: [-24, 11, -25],
        scale: [88, 50],
        color: "#ed28b8",
        opacity: 0.12,
        rotation: 0.15,
      },
      {
        t: 0.86,
        offset: [18, 4, -24],
        scale: [92, 54],
        color: "#264bff",
        opacity: 0.15,
        rotation: -0.35,
      },
      {
        t: 0.98,
        offset: [-20, -9, -28],
        scale: [104, 58],
        color: "#7b2cff",
        opacity: 0.13,
        rotation: 0.52,
      },
    ],
    []
  );

  return (
    <group>
      <sprite
        position={galacticCorePosition}
        scale={[128, 72, 1]}
        rotation={[0, 0, 0.18]}
      >
        <spriteMaterial
          map={texture}
          color="#1747ff"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <sprite
        position={galacticCorePosition}
        scale={[106, 58, 1]}
        rotation={[0, 0, -0.42]}
      >
        <spriteMaterial
          map={texture}
          color="#a521ff"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <sprite
        position={galacticCorePosition}
        scale={[72, 38, 1]}
        rotation={[0, 0, 0.7]}
      >
        <spriteMaterial
          map={texture}
          color="#ff2ebd"
          transparent
          opacity={0.13}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {clouds.map((cloud, index) => {
        const position = TRAVEL_PATH.getPointAt(cloud.t).add(
          new THREE.Vector3(
            cloud.offset[0],
            cloud.offset[1],
            cloud.offset[2]
          )
        );

        return (
          <sprite
            key={`${cloud.t}-${index}`}
            position={position}
            scale={[cloud.scale[0], cloud.scale[1], 1]}
            rotation={[0, 0, cloud.rotation]}
          >
            <spriteMaterial
              map={texture}
              color={cloud.color}
              transparent
              opacity={cloud.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        );
      })}
    </group>
  );
}

const STAR_VERTEX_SHADER = `
  attribute float aSize;
  attribute float aTwinkle;

  varying vec3 vColor;
  varying float vBrightness;

  uniform float uTime;
  uniform float uPixelRatio;

  void main() {
    vColor = color;
    vBrightness = smoothstep(1.2, 4.8, aSize);

    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    float shimmer = 0.94 + sin(uTime * (0.45 + aTwinkle * 0.5) + aTwinkle * 18.0) * 0.06;
    float perspective = 92.0 / max(1.0, -viewPosition.z);

    gl_PointSize = clamp(aSize * uPixelRatio * perspective * shimmer, 0.85, 9.5);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const STAR_FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vBrightness;

  void main() {
    vec2 point = gl_PointCoord - vec2(0.5);
    float distanceToCenter = length(point);

    if (distanceToCenter > 0.5) discard;

    float core = pow(max(0.0, 1.0 - distanceToCenter * 2.0), 2.8);
    float halo = pow(max(0.0, 1.0 - distanceToCenter * 2.0), 1.25) * 0.42;
    float horizontal = exp(-abs(point.y) * 42.0) * smoothstep(0.5, 0.05, abs(point.x));
    float vertical = exp(-abs(point.x) * 42.0) * smoothstep(0.5, 0.05, abs(point.y));
    float diffraction = (horizontal + vertical) * vBrightness * 0.3;
    float alpha = min(1.0, core + halo + diffraction);

    gl_FragColor = vec4(vColor * (1.08 + vBrightness * 0.65), alpha);
  }
`;

function StellarVolume({
  reduceMotion = false,
  lowPowerMode = false,
}: Pick<SceneProps, "reduceMotion" | "lowPowerMode">) {
  const { size, gl } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const elapsedRef = useRef(0);
  const count = lowPowerMode ? 9000 : size.width < 640 ? 20000 : 32000;

  const { positions, colors, sizes, twinkles } = useMemo(() => {
    const random = createSeededRandom(83417);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const pointSizes = new Float32Array(count);
    const pointTwinkles = new Float32Array(count);
    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#dceaff"),
      new THREE.Color("#87baff"),
      new THREE.Color("#5672ff"),
      new THREE.Color("#c0a9ff"),
      new THREE.Color("#ffb7ec"),
      new THREE.Color("#fff2d0"),
    ];

    for (let i = 0; i < count; i += 1) {
      const inGalacticBand = random() < 0.38;
      let x: number;
      let y: number;
      let z: number;

      if (inGalacticBand) {
        x = -78 + random() * 156;
        z = -138 + random() * 184;
        const bandWave = Math.sin((x + z) * 0.045) * 7;
        y = bandWave + (random() - 0.5) * 22;
      } else {
        const radius = 2.8 + Math.pow(random(), 1.35) * 105;
        const angle = random() * Math.PI * 2;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius * 0.72;
        z = -142 + random() * 192;
      }

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const temperature = random();
      const paletteIndex =
        temperature < 0.54
          ? 0
          : temperature < 0.7
            ? 1
            : temperature < 0.82
              ? 2
              : temperature < 0.9
                ? 3
                : temperature < 0.95
                  ? 4
                  : temperature < 0.985
                    ? 5
                    : 6;
      const color = palette[paletteIndex];
      const luminosity = 0.62 + random() * 0.58;

      col[i * 3] = color.r * luminosity;
      col[i * 3 + 1] = color.g * luminosity;
      col[i * 3 + 2] = color.b * luminosity;

      const sizeRoll = random();
      pointSizes[i] =
        sizeRoll < 0.9
          ? 0.42 + random() * 0.78
          : sizeRoll < 0.985
            ? 1.25 + random() * 1.65
            : 3 + random() * 2.6;
      pointTwinkles[i] = random();
    }

    return {
      positions: pos,
      colors: col,
      sizes: pointSizes,
      twinkles: pointTwinkles,
    };
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.75) },
        },
        vertexShader: STAR_VERTEX_SHADER,
        fragmentShader: STAR_FRAGMENT_SHADER,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
      }),
    [gl]
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, delta) => {
    elapsedRef.current += delta;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = reduceMotion
        ? 0
        : elapsedRef.current;
    }

    if (pointsRef.current && !reduceMotion) {
      pointsRef.current.rotation.z += delta * 0.0007;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aTwinkle"
          args={[twinkles, 1]}
          count={count}
          array={twinkles}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive ref={materialRef} object={material} attach="material" />
    </points>
  );
}

function LuminousStars() {
  const texture = useStarburstTexture();
  const stars = useMemo(() => {
    const mainPosition = TRAVEL_PATH.getPointAt(0.5)
      .add(TRAVEL_PATH.getTangentAt(0.5).multiplyScalar(48))
      .add(new THREE.Vector3(0, 7, 0));
    const secondaryPosition = TRAVEL_PATH.getPointAt(0.72)
      .add(TRAVEL_PATH.getTangentAt(0.72).multiplyScalar(38))
      .add(new THREE.Vector3(-7, 5, 0));
    const destinationPosition = END_CARD_POSITION.clone().add(
      TRAVEL_PATH.getTangentAt(1).multiplyScalar(92)
    );

    return [
      {
        position: mainPosition,
        coreScale: 13,
        haloScale: 40,
        color: "#dbeaff",
        haloColor: "#3977ff",
      },
      {
        position: secondaryPosition,
        coreScale: 7,
        haloScale: 25,
        color: "#fff0ff",
        haloColor: "#b52cff",
      },
      {
        position: destinationPosition,
        coreScale: 24,
        haloScale: 88,
        color: "#e8f5ff",
        haloColor: "#2e70ff",
      },
    ];
  }, []);

  return (
    <group>
      {stars.map((star, index) => (
        <group key={index} position={star.position}>
          <sprite scale={[star.haloScale, star.haloScale, 1]}>
            <spriteMaterial
              map={texture}
              color={star.haloColor}
              transparent
              opacity={0.22}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
          <sprite scale={[star.coreScale, star.coreScale, 1]}>
            <spriteMaterial
              map={texture}
              color={star.color}
              transparent
              opacity={0.94}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
          <pointLight
            color={star.haloColor}
            intensity={7}
            distance={65}
            decay={1.7}
          />
        </group>
      ))}
    </group>
  );
}

function getTravelIntensity(progress: number) {
  const departure = THREE.MathUtils.smoothstep(progress, 0.07, 0.25);
  const arrival = 1 - THREE.MathUtils.smoothstep(progress, 0.75, 0.94);
  return departure * arrival;
}

function CameraController({ scrollProgress, reduceMotion }: SceneProps) {
  const currentProgress = useRef(scrollProgress);
  const previousProgress = useRef(scrollProgress);
  const currentFov = useRef(45);
  const position = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    currentProgress.current = THREE.MathUtils.damp(
      currentProgress.current,
      scrollProgress,
      reduceMotion ? 7 : 4.5,
      delta
    );

    const progress = THREE.MathUtils.clamp(currentProgress.current, 0, 1);
    const lookAheadProgress = Math.min(1, progress + 0.035);
    const travelIntensity = getTravelIntensity(progress);
    const velocity =
      Math.abs(progress - previousProgress.current) / Math.max(delta, 0.001);

    TRAVEL_PATH.getPointAt(progress, position);
    TRAVEL_PATH.getPointAt(lookAheadProgress, lookTarget);

    if (progress > 0.82) {
      const arrivalBlend = THREE.MathUtils.smoothstep(progress, 0.82, 0.98);
      lookTarget.lerp(END_CARD_POSITION, arrivalBlend);
    }

    state.camera.position.copy(position);
    state.camera.up.set(0, 1, 0);
    state.camera.lookAt(lookTarget);

    if (!reduceMotion) {
      const bank =
        Math.sin(progress * Math.PI * 2.35) * 0.13 * travelIntensity;
      state.camera.rotateZ(bank);
    }

    const targetFov =
      45 +
      (reduceMotion ? 0 : Math.min(velocity * 36, 6.5) + travelIntensity * 1.2);
    currentFov.current = THREE.MathUtils.damp(
      currentFov.current,
      targetFov,
      5,
      delta
    );

    const camera = state.camera as THREE.PerspectiveCamera;
    if (Math.abs(camera.fov - currentFov.current) > 0.01) {
      camera.fov = currentFov.current;
      camera.updateProjectionMatrix();
    }

    previousProgress.current = progress;
  });

  return null;
}
