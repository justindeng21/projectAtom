import * as Three from 'three'
import './styles/home.css'
import {useEffect, useRef} from "react"
import { OrbitControls } from 'three/examples/jsm/Addons.js';




class StarCluster{





    constructor(nStars : number,rotateRate : number){
        this.cluster = new Three.Object3D()
        this.stars = []
        this.createStars(nStars)
        this.xRate = this.getRandomArbitrary(-4,5)*rotateRate
        this.yRate = this.getRandomArbitrary(-4,5)*rotateRate
        this.zRate = this.getRandomArbitrary(-4,5)*rotateRate

        const pointLight = new Three.PointLight(0xADD8E6,10)


        let pointLightpositionX = this.stars[0].position.x * 2
        let pointLightpositionY = this.stars[0].position.y * 2
        let pointLightpositionZ = this.stars[0].position.z * 2
        pointLight.position.set(pointLightpositionX,pointLightpositionY,pointLightpositionZ)
        this.cluster.add(pointLight)
        
        this.pointLightHelper = new Three.PointLightHelper(pointLight)
        this.pointLightHelper
        this.cluster.add(this.pointLightHelper)

    }
    
    getRandomArbitrary(min : number, max: number) {
        return Math.random() * (max - min) + min;
    }

    createStar(){
        const sphereGeometry = new Three.SphereGeometry( 0.15, 24, 24 ); 
        const sphereMaterial = new Three.MeshLambertMaterial( { color: 0xADD8E6} ); 
        const star = new Three.Mesh( sphereGeometry, sphereMaterial );
        const [x,y,z] = new Array(3).fill(3).map(() => Three.MathUtils.randFloatSpread(50));

        const xPolar = Math.sqrt(x * x + y * y + z * z) * this.getRandomArbitrary(-1,1)
        const yPolar = Math.acos(x / Math.sqrt(x * x + y * y)) * (y < 0 ? -1 : 1) * this.getRandomArbitrary(-1,1)
        const zPolar = Math.acos(z / Math.sqrt(x * x + y * y + z * z)) * this.getRandomArbitrary(-1,1)
        star.position.set(xPolar,yPolar,zPolar)

        if(this.getRandomArbitrary(-1,1) < 0){
            star.position.set(xPolar,yPolar,zPolar)
        }
        else{
            star.position.set(zPolar,yPolar,xPolar)
        }


        this.stars.push(star)
        this.cluster.add(star)        
    }

    createStars(nStars : number){
        for(var i = 0; i < nStars; i++){
            this.createStar()
        }
    }

    getCluster(){
        return this.cluster
    }
    rotate(){
        this.cluster.rotateX(this.xRate)
        this.cluster.rotateY(this.yRate)
        this.cluster.rotateZ(this.zRate)
        this.pointLightHelper.rotation.y -= 0.1



    }


    cluster : Three.Object3D;
    stars : Array<Three.Mesh>;
    xRate : number;
    yRate : number;
    zRate : number;
    pointLightHelper : Three.PointLightHelper
}


class Animation{

    clusters : Array<StarCluster>
    scene : Three.Scene
    camera : Three.PerspectiveCamera
    renderer : Three.WebGLRenderer
    controls : OrbitControls
    sphere : Three.Mesh

    constructor(){
        this.scene = new Three.Scene();

        this.camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.setZ(40)

        this.renderer = new Three.WebGLRenderer({
            canvas: document.querySelector("#backgroundScene")!
        })
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.renderer.render(this.scene,this.camera)
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;


        const geometry = new Three.SphereGeometry( 7, 13, 13 ); 
        const material = new Three.MeshBasicMaterial( { color: 0xffffff, wireframe:true }); 



        this.sphere = new Three.Mesh( geometry, material );
        this.scene.add(this.sphere)
 


        

        this.clusters = []

        for(var i = 0; i < 20; i++){
            var cluster = new StarCluster(10,0.001);
            this.clusters.push(cluster)
            this.scene.add(cluster.getCluster())
        }

        
    }

    calcNextFrame(){
        for(var i = 0; i < this.clusters.length; i++){
            this.clusters[i].rotate()
            this.clusters[i].rotate()
            this.clusters[i].rotate()
        }
        this.scene.rotateY(0.00005)
        this.scene.rotateX(0.00005)
        this.scene.rotateZ(0.00005)
        this.sphere.rotation.z -=0.01
    }



}









function App() {

    const refContainer = useRef(null);
    
    let animation : Animation
    useEffect(()=>{

        animation = new Animation()

        function animate() {
            requestAnimationFrame(animate);
    
            animation.calcNextFrame()
            animation.renderer.render(animation.scene, animation.camera);
        };
        animate()
    })

    return (
        <div>
            <canvas id='backgroundScene'></canvas>
            <div ref={refContainer}></div>
            <div id='overlay'>
                
            <button id='navButton'>☰</button>
            <ul id='navBar'>
                <li><a href="#">Home</a></li>
                <li><a href="https://github.com/justindeng21/projectAtom">GitHub</a></li>

            </ul>
            </div>
        
        </div>
    )
}

export default App
