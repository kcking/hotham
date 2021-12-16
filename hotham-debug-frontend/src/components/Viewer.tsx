import { ArcballControls, Box, Cylinder, Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { ViewOptions } from './ViewOptions';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import THREE, { Euler, Mesh } from 'three';
import { Entity, Transform } from '../App';

const CanvasContainer = styled.div`
  display: flex;
  overflow: hidden;
  width: 80vw;
  height: 80vh;
  flex: 1;
`;

const OuterContainer = styled.div`
  display: 'flex';
  flex-direction: 'column';
`;

type GLTFResult = GLTF & {
  nodes: Record<string, Mesh>;
};

export interface DisplayOptions {
  models?: boolean;
  physics?: boolean;
}

function Model({
  mesh,
  transform,
}: {
  mesh: Mesh;
  transform: Transform;
}): JSX.Element {
  const group = useRef<THREE.Group>();
  const rotation = getRotation(transform);
  return (
    <group ref={group} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={mesh.geometry}
        material={mesh.material}
        position={transform.translation}
        scale={transform.scale}
        rotation={rotation}
        userData={{ name: 'Environment' }}
      />
    </group>
  );
}

function getRotation(t: Transform): Euler {
  const r = t.rotation;
  return new Euler(r[0], r[1], r[2]);
}

interface Props {
  entities: Record<number, Entity>;
}

function getModels(
  entities: Record<number, Entity>,
  nodes: Record<string, Mesh>
): JSX.Element[] | [] {
  const elements: JSX.Element[] = [];
  for (let e of Object.values(entities)) {
    const key = e.name.replaceAll(' ', '_');
    const node = nodes[key];
    if (!node) {
      console.warn('No node found for', key);
      continue;
    }

    if (node.children.length) {
      for (let child of node.children) {
        const m = child as Mesh;
        elements.push(
          <Model key={child.id} mesh={m} transform={e.transform!} />
        );
      }
    } else {
      elements.push(
        <Model key={node.id} mesh={node} transform={e.transform!} />
      );
    }
  }

  return elements;
}

export function Viewer({ entities }: Props): JSX.Element {
  const [displays, setDisplays] = useState<DisplayOptions>({ models: true });
  const gltf = useGLTF('/beat_saber.glb') as unknown as GLTFResult;
  const { nodes } = gltf;
  return (
    <OuterContainer>
      <ViewOptions displays={displays} setDisplays={setDisplays} />
      <CanvasContainer>
        <Canvas shadows={true}>
          {displays.models && getModels(entities, nodes)}
          {displays.physics && getPhsicsObjects(entities)}
          <Environment preset="studio" />
          <ArcballControls />
        </Canvas>
      </CanvasContainer>
    </OuterContainer>
  );
}
function getPhsicsObjects(
  entities: Record<number, Entity>
): JSX.Element[] | [] {
  const elements: JSX.Element[] = [];
  Object.values(entities).forEach((e) => {
    const { collider, transform } = e;
    if (!collider) return;

    const { colliderType, geometry, translation } = collider;
    const rotation = getRotation(transform!); // safe: entity with collider and no transform is non-sensical

    if (colliderType === 'cube') {
      elements.push(
        <Box
          position={translation}
          rotation={rotation}
          args={[geometry[0] * 2, geometry[1] * 2, geometry[2] * 2]}
        >
          <meshPhongMaterial attach="material" color="#bbb" wireframe />
        </Box>
      );
    }

    if (colliderType === 'cylinder') {
      const height = geometry[0] * 2;
      const radius = geometry[1];
      elements.push(
        <Cylinder
          args={[radius, radius, height]}
          position={translation}
          rotation={rotation}
        >
          <meshPhongMaterial attach="material" color="#bbb" wireframe />
        </Cylinder>
      );
    }
  });
  return elements;
}
