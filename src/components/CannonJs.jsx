import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const CannonJs = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    //setup three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    //add orbitcontrols
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    //add lightings
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    //setup cannon.js physic world
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    //create ground
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    scene.add(groundMesh);

    const groundbody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
    });
    groundbody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );
    world.addBody(groundbody);

    //create sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.position.set(0, 5, 0);
    scene.add(sphereMesh);

    const sphereBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(1),
      position: new CANNON.Vec3(0, 5, 0),
    });
    world.addBody(sphereBody);

    //animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      //update physics world
      world.step(1 / 60);

      //sync three js object with cannon js bodies
      sphereMesh.position.copy(sphereBody.position);
      sphereMesh.quaternion.copy(sphereBody.quaternion);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    //handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={mountRef}></div>;
};
export default CannonJs;
