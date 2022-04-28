import * as THREE from 'three';
// import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
// import easing from './easing.js';
import metaversefile from 'metaversefile';
// import {getCaretAtPoint} from 'troika-three-text';
const {useApp, useFrame, useActivate, useWear, usePhysics, useCleanup} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default e => {
  const app = useApp();
  // const {renderer, scene, camera} = useInternals();
  const physics = usePhysics();
  // const {CapsuleGeometry} = useGeometries();
  // const {WebaverseShaderMaterial} = useMaterials();
  // const Text = useTextInternal();

  let morpher = null;
  let head = null;
  // const speed = 0.03;
  // const angularSpeed = 0.02;
  (async () => {
    morpher = await metaversefile.createAppAsync({
      start_url: `${baseUrl}morpher_mixed_v6_texta_work.glb`,
    });
    // morpher.quaternion.copy(y180Quaternion);
    morpher.frustumCulled = false;
    app.add(morpher);

    head = morpher.getObjectByName('Sphere028');
  })();

  // let running = false;
  /* useFrame(({timestamp}) => {
    
  }); */

  /* let activateCb = null;
  let frameCb = null;
  useActivate(() => {
    activateCb && activateCb();
  }); */
  useFrame(({timestamp, timeDiff}) => {
    // frameCb && frameCb();
    // material.uniforms.time.value = (performance.now() / 1000) % 1;
  });

  app.addEventListener('hit', e => {
    /* const {hitDirection} = e;
    const hitDirectionXZ = hitDirection.clone();
    hitDirectionXZ.y = 0;
    hitDirectionXZ.normalize();

    const hitVelocity = hitDirectionXZ.clone();
    hitVelocity.y = 0.5 + Math.random();
    hitVelocity.normalize().multiplyScalar(hitSpeed);

    silkWormAction = hitAction(hitDirectionXZ, hitVelocity); */
  });
  
  useActivate(() => {
    if (morpher) {
      head.material.emissiveMap.offset.x = Math.floor(Math.random() * 8) / 8;
      head.material.emissiveMap.offset.y = Math.floor(Math.random() * 8) / 8;

      head.material.emissive.setHex(0x66bb6a);

      // console.log('got glb', morpher.glb);
    }
  });

  const animationMixers = [];
  useFrame(({timestamp, timeDiff}) => {
    if (morpher) {
      const deltaSeconds = timeDiff / 1000;
      for (const mixer of animationMixers) {
        mixer.update(deltaSeconds);
        morpher.updateMatrixWorld();
      }
    }
  });

  useWear(e => {
    if (morpher) {
      morpher.stop();

      if (e.wear) {
        morpher.traverse(o => {
          if (o.isMesh) {
            const {animations} = morpher.glb;
            const animationName = 'watch_idle';
            const animation = animations.find(a => a.name === animationName);
            if (animation) {
              const mixer = new THREE.AnimationMixer(o);
              
              const action = mixer.clipAction(animation);
              action.play();

              animationMixers.push(mixer);
            }
          }
        });
      } else {
        for (const mixer of animationMixers) {
          mixer.stopAllAction();
        }
        animationMixers.length = 0;
      }
    }
  });

  const physicsIds = [];
  const physicsMaterial = [0.5, 0.5, 1];
  const materialAddress = physics.createMaterial(physicsMaterial);
  const physicsObject = physics.addCapsuleGeometry(app.position, app.quaternion, 0.3, 0.2, materialAddress);
  // physicsObject.detached = true;
  physicsIds.push(physicsObject);
  
  useCleanup(() => {
    for (const physicsId of physicsIds) {
      physics.removeGeometry(physicsId);
    }
    physics.destroyMaterial(materialAddress);
  });

  app.getPhysicsObjects = () => physicsIds;

  return app;
};
