import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const Spotlight = () => (
  <div style={{ height: '100%', position: 'relative', width: '600px' }}>
    <VinylScene />
  </div>
);

const VinylScene = () => {
  const [model, setModel] = useState(null);
  const [textures, setTextures] = useState({});
  const scale = 0.15; // Initial scale
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const loadTextures = () => {
      const textureLoader = new THREE.TextureLoader();

      setTextures({
        aoTexture: textureLoader.load('/vinyl-object/textures/internal_ground_ao_texture.jpeg'),
        normalTexture: textureLoader.load('/vinyl-object/textures/vinyl_normal.png'),
        roughnessTexture: textureLoader.load('/vinyl-object/textures/vinyl_roughness.png'),
      });
    };

    const loadModel = () => {
      const loader = new FBXLoader();
      loader.load(
        '/vinyl-object/source/vinyl.fbx',
        (fbx) => {
          fbx.rotation.x = Math.PI / 2; // Rotate model
          setModel(fbx);
        },
        undefined,
        (error) => console.error('Error loading model:', error),
      );
    };

    loadTextures();
    loadModel();
  }, []);

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight intensity={1} position={[5, 5, 5]} />

        {model && textures.aoTexture && textures.normalTexture && textures.roughnessTexture && (
          <primitive
            object={model}
            scale={scale}
            position={[0, 0, 0]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={() => (window.location.href = '/discography')}
          >
            <meshStandardMaterial
              attach="material"
              map={textures.aoTexture}
              normalMap={textures.normalTexture}
              roughnessMap={textures.roughnessTexture}
              color={hovered ? new THREE.Color(0xffff00) : new THREE.Color(0xffffff)}
            />
          </primitive>
        )}

        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Spotlight;
