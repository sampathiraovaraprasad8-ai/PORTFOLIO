document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // --- LENIS SMOOTH SCROLL ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // --- THREE.JS BACKGROUND ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvas3d'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Geometry: A wavy plane
    const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -10;
    scene.add(plane);

    camera.position.z = 20;

    // Mouse interaction for Three.js
    let planeMouseX = 0;
    let planeMouseY = 0;
    window.addEventListener('mousemove', (e) => {
        planeMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        planeMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    const clock = new THREE.Clock();

    function animate3D() {
        const elapsedTime = clock.getElapsedTime();
        
        // Distort geometry vertices
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            // Simple sine wave distortion
            positions[i + 2] = Math.sin(x * 0.1 + elapsedTime) * 2 + Math.cos(y * 0.1 + elapsedTime) * 2;
        }
        geometry.attributes.position.needsUpdate = true;

        plane.rotation.z += 0.001;
        plane.rotation.y = planeMouseX * 0.1;
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate3D);
    }
    animate3D();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- GSAP ANIMATIONS ---
    // Hero Animations
    const heroTl = gsap.timeline();
    heroTl.from('.hero-tagline', { opacity: 0, y: 20, duration: 1, delay: 0.5 })
          .from('.hero-title .line', { 
            y: 200, 
            skewY: 10,
            stagger: 0.2, 
            duration: 1.5, 
            ease: 'power4.out' 
          }, '-=0.8')
          .from('.hero-footer p', { opacity: 0, y: 20, duration: 1 }, '-=1')
          .from('.scroll-down', { scaleY: 0, transformOrigin: 'top', duration: 1 }, '-=0.5');

    // Generic reveal animation for elements with .reveal class
    gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    });

    // Parallax effect for project images
    gsap.utils.toArray('.project-view img').forEach((img) => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            scale: 1.2,
            y: -50
        });
    });

    // Horizontal text scroll effect for the logo span (just for extra flair)
    gsap.to('.logo span', {
        color: '#ff00e5',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
});
