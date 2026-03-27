/* ============================================
   THREE.JS HERO SCENE — Editorial 3D Art
   A floating, interactive glass-like geometry
   ============================================ */

(function() {
    const canvas = document.querySelector('#threeCanvas');
    if (!canvas) return;

    // --- SETUP ---
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // --- OBJECTS ---
    let geometry;
    const isArchive = window.location.pathname.includes('work.html');
    const isProject = window.location.pathname.includes('project.html');

    if (isArchive) {
        // Archive Page: A distorted Icosahedron (Floating Orb)
        geometry = new THREE.IcosahedronGeometry(1.5, 10);
    } else if (isProject) {
        // Project Page: A clean, technical Octahedron
        geometry = new THREE.OctahedronGeometry(1.8, 2);
    } else {
        // Home Page: The original Torus Knot
        geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 200, 32);
    }
    
    // Custom "Glassy" material using the portfolio palette
    const material = new THREE.MeshStandardMaterial({
        color: 0x1A1A1A,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.08,
        wireframe: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Decorative wireframe overlay
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xC45D3E,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    wireMesh.scale.setScalar(1.001);
    mesh.add(wireMesh);

    // Dynamic Gooey Effect for Archive/Project
    const positionAttribute = geometry.getAttribute('position');
    const vertex = new THREE.Vector3();

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0xC45D3E, 2);
    light1.position.set(2, 3, 4);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xD4A853, 2);
    light2.position.set(-2, -3, 4);
    scene.add(light2);

    // --- INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // --- ANIMATION REEL ---
    const animate = () => {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        // Gooey distortion for Archive page
        if (isArchive || isProject) {
            for (let i = 0; i < positionAttribute.count; i++) {
                vertex.fromBufferAttribute(positionAttribute, i);
                const distance = vertex.length();
                const distortion = Math.sin(vertex.x * 2 + time) * 0.1 +
                                 Math.sin(vertex.y * 2 + time) * 0.1;
                vertex.normalize().multiplyScalar(1.5 + distortion);
                positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
            }
            positionAttribute.needsUpdate = true;
        }

        // Slow, elegant base rotation
        mesh.rotation.x += 0.002;
        mesh.rotation.y += 0.003;

        // Smoothly follow the mouse (parallax)
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        mesh.position.x += (targetX - mesh.position.x) * 0.05;
        mesh.position.y += (-targetY - mesh.position.y) * 0.05;

        // Subtle scale pulse
        const s = 1 + Math.sin(time) * 0.02;
        mesh.scale.set(s, s, s);

        renderer.render(scene, camera);
    };

    // --- RESPONSIVE ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();

    // Night Mode Color Swap (Optional, but elegant)
    const updateColors = () => {
        const isNight = document.body.classList.contains('night-mode');
        if (isNight) {
            material.color.setHex(0xE8E3DE);
            material.opacity = 0.05;
            wireMaterial.opacity = 0.05;
        } else {
            material.color.setHex(0x1A1A1A);
            material.opacity = 0.08;
            wireMaterial.opacity = 0.1;
        }
    };

    // Watch for theme changes
    const observer = new MutationObserver(updateColors);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    updateColors(); // Initial call

})();
