import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
// import easing from './easing.js';
import metaversefile from 'metaversefile';
// import {getCaretAtPoint} from 'troika-three-text';
const {useApp, useInternals, useGeometries, useMaterials, getAppByPhysicsId, useFrame, useActivate, useLoaders, usePhysics, useTextInternal, addTrackedApp, useDefaultModules, useCleanup} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default e => {
  const app = useApp();
  // const {renderer, scene, camera} = useInternals();
  const physics = usePhysics();
  // const {CapsuleGeometry} = useGeometries();
  // const {WebaverseShaderMaterial} = useMaterials();
  // const Text = useTextInternal();

  let morpher = null;
  // const speed = 0.03;
  // const angularSpeed = 0.02;
  (async () => {
    morpher = await metaversefile.createAppAsync(`${baseUrl}morpher_mixed_v3_vian.glb`);
    // morpher.quaternion.copy(y180Quaternion);
    morpher.frustumCulled = false;
    app.add(morpher);
  })();

  // let running = false;
  useFrame(({timestamp}) => {
    
  });

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
    /* // console.log('silk worm hit', e);

    const {hitDirection} = e;
    const hitDirectionXZ = hitDirection.clone();
    hitDirectionXZ.y = 0;
    hitDirectionXZ.normalize();

    const hitVelocity = hitDirectionXZ.clone();
    hitVelocity.y = 0.5 + Math.random();
    hitVelocity.normalize().multiplyScalar(hitSpeed);

    silkWormAction = hitAction(hitDirectionXZ, hitVelocity); */
  });

  const physicsIds = [];
  const physicsMaterial = new THREE.Vector3(0.5, 0.5, 1);
  const physicsObject = physics.addCapsuleGeometry(app.position, app.quaternion, 0.3, 0.2, physicsMaterial);
  physicsObject.detached = true;
  physicsIds.push(physicsObject);
  
  useCleanup(() => {
    for (const physicsId of physicsIds) {
      physics.removeGeometry(physicsId);
    }
  });

  return app;
};