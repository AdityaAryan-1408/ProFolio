"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 2.5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const container = containerRef.current;
        container.appendChild(renderer.domElement);

        const geometry = new THREE.IcosahedronGeometry(1, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0xccff00,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const innerGeo = new THREE.IcosahedronGeometry(0.5, 0);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.1,
        });
        const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerMesh);

        const clock = new THREE.Clock();
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (event: MouseEvent) => {
            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;
            mouseX = event.clientX - windowHalfX;
            mouseY = event.clientY - windowHalfY;
        };

        document.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
            mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);
            mesh.rotation.z += 0.002;

            innerMesh.rotation.y -= 0.005;
            innerMesh.rotation.x -= 0.005;

            const scale = 1 + Math.sin(time) * 0.05;
            mesh.scale.set(scale, scale, scale);

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("mousemove", handleMouseMove);
            if (container) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            id="canvas-container"
            className="fixed top-0 left-0 w-full h-screen -z-10 opacity-40 pointer-events-none"
        />
    );
}