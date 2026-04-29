/* ============================================
   THREE.JS HERO SCENE — Editorial 3D Art
   A floating, interactive glass-like geometry
   ============================================ */

(function () {
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
    const group = new THREE.Group();
    scene.add(group);

    let mainGeometry;
    const isArchive = window.location.pathname.includes('work.html');
    const isProject = window.location.pathname.includes('project.html');

    if (isArchive) {
        mainGeometry = new THREE.IcosahedronGeometry(1.5, 1);
    } else if (isProject) {
        mainGeometry = new THREE.OctahedronGeometry(1.8, 0);
    } else {
        mainGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    }

    const material = new THREE.MeshStandardMaterial({
        color: 0x1A1A1A,
        metalness: 0.9,
        roughness: 0.2,
        transparent: true,
        opacity: 0.05,
    });

    const mainMesh = new THREE.Mesh(mainGeometry, material);
    group.add(mainMesh);

    // Decorative wireframe
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xC45D3E,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const wireMesh = new THREE.Mesh(mainGeometry, wireMaterial);
    wireMesh.scale.setScalar(1.01);
    mainMesh.add(wireMesh);

    // --- ADD FLOATING SHARDS (Background graphics) ---
    const shards = [];
    const shardGeom = new THREE.TetrahedronGeometry(0.5, 0);
    for (let i = 0; i < 15; i++) {
        const shard = new THREE.Mesh(shardGeom, material);
        shard.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10
        );
        shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        const s = Math.random() * 0.5 + 0.2;
        shard.scale.set(s, s, s);
        shard.userData.speed = Math.random() * 0.01 + 0.005;
        group.add(shard);
        shards.push(shard);
    }

    // --- ADD THE SCROLL-FOLLOWER (Moving Crystal) ---
    const followerGeom = new THREE.IcosahedronGeometry(0.8, 0);
    const followerMaterial = new THREE.MeshStandardMaterial({
        color: 0xC45D3E,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.4
    });
    const follower = new THREE.Mesh(followerGeom, followerMaterial);
    scene.add(follower);

    // Follower Wireframe
    const fWire = new THREE.Mesh(followerGeom, new THREE.MeshBasicMaterial({ color: 0xC45D3E, wireframe: true, transparent: true, opacity: 0.3 }));
    fWire.scale.setScalar(1.05);
    follower.add(fWire);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0xC45D3E, 5);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xD4A853, 3);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    // --- INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;
    let targetX = 0;
    let targetY = 0;
    let targetScroll = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    }, { passive: true });

    // --- ANIMATION REEL ---
    const animate = () => {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / (totalHeight || 1);

        // Smoothly follow the mouse & scroll
        targetX += (mouseX * 0.5 - targetX) * 0.05;
        targetY += (mouseY * 0.5 - targetY) * 0.05;
        targetScroll += (scrollProgress - targetScroll) * 0.05;

        // Influence the background group
        group.rotation.x = targetScroll * 2;
        group.rotation.y = targetX * 0.5;
        group.position.y = targetScroll * 2;

        // --- FOLLOWER LOGIC ---
        // Moves from top to bottom as we scroll
        // Screen Y range in Three.js units is roughly -3 to 3 depending on camera/aspect
        follower.position.y = 4 - (targetScroll * 8);
        follower.position.x = Math.sin(targetScroll * Math.PI) * 2 + (targetX * 2);
        follower.rotation.x += 0.01;
        follower.rotation.z += 0.015;
        follower.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

        // Main object rotation
        mainMesh.rotation.z += 0.005;
        mainMesh.rotation.y += 0.002;

        // Shards animation
        shards.forEach((shard, i) => {
            shard.rotation.x += shard.userData.speed;
            shard.rotation.y += shard.userData.speed;
            shard.position.y += Math.sin(time + i) * 0.002;
        });

        renderer.render(scene, camera);
    };

    // --- RESPONSIVE ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();

    // Night Mode Color Swap
    const updateColors = () => {
        const isNight = document.body.classList.contains('night-mode');
        if (isNight) {
            material.color.setHex(0xE8E3DE);
            material.opacity = 0.04;
            wireMaterial.opacity = 0.05;
            followerMaterial.color.setHex(0xD4A853);
            followerMaterial.opacity = 0.3;
        } else {
            material.color.setHex(0x1A1A1A);
            material.opacity = 0.05;
            wireMaterial.opacity = 0.08;
            followerMaterial.color.setHex(0xC45D3E);
            followerMaterial.opacity = 0.4;
        }
    };

    const observer = new MutationObserver(updateColors);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    updateColors();

})();
